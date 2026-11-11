-- Client corners: every client has their own personal dashboard ("<Name>'s
-- Corner") with a welcome, a checklist, weekly notes with recordings, personal
-- files and a message thread with Niamh. Programmes (and later paid courses)
-- appear inside the corner. Run after 0001_portal.sql.

-- ---------------------------------------------------------------------------
-- The corner itself: one per client.
-- ---------------------------------------------------------------------------
create table public.corners (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  title text not null,           -- e.g. "Lilit's Corner"
  intro text,                    -- welcome text (Markdown: lists, bold, links)
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Checklist ("To Begin" and later lists). Niamh writes the tasks; the client
-- can only tick and untick them.
-- ---------------------------------------------------------------------------
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  section text not null default 'To Begin',
  body text not null,            -- Markdown, so it can hold links
  detail text,                   -- optional "Why this is important" text
  sort int not null default 0,
  done_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Weekly notes, newest shown first.
-- ---------------------------------------------------------------------------
create table public.weekly_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,           -- e.g. "Week 2"
  note_date date,
  body text,                     -- Markdown
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Messages between a client and Niamh ("Ask Niamh").
-- ---------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  sender_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index on public.tasks (user_id, section, sort);
create index on public.weekly_notes (user_id, note_date desc);
create index on public.messages (client_id, created_at);

-- ---------------------------------------------------------------------------
-- Recordings and files can now belong to one client (personal) as well as to
-- a programme, and can be attached to a weekly note.
-- ---------------------------------------------------------------------------
alter table public.resources alter column programme_id drop not null;
alter table public.resources
  add column user_id uuid references public.profiles (id) on delete cascade,
  add column weekly_note_id uuid references public.weekly_notes (id) on delete set null,
  add constraint resources_owner check (programme_id is not null or user_id is not null);
create index on public.resources (user_id);

-- The client's own written thoughts can be attached to a weekly note too.
alter table public.journal_entries alter column week_id drop not null;
alter table public.journal_entries
  add column weekly_note_id uuid references public.weekly_notes (id) on delete cascade,
  add constraint journal_entries_target check (week_id is not null or weekly_note_id is not null);
alter table public.journal_entries drop constraint journal_entries_kind_check;
alter table public.journal_entries
  add constraint journal_entries_kind_check check (kind in ('checkin', 'reflection', 'note'));

-- ---------------------------------------------------------------------------
-- Access rules.
-- ---------------------------------------------------------------------------
alter table public.corners enable row level security;
alter table public.tasks enable row level security;
alter table public.weekly_notes enable row level security;
alter table public.messages enable row level security;
revoke all on public.corners, public.tasks, public.weekly_notes, public.messages from anon;

create policy "corners: read own or admin" on public.corners
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "corners: admin manages" on public.corners
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "tasks: read own or admin" on public.tasks
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "tasks: tick own" on public.tasks
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks: admin manages" on public.tasks
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
-- Clients may only change the tick, never the wording.
revoke update on public.tasks from authenticated;
grant update (done_at) on public.tasks to authenticated;
-- Niamh edits tasks through the dashboard/admin key, not as a client.

create policy "weekly notes: read own or admin" on public.weekly_notes
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "weekly notes: admin manages" on public.weekly_notes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "resources: read own personal" on public.resources
  for select to authenticated using (user_id = auth.uid());

-- Journal: allow notes on the client's own weekly notes.
drop policy "journal: write own" on public.journal_entries;
drop policy "journal: edit own" on public.journal_entries;
create function public.can_write_journal(wid uuid, nid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select (wid is null or public.can_see_week(wid))
     and (nid is null or exists (
       select 1 from public.weekly_notes n where n.id = nid and n.user_id = auth.uid()
     ));
$$;
create policy "journal: write own" on public.journal_entries
  for insert to authenticated
  with check (user_id = auth.uid() and public.can_write_journal(week_id, weekly_note_id));
create policy "journal: edit own" on public.journal_entries
  for update to authenticated using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.can_write_journal(week_id, weekly_note_id));

-- Messages: a client sees and writes in their own thread; Niamh in all.
create policy "messages: read own thread or admin" on public.messages
  for select to authenticated using (client_id = auth.uid() or public.is_admin());
create policy "messages: write" on public.messages
  for insert to authenticated with check (
    sender_id = auth.uid() and (client_id = auth.uid() or public.is_admin())
  );
create policy "messages: admin marks read" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Personal files live under "users/<client id>/<file name>" in portal-media.
create policy "portal media: read own personal" on storage.objects
  for select to authenticated using (
    bucket_id = 'portal-media'
    and (storage.foldername(name))[1] = 'users'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- ---------------------------------------------------------------------------
-- Every account gets its corner the moment it is created, so signing in always
-- lands on a ready corner. For 1:1 clients, Niamh invites them first
-- (Authentication → Users → Invite), which creates the account and corner
-- straight away; she fills the corner in, then the client accepts the invite.
-- ---------------------------------------------------------------------------
create function public.corner_title(full_name text)
returns text
language sql immutable set search_path = ''
as $$
  select coalesce(nullif(split_part(trim(full_name), ' ', 1), '') || '''s Corner', 'Your Corner');
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  insert into public.corners (user_id, title)
  values (new.id, public.corner_title(new.raw_user_meta_data ->> 'full_name'));
  return new;
end;
$$;

-- Accounts created before this ran get a corner too.
insert into public.corners (user_id, title)
select id, public.corner_title(full_name) from public.profiles
on conflict (user_id) do nothing;
