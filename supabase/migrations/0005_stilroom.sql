-- STILroom: the monthly membership community.
--
-- Who gets in:
--   * paying members (a Stripe subscription that is active, in a free trial,
--     or briefly past due while Stripe retries the card)
--   * every 1:1 client (profiles.is_client), free, for as long as they're a client
--   * Niamh (admin)

-- ---------------------------------------------------------------------------
-- 1:1 clients. Only clients see a corner; Niamh switches this on per person.
-- ---------------------------------------------------------------------------
alter table public.profiles add column is_client boolean not null default false;

-- Anyone who already has a corner with something in it counts as a client.
update public.profiles p set is_client = true
where not p.is_admin and exists (
  select 1 from public.corners c
  where c.user_id = p.id
    and (c.intro is not null or exists (select 1 from public.tasks t where t.user_id = p.id))
);

-- ---------------------------------------------------------------------------
-- Memberships, kept in step with Stripe by the website (never by members).
-- ---------------------------------------------------------------------------
create table public.memberships (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  status text not null,                 -- Stripe's subscription status
  stripe_customer_id text,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;
revoke all on public.memberships from anon;
create policy "memberships: read own or admin" on public.memberships
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
-- No insert/update policies: only the website's server key writes here.

create function public.has_stilroom(uid uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = uid and (is_admin or is_client))
      or exists (
        select 1 from public.memberships m
        where m.user_id = uid
          and m.status in ('active', 'trialing', 'past_due')
          and (m.current_period_end is null or m.current_period_end > now() - interval '3 days')
      );
$$;

-- ---------------------------------------------------------------------------
-- STILroom content: collections (e.g. "Yoga Nidra") holding videos, audio
-- and PDFs.
-- ---------------------------------------------------------------------------
create table public.stilroom_collections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.stilroom_items (
  id uuid primary key default gen_random_uuid(),
  collection_id uuid references public.stilroom_collections (id) on delete set null,
  kind text not null check (kind in ('audio', 'video', 'file', 'link')),
  title text not null,
  description text,
  storage_path text,
  url text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Editable wording for STILroom pages (welcome, join page), keyed by name.
create table public.portal_texts (
  key text primary key,
  body text,
  updated_at timestamptz not null default now()
);

create index on public.stilroom_items (collection_id, sort);

alter table public.stilroom_collections enable row level security;
alter table public.stilroom_items enable row level security;
alter table public.portal_texts enable row level security;
revoke all on public.stilroom_collections, public.stilroom_items, public.portal_texts from anon;

create policy "stilroom collections: members read" on public.stilroom_collections
  for select to authenticated using (public.has_stilroom(auth.uid()));
create policy "stilroom collections: admin manages" on public.stilroom_collections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "stilroom items: members read" on public.stilroom_items
  for select to authenticated using (public.has_stilroom(auth.uid()));
create policy "stilroom items: admin manages" on public.stilroom_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- The join page is read by people who aren't members yet, so any signed-in
-- account may read these texts.
create policy "portal texts: signed-in read" on public.portal_texts
  for select to authenticated using (true);
create policy "portal texts: admin manages" on public.portal_texts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- STILroom files live under "stilroom/<file name>" in portal-media.
create policy "portal media: stilroom members read" on storage.objects
  for select to authenticated using (
    bucket_id = 'portal-media'
    and (storage.foldername(name))[1] = 'stilroom'
    and public.has_stilroom(auth.uid())
  );

-- Admin may switch is_client on and off from the portal (clients still can't
-- change it, or is_admin, on themselves).
grant update (is_client) on public.profiles to authenticated;
create function public.profiles_protect_flags()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_admin() and (
    new.is_client is distinct from old.is_client or new.is_admin is distinct from old.is_admin
  ) then
    raise exception 'Only Niamh can change this.';
  end if;
  return new;
end;
$$;
create trigger profiles_protect_flags
  before update on public.profiles
  for each row execute function public.profiles_protect_flags();
