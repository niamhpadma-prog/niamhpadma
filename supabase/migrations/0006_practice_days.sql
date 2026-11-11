-- Practice days: each client lists their at-home practices, picks the days
-- they want to do them, and can switch on an email reminder from Niamh for
-- those mornings. Run after 0005 (it uses portal_texts for the message).

-- The client's time zone, picked up from their browser, so "Tuesday morning"
-- means their Tuesday.
alter table public.profiles add column timezone text;
grant update (timezone) on public.profiles to authenticated;

create table public.practice_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  days smallint[] not null default '{}',   -- 1 = Monday … 7 = Sunday
  reminder_on boolean not null default false,
  last_reminded_on date,                    -- so nobody gets two on one day
  sort int not null default 0,
  created_at timestamptz not null default now(),
  check (days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[])
);

create index on public.practice_plans (user_id, sort);
create index on public.practice_plans (reminder_on) where reminder_on;

alter table public.practice_plans enable row level security;
revoke all on public.practice_plans from anon;

-- Clients manage their own; Niamh can see and change everyone's.
create policy "practice plans: own or admin" on public.practice_plans
  for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Only the website's reminder job records when a reminder went out.
revoke update on public.practice_plans from authenticated;
grant update (title, days, reminder_on, sort) on public.practice_plans to authenticated;
