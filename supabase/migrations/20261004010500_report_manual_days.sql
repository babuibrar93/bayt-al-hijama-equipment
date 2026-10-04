-- Day-level + month-level notebook entries on reports.
-- Migrates monthly_history → report_manual_entries (day NULL = whole month).

create table if not exists public.report_manual_entries (
  id              uuid primary key default gen_random_uuid(),
  year            int not null check (year >= 2000 and year <= 2100),
  month           int not null check (month >= 1 and month <= 12),
  -- NULL = month-level notebook total; 1–31 = day-level entry
  day             int check (day is null or (day >= 1 and day <= 31)),
  revenue         numeric(12,2) not null default 0 check (revenue >= 0),
  purchase_spend  numeric(12,2) not null default 0 check (purchase_spend >= 0),
  gross_profit    numeric(12,2) not null default 0,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index if not exists report_manual_entries_period_uidx
  on public.report_manual_entries (year, month, (coalesce(day, 0)));

create index if not exists report_manual_entries_year_month_idx
  on public.report_manual_entries (year, month);

drop trigger if exists report_manual_entries_touch_updated_at on public.report_manual_entries;
create trigger report_manual_entries_touch_updated_at
  before update on public.report_manual_entries
  for each row execute function public.touch_updated_at();

alter table public.report_manual_entries enable row level security;

drop policy if exists "report_manual_entries_admin_all" on public.report_manual_entries;
create policy "report_manual_entries_admin_all" on public.report_manual_entries
  for all using (public.is_admin()) with check (public.is_admin());

-- Migrate month-level history only while `day` still allows NULL.
-- Skip when the schema is already day-only (day NOT NULL).
do $$
begin
  if to_regclass('public.monthly_history') is null then
    return;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'report_manual_entries'
      and column_name = 'day'
      and is_nullable = 'NO'
  ) then
    return;
  end if;

  insert into public.report_manual_entries (
    year, month, day, revenue, purchase_spend, gross_profit, notes, created_at, updated_at
  )
  select
    mh.year,
    mh.month,
    null,
    mh.revenue,
    mh.purchase_spend,
    mh.gross_profit,
    mh.notes,
    mh.created_at,
    mh.updated_at
  from public.monthly_history mh
  where not exists (
    select 1
    from public.report_manual_entries e
    where e.year = mh.year
      and e.month = mh.month
      and e.day is null
  );
end $$;
