'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

type Plan = { id: string; name: string; description: string | null; price_minor: number; currency: string; is_active: boolean };

type Supabase = SupabaseClient;

export default function CreatorSubscriptionsPage() {
  const [supabase, setSupabase] = useState<Supabase | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [name, setName] = useState('Supporter');
  const [description, setDescription] = useState('Exclusive creator updates and community access.');
  const [price, setPrice] = useState('99');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('creator_plans')
        .select('id,name,description,price_minor,currency,is_active')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      setPlans((data ?? []) as Plan[]);
      setLoading(false);
    }

    void load();
  }, [supabase]);

  async function createPlan() {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    const amount = Math.round(Number(price) * 100);
    if (!user || !Number.isFinite(amount) || amount < 0 || !name.trim()) return;
    const { error } = await supabase.from('creator_plans').insert({
      creator_id: user.id,
      name: name.trim(),
      description: description.trim() || null,
      price_minor: amount,
      currency: 'INR',
    });
    if (!error) {
      const { data } = await supabase
        .from('creator_plans')
        .select('id,name,description,price_minor,currency,is_active')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      setPlans((data ?? []) as Plan[]);
    }
  }

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-4xl"><Link href="/dashboard" className="text-sm text-gray-500">← Dashboard</Link><h1 className="mt-2 text-3xl font-black">Creator subscriptions</h1><p className="mt-1 text-gray-500">Create subscription-plan metadata. Payment processing is intentionally handled by a future server-side payment integration.</p><section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm"><h2 className="font-bold">New plan</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><input value={name} onChange={e => setName(e.target.value)} placeholder="Plan name" className="rounded-xl border px-4 py-3" /><input value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal" placeholder="Monthly price (INR)" className="rounded-xl border px-4 py-3" /></div><textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-3 min-h-24 w-full rounded-xl border p-4" /><button onClick={() => void createPlan()} disabled={!supabase} className="mt-3 rounded-full bg-[var(--brand)] px-5 py-3 font-bold text-white disabled:opacity-50">Save plan</button></section><section className="mt-6 space-y-3">{loading ? <p>Loading…</p> : plans.map(p => <div key={p.id} className="rounded-2xl border bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-bold">{p.name}</h2><p className="text-sm text-gray-500">{p.description}</p></div><div className="text-lg font-black">{p.currency} {(p.price_minor / 100).toFixed(2)}/month</div></div></div>)}</section></div></main>;
}
