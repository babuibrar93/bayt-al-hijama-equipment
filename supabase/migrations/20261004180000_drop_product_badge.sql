-- Remove unused product marketing badge fields.
alter table public.products drop column if exists badge;
alter table public.products drop column if exists badge_variant;
