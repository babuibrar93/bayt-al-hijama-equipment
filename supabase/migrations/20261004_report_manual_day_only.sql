-- Day-only manual report totals (drop month-level / day NULL rows).
delete from public.report_manual_entries where day is null;

alter table public.report_manual_entries
  alter column day set not null;

alter table public.report_manual_entries
  drop constraint if exists report_manual_entries_day_check;

alter table public.report_manual_entries
  add constraint report_manual_entries_day_check
  check (day >= 1 and day <= 31);

drop index if exists public.report_manual_entries_period_uidx;
create unique index if not exists report_manual_entries_period_uidx
  on public.report_manual_entries (year, month, day);
