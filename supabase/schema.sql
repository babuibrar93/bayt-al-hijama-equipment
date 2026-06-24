-- =============================================================
-- Bayt Al Hijama Equipment - E-commerce schema
-- Run this in the Supabase SQL Editor (SQL > New query > Run).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- =============================================================

create extension if not exists "pgcrypto";

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
  stock         int not null default 0 check (stock >= 0),
  images        jsonb not null default '[]'::jsonb,
  features      jsonb not null default '[]'::jsonb,
  badge         text,
  badge_variant text not null default 'default'
                check (badge_variant in ('default','new','gold')),
  category_id   uuid references public.categories(id) on delete set null,
  is_active     boolean not null default true,
  is_featured   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx on public.products(is_active);

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
  created_at       timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- -------------------------------------------------------------
-- Order items
-- -------------------------------------------------------------
create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  product_id   uuid references public.products(id) on delete set null,
  product_name text not null,
  unit_price   numeric(10,2) not null,
  quantity     int not null check (quantity > 0)
);

create index if not exists order_items_order_idx on public.order_items(order_id);

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

-- Keep products.updated_at fresh on update.
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
alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

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
