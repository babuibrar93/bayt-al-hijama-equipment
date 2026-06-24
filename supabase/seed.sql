-- =============================================================
-- Seed data for Bayt Al Hijama Equipment
-- Run AFTER schema.sql. Idempotent via ON CONFLICT (slug).
-- =============================================================

insert into public.categories (name, slug, description, sort_order) values
  ('Hijama Cups', 'hijama-cups', 'Glass, silicone, and plastic cups in all sizes for wet, dry, and massage cupping.', 1),
  ('Complete Kits', 'complete-kits', 'All-in-one kits for therapists and clinics. Ready to practise.', 2),
  ('Accessories', 'accessories', 'Vacuum pumps, gauges, tubing, and storage cases.', 3),
  ('Consumables', 'consumables', 'Sterile lancets, disposable blades, gloves, and antiseptics in bulk.', 4)
on conflict (slug) do nothing;

insert into public.products
  (name, slug, description, price, stock, images, features, badge, badge_variant, category_id, is_active, is_featured)
values
  (
    'Vacuum Pump Hijama Kit',
    'vacuum-pump-hijama-kit',
    'Complete professional set with 12 cups, precision pistol pump, and storage case. The therapist''s first choice for controlled suction.',
    8500, 25, '[]'::jsonb,
    '["12 graduated cup sizes","Precision vacuum pistol","Release valve system","Carry case included"]'::jsonb,
    'Best Seller', 'default',
    (select id from public.categories where slug = 'complete-kits'),
    true, true
  ),
  (
    'Premium Silicone Cup Set',
    'premium-silicone-cup-set',
    'Flexible medical-grade silicone cups in multiple sizes. Perfect for dry cupping, massage cupping, and moving cupping techniques.',
    3200, 40, '[]'::jsonb,
    '["Medical-grade silicone","6 sizes in one set","Easy squeeze mechanism","Autoclave-safe"]'::jsonb,
    'Popular', 'new',
    (select id from public.categories where slug = 'hijama-cups'),
    true, true
  ),
  (
    'Complete Clinic Starter Kit',
    'complete-clinic-starter-kit',
    'Everything a new clinic needs: cups, pump, lancets, disposable blades, gloves, and practitioner guide. Start practising from day one.',
    15500, 15, '[]'::jsonb,
    '["Full equipment set","Consumables included","Instructional guide","Storage & carry bag"]'::jsonb,
    'Clinic Kit', 'gold',
    (select id from public.categories where slug = 'complete-kits'),
    true, true
  )
on conflict (slug) do nothing;
