create table if not exists public.creator_plans (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 80),
  description text,
  price_minor integer not null check (price_minor >= 0),
  currency text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (creator_id, name)
);

create table if not exists public.creator_subscriptions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.creator_plans(id) on delete cascade,
  subscriber_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','paused','cancelled','expired')),
  provider text,
  provider_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique (plan_id, subscriber_id)
);

alter table public.creator_plans enable row level security;
alter table public.creator_subscriptions enable row level security;

create policy "active creator plans are public" on public.creator_plans for select using (is_active = true or creator_id = auth.uid());
create policy "creators manage their plans" on public.creator_plans for insert with check (creator_id = auth.uid());
create policy "creators update their plans" on public.creator_plans for update using (creator_id = auth.uid()) with check (creator_id = auth.uid());
create policy "creators delete their plans" on public.creator_plans for delete using (creator_id = auth.uid());

create policy "subscribers read own subscriptions" on public.creator_subscriptions for select using (subscriber_id = auth.uid());
create policy "creators read subscriptions to their plans" on public.creator_subscriptions for select using (exists (select 1 from public.creator_plans p where p.id = plan_id and p.creator_id = auth.uid()));
create policy "users create pending subscriptions" on public.creator_subscriptions for insert with check (subscriber_id = auth.uid() and status = 'pending');

create index if not exists creator_plans_creator_idx on public.creator_plans(creator_id, is_active);
create index if not exists creator_subscriptions_subscriber_idx on public.creator_subscriptions(subscriber_id, status);
