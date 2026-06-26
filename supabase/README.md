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

1. [`schema.sql`](./schema.sql) — tables, triggers, RLS policies
2. [`seed.sql`](./seed.sql) — categories only (optional)

For the **full catalog** (15 products with real Hijama/cupping photos), run from the project root:

```bash
npm install
npm run seed
```

This downloads images into `public/products/`, uploads them to the `product-images` bucket, and upserts all categories and products. Re-run safely anytime — it uses upserts.

To download images only (no database):

```bash
npm run seed:images
```

> Re-running `schema.sql` is safe and will add the newer profile columns
> (`email`, `avatar_url`, address fields) to existing installations.

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
