-- Migration: admin list/filter/stat indexes + trigram search
-- Safe to re-run. Speeds up dashboard cards, filters, reports, inventory.

create extension if not exists pg_trgm;

-- -------------------------------------------------------------
-- Products (lists, inventory stock filters, name/slug search)
-- -------------------------------------------------------------
create index if not exists products_created_at_idx
  on public.products (created_at desc);

create index if not exists products_stock_idx
  on public.products (stock);

create index if not exists products_active_created_idx
  on public.products (is_active, created_at desc);

create index if not exists products_category_created_idx
  on public.products (category_id, created_at desc);

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists products_slug_trgm_idx
  on public.products using gin (slug gin_trgm_ops);

-- -------------------------------------------------------------
-- Orders (default sort, status/payment filters, date ranges, search)
-- -------------------------------------------------------------
create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_status_created_idx
  on public.orders (status, created_at desc);

create index if not exists orders_payment_status_idx
  on public.orders (payment_status);

create index if not exists orders_payment_status_created_idx
  on public.orders (payment_status, created_at desc);

create index if not exists orders_created_not_cancelled_idx
  on public.orders (created_at desc)
  where status <> 'cancelled';

create index if not exists orders_unpaid_open_idx
  on public.orders (created_at desc)
  where payment_status = 'unpaid' and status <> 'cancelled';

create index if not exists orders_order_number_trgm_idx
  on public.orders using gin (order_number gin_trgm_ops);

create index if not exists orders_customer_name_trgm_idx
  on public.orders using gin (customer_name gin_trgm_ops);

create index if not exists orders_customer_phone_trgm_idx
  on public.orders using gin (customer_phone gin_trgm_ops);

create index if not exists orders_customer_email_trgm_idx
  on public.orders using gin (customer_email gin_trgm_ops);

-- -------------------------------------------------------------
-- Order items (join + product lookups)
-- -------------------------------------------------------------
create index if not exists order_items_product_idx
  on public.order_items (product_id);

-- -------------------------------------------------------------
-- Categories / profiles (admin helpers)
-- -------------------------------------------------------------

create index if not exists categories_sort_order_idx
  on public.categories (sort_order);

create index if not exists profiles_is_admin_idx
  on public.profiles (id)
  where is_admin = true;
