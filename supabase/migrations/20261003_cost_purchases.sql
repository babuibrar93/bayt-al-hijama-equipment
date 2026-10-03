-- Migration: cost_price, order_items.unit_cost, purchases, restock on cancel
-- Safe to re-run on existing Bayt Al Hijama projects.

alter table public.products add column if not exists cost_price numeric(10,2);
do $$ begin
  alter table public.products
    add constraint products_cost_price_check
    check (cost_price is null or cost_price >= 0);
exception when duplicate_object then null;
end $$;

alter table public.order_items add column if not exists unit_cost numeric(10,2);

create or replace function public.restock_on_order_cancel()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
    update public.products p
      set stock = p.stock + oi.quantity,
          updated_at = now()
    from public.order_items oi
    where oi.order_id = new.id
      and oi.product_id is not null
      and p.id = oi.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_cancelled on public.orders;
create trigger on_order_cancelled
  after update of status on public.orders
  for each row execute function public.restock_on_order_cancel();

create table if not exists public.purchases (
  id               uuid primary key default gen_random_uuid(),
  purchase_number  text not null unique,
  supplier_name    text not null,
  supplier_phone   text,
  status           text not null default 'draft'
                   check (status in ('draft','confirmed','cancelled')),
  subtotal         numeric(10,2) not null default 0,
  notes            text,
  purchased_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists purchases_status_idx on public.purchases(status);
create index if not exists purchases_purchased_at_idx on public.purchases(purchased_at);

create table if not exists public.purchase_items (
  id           uuid primary key default gen_random_uuid(),
  purchase_id  uuid not null references public.purchases(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_cost    numeric(10,2) not null check (unit_cost >= 0),
  quantity     int not null check (quantity > 0)
);

create index if not exists purchase_items_purchase_idx on public.purchase_items(purchase_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists purchases_touch_updated_at on public.purchases;
create trigger purchases_touch_updated_at
  before update on public.purchases
  for each row execute function public.touch_updated_at();

alter table public.purchases enable row level security;
alter table public.purchase_items enable row level security;

drop policy if exists "purchases_admin_all" on public.purchases;
create policy "purchases_admin_all" on public.purchases
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "purchase_items_admin_all" on public.purchase_items;
create policy "purchase_items_admin_all" on public.purchase_items
  for all using (public.is_admin()) with check (public.is_admin());
