# Supabase Setup

Follow these steps once to connect the store to a database.

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Wait for it to finish provisioning.

## 2. Add environment variables

Copy `.env.local.example` (in the project root) to `.env.local` and fill in the
values from **Supabase > Project Settings > API**:

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key (keep secret)
- `NEXT_PUBLIC_SITE_URL` — your deployed URL (use `http://localhost:3000` locally)

## 3. Run the schema

In **Supabase > SQL Editor**, paste and run the contents of:

1. [`schema.sql`](./schema.sql) — tables, triggers, RLS policies, indexes  
   (or, for an existing project, run migrations in order:
   migrations in `supabase/migrations/` in filename order
   (timestamps must be unique — use `YYYYMMDDHHmmss_name.sql`);
   keep `schema.sql` as the full source of truth)

   To apply all migrations from the CLI (needs `DATABASE_URL` in `.env.local`):

   ```bash
   npm run migrate
   # or only the latest indexes:
   npm run migrate -- 20261004_admin_indexes
   ```
2. [`seed.sql`](./seed.sql) — categories only (optional)

For the **full product catalog** (cost + sell prices, no images by default), run from the project root:

```bash
npm install
npm run seed
```

This **deletes existing products**, upserts categories, and inserts the current catalog. Upload product photos later in admin. Re-run anytime after confirming you want to replace the catalog.

To download images only when a product lists `imageSources`:

```bash
npm run seed:images
```

> Re-running `schema.sql` is safe and will add newer columns (`cost_price`,
> `order_items.unit_cost`, `purchases`, profile address fields) to existing installs.

## 4. Create the image storage bucket

In **Supabase > Storage**, create a **public** bucket named:

```
product-images
```

Admin product uploads and customer profile photos (under `avatars/`) are stored here.

## 6. (Optional) Email — Brevo

To send order-confirmation emails, add the `BREVO_*` variables described in
`.env.local.example`. Email is best-effort: orders still succeed if it's not set up.

## 5. Make yourself an admin

1. Sign up through the app (`/signup`) or **Supabase > Authentication > Users**.
2. In the SQL Editor, run (replace the email):

```sql
update public.profiles
set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

You can now access `/admin`.
