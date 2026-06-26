#!/usr/bin/env npx tsx
/**
 * Seeds categories + products with real images into Supabase.
 *
 * Usage:
 *   npm run seed              # download images + upsert DB
 *   npm run seed -- --images  # download images only (no DB)
 *
 * Requires `.env.local` with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Images are saved to `public/products/` and uploaded to the `product-images` bucket.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  type SeedProduct,
} from "../src/lib/seed-catalog";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PRODUCTS_DIR = join(ROOT, "public", "products");
const BUCKET = "product-images";

const imagesOnly = process.argv.includes("--images");

function loadEnv(): Record<string, string> {
  const path = join(ROOT, ".env.local");
  if (!existsSync(path)) return {};
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  if (existsSync(dest)) {
    console.log(`  ✓ exists ${dest.replace(ROOT, "")}`);
    return true;
  }
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "BaytAlHijama-Seeder/1.0" },
    });
    if (!res.ok) {
      console.warn(`  ✗ failed (${res.status}) ${url}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    console.log(`  ↓ saved ${dest.replace(ROOT, "")}`);
    return true;
  } catch (err) {
    console.warn(`  ✗ error ${url}`, err);
    return false;
  }
}

async function downloadProductImages(product: SeedProduct): Promise<string[]> {
  const paths: string[] = [];
  for (let i = 0; i < product.imageSources.length; i++) {
    const dest = join(PRODUCTS_DIR, `${product.slug}-${i + 1}.jpg`);
    const ok = await downloadImage(product.imageSources[i], dest);
    if (ok) paths.push(dest);
  }
  return paths;
}

async function ensureBucket(
  supabase: ReturnType<typeof createClient>,
): Promise<void> {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return;

  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
  });
  if (error && !error.message.includes("already exists")) {
    throw new Error(`Could not create bucket "${BUCKET}": ${error.message}`);
  }
  console.log(`Created storage bucket "${BUCKET}"`);
}

async function uploadToStorage(
  supabase: ReturnType<typeof createClient>,
  localPath: string,
  storagePath: string,
): Promise<string | null> {
  const body = readFileSync(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, body, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) {
    console.warn(`  ✗ upload ${storagePath}: ${error.message}`);
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return publicUrl;
}

async function main() {
  mkdirSync(PRODUCTS_DIR, { recursive: true });

  console.log("\n📷 Downloading product images…\n");
  const localImages = new Map<string, string[]>();

  for (const product of SEED_PRODUCTS) {
    console.log(product.name);
    const files = await downloadProductImages(product);
    localImages.set(product.slug, files);
  }

  if (imagesOnly) {
    console.log("\nDone (images only).\n");
    return;
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.log(
      "\n⚠ Supabase credentials missing in .env.local — images saved locally only.",
    );
    console.log("  Add NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, then re-run.\n");
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("\n🗄 Seeding Supabase…\n");
  await ensureBucket(supabase);

  const categoryIds = new Map<string, string>();

  for (const cat of SEED_CATEGORIES) {
    const { error } = await supabase.from("categories").upsert(
      {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sort_order: cat.sort_order,
      },
      { onConflict: "slug" },
    );
    if (error) throw new Error(`Category ${cat.slug}: ${error.message}`);

    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", cat.slug)
      .single();

    if (data) categoryIds.set(cat.slug, data.id);
    console.log(`  category: ${cat.name}`);
  }

  for (const product of SEED_PRODUCTS) {
    const files = localImages.get(product.slug) ?? [];
    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const storagePath = `catalog/${product.slug}-${i + 1}.jpg`;
      const publicUrl = await uploadToStorage(supabase, files[i], storagePath);
      if (publicUrl) imageUrls.push(publicUrl);
    }

    const categoryId = categoryIds.get(product.categorySlug) ?? null;

    const { error } = await supabase.from("products").upsert(
      {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: imageUrls,
        features: product.features,
        badge: product.badge ?? null,
        badge_variant: product.badge_variant,
        category_id: categoryId,
        is_active: true,
        is_featured: product.is_featured,
      },
      { onConflict: "slug" },
    );

    if (error) throw new Error(`Product ${product.slug}: ${error.message}`);
    console.log(`  product: ${product.name} (${imageUrls.length} images)`);
  }

  console.log(
    `\n✅ Seeded ${SEED_CATEGORIES.length} categories and ${SEED_PRODUCTS.length} products.\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
