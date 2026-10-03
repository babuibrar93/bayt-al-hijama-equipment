# =============================================================
# Seed data for Bayt Al Hijama Equipment
# =============================================================
#
# For the full catalog, run from the project root:
#
#   npm run seed
#
# That script replaces products, upserts categories, and skips images
# when the catalog has empty imageSources (upload photos in admin).
#
# This SQL file seeds categories only.
# =============================================================

insert into public.categories (name, slug, description, sort_order) values
  ('Hijama Cups', 'hijama-cups', 'Individual cup sizes and silicone massage cup sets for wet, dry, and massage cupping.', 1),
  ('Pumps & Machines', 'pumps-machines', 'Manual, disposable, rechargeable, and electric vacuum pumps for clinic and home use.', 2),
  ('Consumables', 'consumables', 'Gloves, gowns, masks, bed sheets, blades, lancets, tape, and clinic disposables.', 3),
  ('Therapy Tools', 'therapy-tools', 'Hijama pens, massage rollers, foot massagers, and blade holders for practitioners.', 4)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

-- Remove legacy category slugs no longer used by the catalog.
delete from public.categories
where slug in ('complete-kits', 'accessories')
  and not exists (
    select 1 from public.products p where p.category_id = categories.id
  );
