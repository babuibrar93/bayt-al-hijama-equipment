#!/usr/bin/env npx tsx
/**
 * Applies SQL files in supabase/migrations/ (sorted by filename).
 *
 * Requires DATABASE_URL (Postgres connection string) in .env.local:
 *   postgresql://postgres.[ref]:[password]@aws-0-….pooler.supabase.com:6543/postgres
 *
 * Get it from Supabase → Project Settings → Database → Connection string (URI).
 *
 * Or paste migration SQL in the Supabase SQL Editor.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const MIGRATIONS_DIR = join(ROOT, "supabase/migrations");

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

function listMigrations(onlyFile?: string): string[] {
  if (!existsSync(MIGRATIONS_DIR)) return [];
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  if (onlyFile) {
    const match = files.find(
      (f) => f === onlyFile || f.endsWith(onlyFile) || f.includes(onlyFile),
    );
    return match ? [match] : [];
  }
  return files;
}

async function main() {
  const env = loadEnv();
  const url = env.DATABASE_URL || env.SUPABASE_DB_URL;
  const only = process.argv[2];
  const migrations = listMigrations(only);

  if (!url) {
    console.error(
      "\nMissing DATABASE_URL in .env.local.\n" +
        "Add your Supabase Postgres URI, then re-run: npm run migrate\n" +
        "Or paste supabase/migrations/*.sql in the SQL Editor.\n" +
        "Latest indexes: supabase/migrations/20261004_admin_indexes.sql\n",
    );
    process.exit(1);
  }

  if (migrations.length === 0) {
    console.error(
      only
        ? `\nNo migration matching "${only}" in supabase/migrations/.\n`
        : "\nNo .sql files in supabase/migrations/.\n",
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    for (const file of migrations) {
      const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
      process.stdout.write(`Applying ${file}... `);
      await client.query(sql);
      console.log("ok");
    }
    console.log(`\n✅ ${migrations.length} migration(s) applied.\n`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
