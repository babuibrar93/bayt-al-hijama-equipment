-- Migration: admin query optimization — indexes + aggregate RPCs
-- Speeds up Dashboard / Products / Orders / Inventory / Reports.

create extension if not exists pg_trgm;

-- -------------------------------------------------------------
-- Indexes matching real list ORDER BY / filter patterns
-- -------------------------------------------------------------
create index if not exists products_updated_at_idx
  on public.products (updated_at desc);

create index if not exists products_category_updated_idx
  on public.products (category_id, updated_at desc);

create index if not exists products_name_idx
  on public.products (name);

create index if not exists products_low_stock_idx
  on public.products (stock)
  where stock > 0 and stock <= 5;

create index if not exists products_out_of_stock_idx
  on public.products (id)
  where stock = 0;

create index if not exists orders_status_updated_idx
  on public.orders (status, updated_at desc);

create index if not exists orders_payment_updated_idx
  on public.orders (payment_status, updated_at desc);

create index if not exists orders_pending_updated_idx
  on public.orders (updated_at desc)
  where status = 'pending';

create index if not exists orders_paid_created_idx
  on public.orders (created_at desc)
  where payment_status = 'paid' and status <> 'cancelled';

-- -------------------------------------------------------------
-- Catalog / order list stats (single-scan vs many head counts)
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
