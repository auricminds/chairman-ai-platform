create table public.site_clients (
  id uuid primary key default gen_random_uuid(),
  site_key text unique not null,
  display_name text not null,
  status text not null default 'inactive' check (status in ('active', 'inactive', 'suspended')),
  allowed_scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_api_keys (
  id uuid primary key default gen_random_uuid(),
  site_client_id uuid not null references public.site_clients(id) on delete cascade,
  key_prefix text not null,
  key_hash text not null,
  status text not null default 'active' check (status in ('active', 'revoked')),
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.site_events (
  id uuid primary key default gen_random_uuid(),
  site_client_id uuid not null references public.site_clients(id) on delete cascade,
  event_type text not null,
  severity text not null,
  safe_metadata jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.pulse_reports (
  id uuid primary key default gen_random_uuid(),
  site_client_id uuid not null references public.site_clients(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  summary text,
  recommendations jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

-- All site tables are service-role only for writes (RLS off for these; owner reads via service role)
alter table public.site_clients enable row level security;
alter table public.site_api_keys enable row level security;
alter table public.site_events enable row level security;
alter table public.pulse_reports enable row level security;

-- Owners can read all site data
create policy "Owners can read site clients"
  on public.site_clients for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('owner', 'super_admin')
    )
  );

-- Seed initial site records (inactive)
insert into public.site_clients (site_key, display_name, status, allowed_scopes) values
  ('chairmans-holding', 'Chairmans Holding', 'inactive', '{}'),
  ('quicky-cv', 'Quicky CV', 'inactive', ARRAY['guidance:quicky', 'events:write']),
  ('elarab-club', 'El Arab Club', 'inactive', ARRAY['guidance:elarab', 'events:write']);
