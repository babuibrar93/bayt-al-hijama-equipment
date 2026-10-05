-- =============================================================
-- Bayt Al Hijama Equipment - E-commerce schema
-- Run this in the Supabase SQL Editor (SQL > New query > Run).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- =============================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- -------------------------------------------------------------
-- Categories
-- -------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Products
-- -------------------------------------------------------------
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text not null default '',
  price         numeric(10,2) not null default 0 check (price >= 0),
  cost_price    numeric(10,2) check (cost_price is null or cost_price >= 0),
  stock         int not null default 0 check (stock >= 0),
  images        jsonb not null default '[]'::jsonb,
  features      jsonb not null default '[]'::jsonb,
  category_id   uuid references public.categories(id) on delete set null,
  is_active     boolean not null default true,
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Backfill for existing installs
alter table public.products add column if not exists cost_price numeric(10,2);
do $$ begin
  alter table public.products
    add constraint products_cost_price_check
    check (cost_price is null or cost_price >= 0);
exception when duplicate_object then null;
end $$;

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);
create index if not exists products_created_at_idx on public.products(created_at desc);
create index if not exists products_updated_at_idx on public.products(updated_at desc);
create index if not exists products_stock_idx on public.products(stock);
create index if not exists products_name_idx on public.products(name);
create index if not exists products_active_created_idx on public.products(is_active, created_at desc);
create index if not exists products_category_created_idx on public.products(category_id, created_at desc);
create index if not exists products_category_updated_idx on public.products(category_id, updated_at desc);
create index if not exists products_low_stock_idx
  on public.products(stock) where stock > 0 and stock <= 5;
create index if not exists products_out_of_stock_idx
  on public.products(id) where stock = 0;
create index if not exists products_name_trgm_idx on public.products using gin (name gin_trgm_ops);
create index if not exists products_slug_trgm_idx on public.products using gin (slug gin_trgm_ops);

-- -------------------------------------------------------------
-- Profiles (1:1 with auth.users) - holds admin flag + contact info
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  phone      text,
  email      text,
  avatar_url text,
  address_line1 text,
  address_line2 text,
  city       text,
  province   text,
  postal_code text,
  is_admin   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Backfill columns for existing installs (safe to re-run).
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists address_line1 text;
alter table public.profiles add column if not exists address_line2 text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists province text;
alter table public.profiles add column if not exists postal_code text;

-- Auto-create a profile row whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- Orders
-- -------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete set null,
  order_number     text not null unique,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text,
  shipping_address jsonb not null,
  payment_method   text not null
                   check (payment_method in ('cod','bank_transfer','jazzcash','easypaisa')),
  payment_status   text not null default 'unpaid'
                   check (payment_status in ('unpaid','paid','refunded')),
  status           text not null default 'pending'
                   check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  subtotal         numeric(10,2) not null default 0,
  shipping_fee     numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_updated_at_idx on public.orders(updated_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at desc);
create index if not exists orders_status_updated_idx on public.orders(status, updated_at desc);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists orders_payment_status_created_idx on public.orders(payment_status, created_at desc);
create index if not exists orders_payment_updated_idx on public.orders(payment_status, updated_at desc);
create index if not exists orders_created_not_cancelled_idx
  on public.orders(created_at desc) where status <> 'cancelled';
create index if not exists orders_unpaid_open_idx
  on public.orders(created_at desc)
  where payment_status = 'unpaid' and status <> 'cancelled';
create index if not exists orders_pending_updated_idx
  on public.orders(updated_at desc) where status = 'pending';
create index if not exists orders_paid_created_idx
  on public.orders(created_at desc)
  where payment_status = 'paid' and status <> 'cancelled';
create index if not exists orders_order_number_trgm_idx
  on public.orders using gin (order_number gin_trgm_ops);
create index if not exists orders_customer_name_trgm_idx
  on public.orders using gin (customer_name gin_trgm_ops);
create index if not exists orders_customer_phone_trgm_idx
  on public.orders using gin (customer_phone gin_trgm_ops);
create index if not exists orders_customer_email_trgm_idx
  on public.orders using gin (customer_email gin_trgm_ops);

-- -------------------------------------------------------------
-- Order items
-- -------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(10,2) not null,
  unit_cost    numeric(10,2),
  quantity     int not null check (quantity > 0)
);

alter table public.order_items add column if not exists unit_cost numeric(10,2);

create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_items_product_idx on public.order_items(product_id);

-- Decrement product stock when an order item is created.
create or replace function public.decrement_stock()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.product_id is not null then
    update public.products
      set stock = greatest(stock - new.quantity, 0),
          updated_at = now()
    where id = new.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_item_created on public.order_items;
create trigger on_order_item_created
  after insert on public.order_items
  for each row execute function public.decrement_stock();

-- Restock when an order is cancelled (only on transition into cancelled).
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

create index if not exists categories_sort_order_idx on public.categories(sort_order);
create index if not exists profiles_is_admin_idx
  on public.profiles(id) where is_admin = true;

-- -------------------------------------------------------------
-- Report manual day totals (Asia/Karachi calendar day)
-- -------------------------------------------------------------
create table if not exists public.report_manual_entries (
  id              uuid primary key default gen_random_uuid(),
  year            int not null check (year >= 2000 and year <= 2100),
  month           int not null check (month >= 1 and month <= 12),
  day             int not null check (day >= 1 and day <= 31),
  revenue         numeric(12,2) not null default 0 check (revenue >= 0),
  purchase_spend  numeric(12,2) not null default 0 check (purchase_spend >= 0),
  gross_profit    numeric(12,2) not null default 0,
  order_count     int not null default 0 check (order_count >= 0),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists report_manual_entries_period_uidx
  on public.report_manual_entries (year, month, day);

create index if not exists report_manual_entries_year_month_idx
  on public.report_manual_entries (year, month);

-- Keep updated_at fresh on update.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists report_manual_entries_touch_updated_at on public.report_manual_entries;
create trigger report_manual_entries_touch_updated_at
  before update on public.report_manual_entries
  for each row execute function public.touch_updated_at();

-- -------------------------------------------------------------
-- Helper: is the current user an admin?
-- -------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- =============================================================
-- Row Level Security
-- =============================================================
alter table public.categories     enable row level security;
alter table public.products       enable row level security;
alter table public.profiles       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.report_manual_entries enable row level security;

-- Categories: public read, admin write
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Products: public read (active), admin read/write all
drop policy if exists "products_read" on public.products;
create policy "products_read" on public.products
  for select using (is_active or public.is_admin());

drop policy if exists "products_admin_write" on public.products;
create policy "products_admin_write" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- Profiles: a user reads/updates their own; admin reads all
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Orders: owner reads own, admin reads all. Inserts go through the
-- service-role API route, so no public insert policy is needed.
drop policy if exists "orders_owner_read" on public.orders;
create policy "orders_owner_read" on public.orders
  for select using (
    (user_id is not null and auth.uid() = user_id) or public.is_admin()
  );

drop policy if exists "order_items_owner_read" on public.order_items;
create policy "order_items_owner_read" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and ((o.user_id is not null and auth.uid() = o.user_id) or public.is_admin())
    )
  );

drop policy if exists "report_manual_entries_admin_all" on public.report_manual_entries;
create policy "report_manual_entries_admin_all" on public.report_manual_entries
  for all using (public.is_admin()) with check (public.is_admin());

-- -------------------------------------------------------------
-- Admin aggregate RPCs (dashboard / lists / reports)
-- -------------------------------------------------------------

create or replace function public.admin_product_catalog_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return (
    select json_build_object(
      'total', count(*)::int,
      'active', count(*) filter (where is_active)::int,
      'low', count(*) filter (where stock > 0 and stock <= 5)::int,
      'out', count(*) filter (where stock = 0)::int
    )
    from public.products
  );
end;
$$;

create or replace function public.admin_order_list_stats()
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  return (
    select json_build_object(
      'total', count(*)::int,
      'pending', count(*) filter (where status = 'pending')::int,
      'unpaid', count(*) filter (
        where payment_status = 'unpaid' and status <> 'cancelled'
      )::int,
      'paid', count(*) filter (where payment_status = 'paid')::int
    )
    from public.orders
  );
end;
$$;

-- -------------------------------------------------------------
-- Period sales stats (dashboard MTD)
-- Revenue = sum(order.total) for paid; profit = goods − COGS on paid lines.
-- -------------------------------------------------------------
create or replace function public.admin_period_sales_stats(
  p_from timestamptz,
  p_to timestamptz
)
returns json
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_order_count int;
  v_paid_revenue numeric;
  v_paid_goods numeric;
  v_paid_cogs numeric;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select count(*)::int
  into v_order_count
  from public.orders o
  where o.created_at >= p_from
    and o.created_at < p_to
    and o.status <> 'cancelled';

  select coalesce(sum(o.total), 0)
  into v_paid_revenue
  from public.orders o
  where o.created_at >= p_from
    and o.created_at < p_to
    and o.status <> 'cancelled'
    and o.payment_status = 'paid';

  select
    coalesce(sum(oi.unit_price * oi.quantity), 0),
    coalesce(sum(
      case when oi.unit_cost is null then 0 else oi.unit_cost * oi.quantity end
    ), 0)
  into v_paid_goods, v_paid_cogs
  from public.order_items oi
  join public.orders o on o.id = oi.order_id
  where o.created_at >= p_from
    and o.created_at < p_to
    and o.status <> 'cancelled'
    and o.payment_status = 'paid';

  return json_build_object(
    'order_count', v_order_count,
    'paid_revenue', v_paid_revenue,
    'paid_goods_revenue', v_paid_goods,
    'paid_cogs', v_paid_cogs,
    'paid_profit', v_paid_goods - v_paid_cogs
  );
end;
$$;

-- -------------------------------------------------------------
-- Report time buckets (month or day) — avoids hydrating all year rows
-- -------------------------------------------------------------
create or replace function public.admin_report_time_buckets(
  p_from timestamptz,
  p_to timestamptz,
  p_paid_only boolean default false,
  p_grain text default 'month'
)
returns table (
  bucket_key text,
  revenue numeric,
  cogs numeric,
  order_count bigint,
  missing_cost_lines bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if p_grain not in ('month', 'day') then
    raise exception 'invalid grain';
  end if;

  return query
  with filtered as (
    select
      o.id,
      o.total,
      case
        when p_grain = 'month' then
          to_char(
            (o.created_at at time zone 'Asia/Karachi'),
            'MM'
          )
        else
          to_char(
            (o.created_at at time zone 'Asia/Karachi'),
            'YYYY-MM-DD'
          )
      end as bucket_key
    from public.orders o
    where o.created_at >= p_from
      and o.created_at < p_to
      and o.status <> 'cancelled'
      and (
        case
          when p_paid_only then o.payment_status = 'paid'
          else o.payment_status <> 'refunded'
        end
      )
  ),
  costs as (
    select
      f.id as order_id,
      f.bucket_key,
      coalesce(
        sum(
          case
            when oi.unit_cost is null then 0
            else oi.unit_cost * oi.quantity
          end
        ),
        0
      ) as cogs,
      count(*) filter (where oi.unit_cost is null) as missing_cost_lines
    from filtered f
    left join public.order_items oi on oi.order_id = f.id
    group by f.id, f.bucket_key
  )
  select
    f.bucket_key,
    coalesce(sum(f.total), 0)::numeric as revenue,
    coalesce(sum(c.cogs), 0)::numeric as cogs,
    count(distinct f.id)::bigint as order_count,
    coalesce(sum(c.missing_cost_lines), 0)::bigint as missing_cost_lines
  from filtered f
  left join costs c on c.order_id = f.id
  group by f.bucket_key
  order by f.bucket_key;
end;
$$;

revoke all on function public.admin_product_catalog_stats() from public;
revoke all on function public.admin_order_list_stats() from public;
revoke all on function public.admin_period_sales_stats(timestamptz, timestamptz) from public;
revoke all on function public.admin_report_time_buckets(timestamptz, timestamptz, boolean, text) from public;

grant execute on function public.admin_product_catalog_stats() to authenticated;
grant execute on function public.admin_order_list_stats() to authenticated;
grant execute on function public.admin_period_sales_stats(timestamptz, timestamptz) to authenticated;
grant execute on function public.admin_report_time_buckets(timestamptz, timestamptz, boolean, text) to authenticated;
