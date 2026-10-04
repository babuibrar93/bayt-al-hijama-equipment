#!/usr/bin/env npx tsx
/**
 * Seeds categories + products into Supabase.
 *
 * Usage:
 *   npm run seed              # replace catalog in DB (images if listed)
 *   npm run seed -- --images  # download images only (no DB)
 *
 * Requires `.env.local` with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Empty imageSources skip download/upload (add photos later in admin).
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
  if (product.imageSources.length === 0) return [];
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

  const needsImages = SEED_PRODUCTS.some((p) => p.imageSources.length > 0);
  const localImages = new Map<string, string[]>();

  if (needsImages || imagesOnly) {
    console.log("\n📷 Downloading product images…\n");
    for (const product of SEED_PRODUCTS) {
      if (product.imageSources.length === 0) {
        localImages.set(product.slug, []);
        continue;
      }
      console.log(product.name);
      const files = await downloadProductImages(product);
      localImages.set(product.slug, files);
    }
  } else {
    console.log("\n📷 No image sources in catalog — skipping downloads.\n");
    for (const product of SEED_PRODUCTS) {
      localImages.set(product.slug, []);
    }
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
      "\n⚠ Supabase credentials missing in .env.local — nothing written to DB.",
    );
    console.log(
      "  Add NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY, then re-run.\n",
    );
    return;
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("\n🗄 Seeding Supabase…\n");

  const { error: schemaCheck } = await supabase
    .from("products")
    .select("cost_price")
    .limit(1);
  if (schemaCheck) {
    console.error(
      "\n❌ Database is missing cost_price on products.\n" +
        "   1. Open Supabase → SQL Editor\n" +
        "   2. Run supabase/migrations/20261003_cost_purchases.sql (adds cost_price)\n" +
        "   3. Or set DATABASE_URL in .env.local and run: npm run migrate\n" +
        "   4. Re-run: npm run seed\n",
    );
    process.exit(1);
  }

  await ensureBucket(supabase);

  const categoryIds = new Map<string, string>();
  const keepCategorySlugs = new Set(SEED_CATEGORIES.map((c) => c.slug));

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

  // Replace catalog: order_items.product_id is ON DELETE SET NULL.
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (deleteError) {
    throw new Error(`Could not clear products: ${deleteError.message}`);
  }
  console.log("  cleared existing products");

  for (const product of SEED_PRODUCTS) {
    const files = localImages.get(product.slug) ?? [];
    const imageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const storagePath = `catalog/${product.slug}-${i + 1}.jpg`;
      const publicUrl = await uploadToStorage(supabase, files[i], storagePath);
      if (publicUrl) imageUrls.push(publicUrl);
    }

    const categoryId = categoryIds.get(product.categorySlug) ?? null;

    const { error } = await supabase.from("products").insert({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      cost_price: product.cost_price,
      stock: product.stock,
      images: imageUrls,
      features: product.features,
      category_id: categoryId,
      is_active: true,
      is_featured: product.is_featured,
    });

    if (error) throw new Error(`Product ${product.slug}: ${error.message}`);
    console.log(`  product: ${product.name}`);
  }

  const { data: allCats } = await supabase.from("categories").select("id, slug");
  for (const cat of allCats ?? []) {
    if (!keepCategorySlugs.has(cat.slug)) {
      await supabase.from("categories").delete().eq("id", cat.id);
      console.log(`  removed legacy category: ${cat.slug}`);
    }
  }

  console.log(
    `\n✅ Seeded ${SEED_CATEGORIES.length} categories and ${SEED_PRODUCTS.length} products.\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
