create index if not exists profiles_username_search_idx on public.profiles using gin (to_tsvector('simple', coalesce(username,'') || ' ' || coalesce(display_name,'') || ' ' || coalesce(bio,'')));
create index if not exists posts_caption_search_idx on public.posts using gin (to_tsvector('simple', coalesce(caption,'')));

create or replace function public.search_profiles(search_text text)
returns setof public.profiles
language sql stable security invoker
as $$
  select p from public.profiles p
  where search_text is not null and length(trim(search_text)) > 0
    and (p.username ilike '%' || trim(search_text) || '%' or p.display_name ilike '%' || trim(search_text) || '%')
  order by p.username
  limit 30;
$$;

create or replace function public.search_posts(search_text text)
returns setof public.posts
language sql stable security invoker
as $$
  select p from public.posts p
  where search_text is not null and length(trim(search_text)) > 0
    and p.caption ilike '%' || trim(search_text) || '%'
  order by p.created_at desc
  limit 50;
$$;
