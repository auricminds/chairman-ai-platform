-- Conversations: per-user chat threads
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New conversation',
  chairman_mode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
create policy "Users can manage own conversations"
  on public.conversations for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create index conversations_profile_id_idx on public.conversations(profile_id);
create index conversations_created_at_idx on public.conversations(created_at desc);

-- Messages: individual turns within a conversation
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  ai_request_id uuid references public.ai_requests(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
create policy "Users can manage own messages"
  on public.messages for all
  using (auth.uid() = profile_id)
  with check (auth.uid() = profile_id);

create index messages_conversation_id_idx on public.messages(conversation_id);
create index messages_profile_id_idx on public.messages(profile_id);

-- Update ai_requests to reference conversations properly (foreign key)
alter table public.ai_requests
  drop column if exists conversation_id;

alter table public.ai_requests
  add column conversation_id uuid references public.conversations(id) on delete set null;
