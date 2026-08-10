'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Notification = { id: string; type: string; created_at: string; read_at: string | null; actor_id: string | null; profiles?: { username?: string; display_name?: string } | null };

export default function NotificationsPage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    // Do not construct a Supabase client during a build/prerender when the
    // public environment variables are unavailable. This page can still
    // render its empty state and initialize normally in the browser once
    // the variables are present.
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return;

    const client = createClient();
    setSupabase(client);
    void (async () => {
      const { data } = await client.from('notifications').select('id,type,created_at,read_at,actor_id,profiles(username,display_name)').order('created_at', { ascending: false }).limit(50);
      setItems((data ?? []) as Notification[]);
    })();
  }, []);

  async function markRead(id?: string) {
    if (!supabase) return;
    if (id) await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
    else await supabase.from('notifications').update({ read_at: new Date().toISOString() }).is('read_at', null);
    const { data } = await supabase.from('notifications').select('id,type,created_at,read_at,actor_id,profiles(username,display_name)').order('created_at', { ascending: false }).limit(50);
    setItems((data ?? []) as Notification[]);
  }

  const text = (n: Notification) => {
    const p = Array.isArray(n.profiles) ? n.profiles[0] : n.profiles;
    const name = p?.display_name || p?.username || 'Someone';
    return n.type === 'like' ? `${name} liked your post` : n.type === 'comment' ? `${name} commented on your post` : n.type === 'follow' ? `${name} followed you` : n.type === 'story_view' ? `${name} viewed your story` : `${name} sent you a message`;
  };

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-2xl"><div className="mb-5 flex items-center justify-between"><Link href="/" className="font-bold">← VibeSphere</Link><h1 className="text-2xl font-black">Notifications</h1><button onClick={() => void markRead()} className="text-sm font-semibold">Mark all read</button></div><div className="overflow-hidden rounded-2xl border bg-white">{items.length === 0 ? <div className="p-10 text-center text-gray-500">You're all caught up.</div> : items.map(n => <button key={n.id} onClick={() => void markRead(n.id)} className={`flex w-full items-center gap-3 border-b p-4 text-left last:border-0 ${n.read_at ? '' : 'bg-gray-50'}`}><div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--brand)] text-white">{n.type === 'like' ? '❤️' : n.type === 'comment' ? '💬' : n.type === 'follow' ? '➕' : n.type === 'story_view' ? '👀' : '📩'}</div><div className="flex-1"><div className="font-medium">{text(n)}</div><div className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</div></div>{!n.read_at && <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />}</button>)}</div></div></main>;
}
