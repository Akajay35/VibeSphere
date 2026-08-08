create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','moderator','admin')) default 'user',
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

create or replace function public.has_moderation_role(required_role text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles r
    where r.user_id = auth.uid()
      and case required_role
        when 'admin' then r.role = 'admin'
        when 'moderator' then r.role in ('moderator','admin')
        else false
      end
  );
$$;

create policy "users read own role" on public.user_roles for select using (auth.uid() = user_id or public.has_moderation_role('moderator'));

create policy "moderators read reports" on public.reports for select using (auth.uid() = reporter_id or public.has_moderation_role('moderator'));
create policy "moderators update reports" on public.reports for update using (public.has_moderation_role('moderator')) with check (public.has_moderation_role('moderator'));

create or replace function public.resolve_report(report_id uuid, new_status text)
returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  if not public.has_moderation_role('moderator') then raise exception 'not authorized'; end if;
  if new_status not in ('reviewing','resolved','dismissed') then raise exception 'invalid status'; end if;
  update public.reports set status = new_status, resolved_at = case when new_status in ('resolved','dismissed') then now() else null end where id = report_id;
  return found;
end;
$$;
