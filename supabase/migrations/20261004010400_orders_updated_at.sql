-- Track order edits so admin lists can sort newest activity first.
alter table public.orders
  add column if not exists updated_at timestamptz not null default now();

update public.orders
set updated_at = created_at
where updated_at is null or updated_at < created_at;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

create index if not exists orders_updated_at_idx
  on public.orders (updated_at desc);
