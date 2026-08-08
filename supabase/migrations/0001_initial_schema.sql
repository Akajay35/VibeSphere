create extension if not exists pgcrypto;
create extension if not exists citext;

create type public.user_role as enum ('user','creator','moderator','admin');
create type public.visibility as enum ('public','unlisted','private');
create type public.post_type as enum ('text','image','video','reel','link');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 username citext unique not null,
 display_name text not null default '',
 bio text not null default '',
 avatar_url text,
 cover_url text,
 role public.user_role not null default 'user',
 is_private boolean not null default false,
 is_suspended boolean not null default false,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint username_format check (username::text ~ '^[a-z0-9_]{3,30}$')
);

create table public.channels (
 id uuid primary key default gen_random_uuid(), owner_id uuid unique not null references public.profiles(id) on delete cascade,
 slug citext unique not null, name text not null, description text not null default '', avatar_url text, banner_url text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.posts (
 id uuid primary key default gen_random_uuid(), author_id uuid not null references public.profiles(id) on delete cascade,
 type public.post_type not null default 'text', caption text not null default '', visibility public.visibility not null default 'public',
 link_url text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table public.media (
 id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade,
 storage_path text not null, mime_type text not null, width integer, height integer, duration_seconds numeric, created_at timestamptz not null default now()
);

create table public.follows (follower_id uuid not null references public.profiles(id) on delete cascade, following_id uuid not null references public.profiles(id) on delete cascade, created_at timestamptz not null default now(), primary key(follower_id,following_id), check(follower_id<>following_id));
create table public.likes (user_id uuid not null references public.profiles(id) on delete cascade, post_id uuid not null references public.posts(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,post_id));
create table public.comments (id uuid primary key default gen_random_uuid(), post_id uuid not null references public.posts(id) on delete cascade, author_id uuid not null references public.profiles(id) on delete cascade, body text not null check(length(body) between 1 and 2000), created_at timestamptz not null default now());
create table public.saved_posts (user_id uuid not null references public.profiles(id) on delete cascade, post_id uuid not null references public.posts(id) on delete cascade, created_at timestamptz not null default now(), primary key(user_id,post_id));
create table public.notifications (id uuid primary key default gen_random_uuid(), recipient_id uuid not null references public.profiles(id) on delete cascade, actor_id uuid references public.profiles(id) on delete set null, kind text not null, entity_id uuid, message text not null default '', read_at timestamptz, created_at timestamptz not null default now());
create table public.reports (id uuid primary key default gen_random_uuid(), reporter_id uuid not null references public.profiles(id) on delete cascade, post_id uuid references public.posts(id) on delete cascade, reason text not null, details text not null default '', status text not null default 'open', created_at timestamptz not null default now());

create index posts_created_idx on public.posts(created_at desc);
create index posts_author_idx on public.posts(author_id,created_at desc);
create index comments_post_idx on public.comments(post_id,created_at desc);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,username,display_name) values(new.id, lower(coalesce(new.raw_user_meta_data->>'user_name','user_'||substr(replace(new.id::text,'-',''),1,8))), coalesce(new.raw_user_meta_data->>'display_name','New User')) on conflict do nothing;
 return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path=public as $$ select exists(select 1 from public.profiles where id=auth.uid() and role in ('admin','moderator')); $$;

alter table public.profiles enable row level security;
alter table public.channels enable row level security;
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.follows enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.saved_posts enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

create policy profiles_read on public.profiles for select using (not is_suspended or id=auth.uid() or public.is_staff());
create policy profiles_update on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
create policy channels_read on public.channels for select using(true);
create policy channels_owner_write on public.channels for all using(owner_id=auth.uid() or public.is_staff()) with check(owner_id=auth.uid() or public.is_staff());
create policy posts_read on public.posts for select using(author_id=auth.uid() or visibility in('public','unlisted') or public.is_staff());
create policy posts_owner_insert on public.posts for insert with check(author_id=auth.uid());
create policy posts_owner_update on public.posts for update using(author_id=auth.uid() or public.is_staff()) with check(author_id=auth.uid() or public.is_staff());
create policy posts_owner_delete on public.posts for delete using(author_id=auth.uid() or public.is_staff());
create policy media_read on public.media for select using(exists(select 1 from public.posts p where p.id=post_id and (p.author_id=auth.uid() or p.visibility in('public','unlisted') or public.is_staff())));
create policy media_owner_insert on public.media for insert with check(exists(select 1 from public.posts p where p.id=post_id and p.author_id=auth.uid()));
create policy media_owner_delete on public.media for delete using(exists(select 1 from public.posts p where p.id=post_id and (p.author_id=auth.uid() or public.is_staff())));
create policy follows_read on public.follows for select using(true);
create policy follows_insert on public.follows for insert with check(follower_id=auth.uid() and follower_id<>following_id);
create policy follows_delete on public.follows for delete using(follower_id=auth.uid());
create policy likes_read on public.likes for select using(true);
create policy likes_insert on public.likes for insert with check(user_id=auth.uid());
create policy likes_delete on public.likes for delete using(user_id=auth.uid());
create policy comments_read on public.comments for select using(true);
create policy comments_insert on public.comments for insert with check(author_id=auth.uid());
create policy comments_update on public.comments for update using(author_id=auth.uid() or public.is_staff()) with check(author_id=auth.uid() or public.is_staff());
create policy comments_delete on public.comments for delete using(author_id=auth.uid() or public.is_staff());
create policy saved_read on public.saved_posts for select using(user_id=auth.uid());
create policy saved_insert on public.saved_posts for insert with check(user_id=auth.uid());
create policy saved_delete on public.saved_posts for delete using(user_id=auth.uid());
create policy notifications_read on public.notifications for select using(recipient_id=auth.uid());
create policy notifications_update on public.notifications for update using(recipient_id=auth.uid()) with check(recipient_id=auth.uid());
create policy reports_insert on public.reports for insert with check(reporter_id=auth.uid());
create policy reports_read on public.reports for select using(reporter_id=auth.uid() or public.is_staff());
create policy reports_staff_update on public.reports for update using(public.is_staff()) with check(public.is_staff());
