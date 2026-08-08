create table if not exists public.content_views (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  viewer_id uuid references public.profiles(id) on delete set null,
  viewed_at timestamptz not null default now()
);

alter table public.content_views enable row level security;
create policy "users record views" on public.content_views for insert with check (viewer_id is null or viewer_id = auth.uid());
create policy "users read own views" on public.content_views for select using (viewer_id = auth.uid());

create index if not exists content_views_post_idx on public.content_views(post_id, viewed_at desc);
create index if not exists content_views_viewer_idx on public.content_views(viewer_id, viewed_at desc);

create or replace function public.creator_analytics()
returns table (views bigint, likes bigint, comments bigint, followers bigint, posts bigint)
language sql stable security invoker
as $$
  select
    (select count(*) from public.content_views v join public.posts p on p.id = v.post_id where p.author_id = auth.uid()),
    (select count(*) from public.likes l join public.posts p on p.id = l.post_id where p.author_id = auth.uid()),
    (select count(*) from public.comments c join public.posts p on p.id = c.post_id where p.author_id = auth.uid()),
    (select count(*) from public.follows f where f.following_id = auth.uid()),
    (select count(*) from public.posts p where p.author_id = auth.uid());
$$;
