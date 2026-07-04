create table public.engine_registry (
  id uuid primary key default gen_random_uuid(),
  internal_key text unique not null,
  owner_name text not null,
  chairman_mode text not null,
  provider text not null,
  provider_model_id text not null,
  enabled boolean not null default false,
  priority integer not null default 0,
  allowed_plans text[] not null default '{}',
  max_input_tokens integer not null,
  max_output_tokens integer not null,
  input_price_per_million integer not null default 0,
  output_price_per_million integer not null default 0,
  fallback_engine_key text,
  requires_confirmation boolean not null default false,
  updated_at timestamptz not null default now(),
  owner_notes text not null default ''
);

-- Only service role can write engine registry
alter table public.engine_registry enable row level security;
create policy "Authenticated users can read enabled engines"
  on public.engine_registry for select
  using (auth.uid() is not null and enabled = true);

-- Seed initial engines (disabled until owner activates)
insert into public.engine_registry (
  internal_key, owner_name, chairman_mode, provider, provider_model_id,
  enabled, priority, allowed_plans, max_input_tokens, max_output_tokens,
  input_price_per_million, output_price_per_million, requires_confirmation, owner_notes
) values
  ('business_standard', 'Business Intelligence Standard', 'business',
   'openrouter', 'qwen/qwen3-30b-a3b-instruct-2507',
   true, 10,
   ARRAY['chairman_private', 'chairman_executive'],
   10000, 1500, 500, 1500, false,
   'Primary business engine. Approved 2025.'),
  ('extended_review', 'Extended Review Engine', 'extended',
   'openrouter', '',
   false, 10,
   ARRAY['chairman_private', 'chairman_executive'],
   24000, 4000, 0, 0, false,
   'Disabled — set provider_model_id and enable when verified.'),
  ('strategic_review', 'Strategic Review Engine', 'strategic',
   'openrouter', '',
   false, 10,
   ARRAY['chairman_private', 'chairman_executive'],
   16000, 2000, 0, 0, false,
   'Disabled — awaiting model selection.'),
  ('executive_analysis', 'Executive Analysis Engine', 'executive',
   'openrouter', '',
   false, 10,
   ARRAY['chairman_private', 'chairman_executive'],
   20000, 3000, 0, 0, true,
   'Disabled — awaiting model selection.'),
  ('board_review', 'Board Review Engine', 'board',
   'openrouter', '',
   false, 10,
   ARRAY['chairman_executive'],
   30000, 5000, 0, 0, true,
   'Disabled — executive plan only. Awaiting model selection.');
