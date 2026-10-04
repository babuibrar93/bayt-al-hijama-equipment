-- Manual day order count for offline / notebook sales.
alter table public.report_manual_entries
  add column if not exists order_count int not null default 0
  check (order_count >= 0);
