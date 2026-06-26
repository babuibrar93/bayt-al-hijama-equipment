# =============================================================
# Seed data for Bayt Al Hijama Equipment
# =============================================================
#
# For the full catalog (15 products + real images), run from the project root:
#
#   npm run seed
#
# That script downloads images into `public/products/`, uploads them to the
# `product-images` Supabase bucket, and upserts categories + products.
#
# This SQL file seeds categories only — useful if you prefer manual setup.
# =============================================================

insert into public.categories (name, slug, description, sort_order) values
  ('Hijama Cups', 'hijama-cups', 'Glass, silicone, and polycarbonate cups in all sizes for wet, dry, and massage cupping.', 1),
  ('Complete Kits', 'complete-kits', 'All-in-one kits for therapists, clinics, and students — ready to practise.', 2),
  ('Accessories', 'accessories', 'Vacuum pumps, extension tubes, valves, gauges, and professional carry cases.', 3),
  ('Consumables', 'consumables', 'Sterile lancets, disposable blades, gloves, and antiseptics in clinic-friendly packs.', 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;
