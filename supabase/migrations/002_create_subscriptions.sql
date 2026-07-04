create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan_key text not null check (plan_key in ('chairman_private', 'chairman_executive')),
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'incomplete')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = profile_id);

create index subscriptions_profile_id_idx on public.subscriptions(profile_id);
create index subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
