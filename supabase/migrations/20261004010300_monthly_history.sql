-- Manual monthly report history (notebook totals) — admin only.
-- Safe to re-run.

create table if not exists public.monthly_history (
  id              uuid primary key default gen_random_uuid(),
  year            int not null check (year >= 2000 and year <= 2100),
  month           int not null check (month >= 1 and month <= 12),
  revenue         numeric(12,2) not null default 0 check (revenue >= 0),
  purchase_spend  numeric(12,2) not null default 0 check (purchase_spend >= 0),
  gross_profit    numeric(12,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (year, month)
);

create index if not exists monthly_history_year_idx
  on public.monthly_history (year);

drop trigger if exists monthly_history_touch_updated_at on public.monthly_history;
create trigger monthly_history_touch_updated_at
  before update on public.monthly_history
  for each row execute function public.touch_updated_at();

alter table public.monthly_history enable row level security;

drop policy if exists "monthly_history_admin_all" on public.monthly_history;
create policy "monthly_history_admin_all" on public.monthly_history
  for all using (public.is_admin()) with check (public.is_admin());
