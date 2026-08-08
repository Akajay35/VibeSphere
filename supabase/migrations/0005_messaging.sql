create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

create policy "members can read conversations" on public.conversations for select using (exists (select 1 from public.conversation_members m where m.conversation_id = id and m.user_id = auth.uid()));
create policy "authenticated users create conversations" on public.conversations for insert with check (auth.uid() is not null);
create policy "members can read membership" on public.conversation_members for select using (user_id = auth.uid() or exists (select 1 from public.conversation_members m where m.conversation_id = conversation_id and m.user_id = auth.uid()));
create policy "users join conversations" on public.conversation_members for insert with check (user_id = auth.uid());
create policy "members read messages" on public.messages for select using (exists (select 1 from public.conversation_members m where m.conversation_id = conversation_id and m.user_id = auth.uid()));
create policy "members send messages" on public.messages for insert with check (auth.uid() = sender_id and exists (select 1 from public.conversation_members m where m.conversation_id = conversation_id and m.user_id = auth.uid()));

create index if not exists conversation_members_user_idx on public.conversation_members(user_id);
create index if not exists messages_conversation_created_idx on public.messages(conversation_id, created_at);

alter publication supabase_realtime add table public.messages;
