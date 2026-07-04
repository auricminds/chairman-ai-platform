create table public.usage_cycles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  plan_key text not null,
  period_start timestamptz not null,
  period_end timestamptz not null,
  provider_cost_reserved_usd numeric(10,6) not null default 0,
  provider_cost_actual_usd numeric(10,6) not null default 0,
  status text not null default 'active' check (status in ('active', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.usage_cycles enable row level security;
create policy "Users can read own usage cycles"
  on public.usage_cycles for select
  using (auth.uid() = profile_id);

create table public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  usage_cycle_id uuid not null references public.usage_cycles(id) on delete cascade,
  chairman_mode text not null,
  request_limit integer not null default 0,
  requests_reserved integer not null default 0,
  requests_completed integer not null default 0,
  input_tokens bigint not null default 0,
  output_tokens bigint not null default 0,
  provider_cost_actual_usd numeric(10,6) not null default 0,
  updated_at timestamptz not null default now(),
  unique(usage_cycle_id, chairman_mode)
);

alter table public.usage_counters enable row level security;
create policy "Users can read own counters"
  on public.usage_counters for select
  using (
    exists (
      select 1 from public.usage_cycles uc
      where uc.id = usage_cycle_id and uc.profile_id = auth.uid()
    )
  );

create table public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  usage_cycle_id uuid references public.usage_cycles(id) on delete set null,
  conversation_id uuid,
  idempotency_key text not null,
  chairman_mode text not null,
  engine_key text,
  provider_generation_id text,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  reserved_cost_usd numeric(10,6) not null default 0,
  actual_cost_usd numeric(10,6) not null default 0,
  status text not null default 'reserved' check (status in ('reserved', 'completed', 'failed', 'released')),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(idempotency_key)
);

alter table public.ai_requests enable row level security;
create policy "Users can read own requests"
  on public.ai_requests for select
  using (auth.uid() = profile_id);

create index ai_requests_profile_id_idx on public.ai_requests(profile_id);
create index ai_requests_idempotency_key_idx on public.ai_requests(idempotency_key);

-- RPC function to increment usage counter atomically
create or replace function public.increment_usage_counter(p_cycle_id uuid, p_mode text)
returns void language plpgsql security definer as $$
begin
  insert into public.usage_counters (usage_cycle_id, chairman_mode, requests_reserved)
  values (p_cycle_id, p_mode, 1)
  on conflict (usage_cycle_id, chairman_mode)
  do update set
    requests_reserved = public.usage_counters.requests_reserved + 1,
    updated_at = now();
end;
$$;
