'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// This page only needs Supabase in the browser. Keeping it dynamic prevents
// accidental server/static prerendering from evaluating browser-only data access.
export const dynamic = 'force-dynamic';

type Message = { id: string; conversation_id: string; sender_id: string; body: string; created_at: string };
type SupabaseClient = ReturnType<typeof createClient>;

export default function MessagesPage() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      setLoading(false);
      return;
    }
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let channel: ReturnType<typeof supabase.channel> | undefined;
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);
      if (!user) { setLoading(false); return; }
      const { data: membership } = await supabase.from('conversation_members').select('conversation_id').eq('user_id', user.id).limit(1).maybeSingle();
      if (!membership) { setLoading(false); return; }
      setConversationId(membership.conversation_id);
      const { data } = await supabase.from('messages').select('id,conversation_id,sender_id,body,created_at').eq('conversation_id', membership.conversation_id).order('created_at');
      setMessages(data ?? []);
      channel = supabase.channel(`conversation:${membership.conversation_id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${membership.conversation_id}` }, payload => setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new as Message])).subscribe();
      setLoading(false);
    })();
    return () => { if (channel) void supabase.removeChannel(channel); };
  }, [supabase]);

  async function send() {
    const text = body.trim();
    if (!supabase || !text || !userId || !conversationId) return;
    const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: userId, body: text });
    if (!error) setBody('');
  }

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto flex min-h-[90vh] max-w-3xl flex-col overflow-hidden rounded-2xl border bg-white shadow-sm"><header className="border-b p-4"><h1 className="text-xl font-black">Messages</h1><p className="text-sm text-gray-500">Real-time VibeSphere chat</p></header><div className="flex-1 space-y-3 overflow-y-auto p-4">{loading ? <p className="text-gray-500">Loading…</p> : !conversationId ? <div className="py-20 text-center text-gray-500">No conversation yet. Start a conversation from a creator profile.</div> : messages.map(m => <div key={m.id} className={`flex ${m.sender_id === userId ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[80%] rounded-2xl px-4 py-2 ${m.sender_id === userId ? 'bg-[var(--brand)] text-white' : 'bg-gray-100'}`}>{m.body}</div></div>)}</div>{conversationId && <div className="flex gap-2 border-t p-3"><input value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') void send(); }} maxLength={5000} placeholder="Write a message…" className="min-w-0 flex-1 rounded-full border px-4 py-3 outline-none" /><button onClick={() => void send()} className="rounded-full bg-[var(--brand)] px-5 font-bold text-white">Send</button></div>}</div></main>;
}
