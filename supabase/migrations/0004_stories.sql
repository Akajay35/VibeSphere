create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  media_type text not null check (media_type in ('image','video')),
  caption text,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours')
);

create table if not exists public.story_views (
  story_id uuid not null references public.stories(id) on delete cascade,
  viewer_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (story_id, viewer_id)
);

alter table public.stories enable row level security;
alter table public.story_views enable row level security;

create policy "active stories are readable" on public.stories for select using (expires_at > now());
create policy "users create their stories" on public.stories for insert with check (auth.uid() = author_id);
create policy "users update their stories" on public.stories for update using (auth.uid() = author_id) with check (auth.uid() = author_id);
create policy "users delete their stories" on public.stories for delete using (auth.uid() = author_id);

create policy "users can record story views" on public.story_views for insert with check (auth.uid() = viewer_id);
create policy "viewers can read their views" on public.story_views for select using (auth.uid() = viewer_id);

create index if not exists stories_active_idx on public.stories (expires_at desc);
create index if not exists stories_author_idx on public.stories (author_id, created_at desc);
