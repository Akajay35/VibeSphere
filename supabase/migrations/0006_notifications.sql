create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  type text not null check (type in ('like','comment','follow','story_view','message')),
  post_id uuid references public.posts(id) on delete cascade,
  story_id uuid references public.stories(id) on delete cascade,
  message_id uuid references public.messages(id) on delete cascade,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;
create policy "users read their notifications" on public.notifications for select using (auth.uid() = recipient_id);
create policy "users mark their notifications read" on public.notifications for update using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);
create index if not exists notifications_recipient_created_idx on public.notifications(recipient_id, created_at desc);

create or replace function public.create_notification(
  p_recipient_id uuid,
  p_actor_id uuid,
  p_type text,
  p_post_id uuid default null,
  p_story_id uuid default null,
  p_message_id uuid default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if p_recipient_id is null or p_actor_id = p_recipient_id then return null; end if;
  insert into public.notifications(recipient_id, actor_id, type, post_id, story_id, message_id)
  values (p_recipient_id, p_actor_id, p_type, p_post_id, p_story_id, p_message_id)
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.create_notification(uuid,uuid,text,uuid,uuid,uuid) from public;
grant execute on function public.create_notification(uuid,uuid,text,uuid,uuid,uuid) to authenticated;
