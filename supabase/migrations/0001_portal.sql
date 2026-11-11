-- Client portal: tables, access rules and private media storage.
--
-- Access model:
--   * Anyone can create an account, but a new account sees nothing.
--   * Niamh (profiles.is_admin = true) grants a client a programme by adding a
--     row to programme_access. Clients only ever see programmes granted to them.
--   * Every rule below is enforced by the database itself (row level security),
--     not just by the website.

-- ---------------------------------------------------------------------------
-- Profiles: one per login, created automatically on sign-up.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Programmes and who can see them.
-- ---------------------------------------------------------------------------
create table public.programmes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  eyebrow text,
  subtitle text,
  intro text,
  created_at timestamptz not null default now()
);

create table public.programme_access (
  programme_id uuid not null references public.programmes (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (programme_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Programme content.
-- ---------------------------------------------------------------------------
create table public.weeks (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id) on delete cascade,
  number int not null,
  label text,                -- e.g. "Pre-marathon week"
  title text not null,       -- e.g. "Arrival — Coming Back to Stillness"
  theme text,                -- the paragraph introducing the week
  starts_on date,
  checkin_prompt text,
  reflection_prompt text,
  note text,
  unique (programme_id, number)
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id) on delete cascade,
  week_id uuid references public.weeks (id) on delete set null,
  number int,
  title text not null,
  description text,
  starts_at timestamptz,
  location text,
  notes text,                -- Niamh's notes after the session, shown to the client
  unique (programme_id, number)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id) on delete cascade,
  kind text not null check (kind in ('audio', 'video', 'file', 'link')),
  title text not null,
  description text,
  storage_path text,         -- file in the private "portal-media" bucket
  url text,                  -- or an external link (e.g. an unlisted video)
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.practices (
  id uuid primary key default gen_random_uuid(),
  week_id uuid not null references public.weeks (id) on delete cascade,
  day text not null check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  description text not null,
  session_id uuid references public.sessions (id) on delete set null,
  resource_id uuid references public.resources (id) on delete set null,
  sort int not null default 0
);

create table public.recommendations (
  id uuid primary key default gen_random_uuid(),
  programme_id uuid not null references public.programmes (id) on delete cascade,
  week_id uuid references public.weeks (id) on delete set null,
  kind text not null check (kind in ('book', 'podcast', 'app', 'listen', 'note')),
  title text not null,
  author text,
  note text,
  url text,
  sort int not null default 0
);

-- ---------------------------------------------------------------------------
-- Client's own records.
-- ---------------------------------------------------------------------------
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  week_id uuid not null references public.weeks (id) on delete cascade,
  kind text not null check (kind in ('checkin', 'reflection')),
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.practice_log (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  practice_id uuid not null references public.practices (id) on delete cascade,
  done_at timestamptz not null default now(),
  primary key (user_id, practice_id)
);

create index on public.programme_access (user_id);
create index on public.weeks (programme_id);
create index on public.sessions (programme_id);
create index on public.resources (programme_id);
create index on public.practices (week_id);
create index on public.recommendations (programme_id);
create index on public.journal_entries (user_id, week_id);

-- ---------------------------------------------------------------------------
-- Helpers used by the access rules.
-- ---------------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create function public.can_see_programme(pid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.is_admin() or exists (
    select 1 from public.programme_access
    where programme_id = pid and user_id = auth.uid()
  );
$$;

create function public.can_see_week(wid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.weeks w
    where w.id = wid and public.can_see_programme(w.programme_id)
  );
$$;

-- ---------------------------------------------------------------------------
-- Access rules (row level security).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.programmes enable row level security;
alter table public.programme_access enable row level security;
alter table public.weeks enable row level security;
alter table public.sessions enable row level security;
alter table public.resources enable row level security;
alter table public.practices enable row level security;
alter table public.recommendations enable row level security;
alter table public.journal_entries enable row level security;
alter table public.practice_log enable row level security;

-- Nothing is readable without logging in.
revoke all on all tables in schema public from anon;

-- Profiles: see your own (admin sees all). Clients may only change their name,
-- never is_admin.
create policy "profiles: read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles: admin manages" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Access grants: clients see their own; only admin changes them.
create policy "access: read own or admin" on public.programme_access
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "access: admin manages" on public.programme_access
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Programme content: readable if granted; only admin changes it.
create policy "programmes: read if granted" on public.programmes
  for select to authenticated using (public.can_see_programme(id));
create policy "programmes: admin manages" on public.programmes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "weeks: read if granted" on public.weeks
  for select to authenticated using (public.can_see_programme(programme_id));
create policy "weeks: admin manages" on public.weeks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "sessions: read if granted" on public.sessions
  for select to authenticated using (public.can_see_programme(programme_id));
create policy "sessions: admin manages" on public.sessions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "resources: read if granted" on public.resources
  for select to authenticated using (public.can_see_programme(programme_id));
create policy "resources: admin manages" on public.resources
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "practices: read if granted" on public.practices
  for select to authenticated using (public.can_see_week(week_id));
create policy "practices: admin manages" on public.practices
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "recommendations: read if granted" on public.recommendations
  for select to authenticated using (public.can_see_programme(programme_id));
create policy "recommendations: admin manages" on public.recommendations
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Journal: clients write their own entries for weeks they can see. Niamh can
-- read them but not change them.
create policy "journal: read own or admin" on public.journal_entries
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "journal: write own" on public.journal_entries
  for insert to authenticated with check (user_id = auth.uid() and public.can_see_week(week_id));
create policy "journal: edit own" on public.journal_entries
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.can_see_week(week_id));
create policy "journal: delete own" on public.journal_entries
  for delete to authenticated using (user_id = auth.uid());

-- Practice ticks: same shape as the journal.
create policy "practice log: read own or admin" on public.practice_log
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "practice log: write own" on public.practice_log
  for insert to authenticated with check (
    user_id = auth.uid()
    and exists (select 1 from public.practices p where p.id = practice_id and public.can_see_week(p.week_id))
  );
create policy "practice log: delete own" on public.practice_log
  for delete to authenticated using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Private media storage. Files are stored under "<programme id>/<file name>";
-- a client can download a file only if they can see that programme.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('portal-media', 'portal-media', false);

create policy "portal media: read if granted" on storage.objects
  for select to authenticated using (
    bucket_id = 'portal-media'
    and (public.is_admin() or exists (
      select 1 from public.programme_access pa
      where pa.user_id = auth.uid()
        and pa.programme_id::text = (storage.foldername(name))[1]
    ))
  );
create policy "portal media: admin uploads" on storage.objects
  for insert to authenticated with check (bucket_id = 'portal-media' and public.is_admin());
create policy "portal media: admin updates" on storage.objects
  for update to authenticated using (bucket_id = 'portal-media' and public.is_admin());
create policy "portal media: admin deletes" on storage.objects
  for delete to authenticated using (bucket_id = 'portal-media' and public.is_admin());
