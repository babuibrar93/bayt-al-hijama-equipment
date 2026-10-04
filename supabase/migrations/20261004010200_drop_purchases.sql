-- Remove supplier purchases module (stock is managed on products).
-- Safe when tables were already dropped manually.

do $$
begin
  if to_regclass('public.purchase_items') is not null then
    execute 'drop policy if exists "purchase_items_admin_all" on public.purchase_items';
  end if;
  if to_regclass('public.purchases') is not null then
    execute 'drop policy if exists "purchases_admin_all" on public.purchases';
    execute 'drop trigger if exists purchases_touch_updated_at on public.purchases';
  end if;
end $$;

drop table if exists public.purchase_items;
drop table if exists public.purchases;
