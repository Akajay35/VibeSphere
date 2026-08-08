-- VibeSphere media layer
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('image','video','audio')),
  bucket text not null default 'media',
  path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  width integer,
  height integer,
  duration_seconds numeric,
  created_at timestamptz not null default now()
);

alter table public.posts add column if not exists media_asset_id uuid references public.media_assets(id) on delete set null;
alter table public.posts add column if not exists post_type text not null default 'text' check (post_type in ('text','image','video','reel'));

create index if not exists media_assets_owner_idx on public.media_assets(owner_id, created_at desc);
create index if not exists posts_type_idx on public.posts(post_type, created_at desc);

alter table public.media_assets enable row level security;

create policy "media assets are public to read" on public.media_assets
for select using (true);
create policy "users can insert own media metadata" on public.media_assets
for insert to authenticated with check (auth.uid() = owner_id);
create policy "users can update own media metadata" on public.media_assets
for update to authenticated using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "users can delete own media metadata" on public.media_assets
for delete to authenticated using (auth.uid() = owner_id);

-- Create this bucket once in Supabase. Keep it public for simple CDN playback.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public media files are readable" on storage.objects
for select using (bucket_id = 'media');

create policy "authenticated users upload media" on storage.objects
for insert to authenticated
with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "users update their media" on storage.objects
for update to authenticated
using (bucket_id = 'media' and owner_id = auth.uid())
with check (bucket_id = 'media' and owner_id = auth.uid());

create policy "users delete their media" on storage.objects
for delete to authenticated
using (bucket_id = 'media' and owner_id = auth.uid());
