create table public.billing_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type text not null,
  status text not null default 'pending' check (status in ('pending', 'processed', 'failed')),
  processed_at timestamptz,
  payload_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.billing_webhook_events enable row level security;
-- No user access — service role only
