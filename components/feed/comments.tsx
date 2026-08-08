'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Comments({ postId }: { postId: string }) {
  const supabase = createClient();
  const [body, setBody] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; body: string; created_at: string; profiles?: { username?: string; display_name?: string } | null }>>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await supabase
      .from('comments')
      .select('id,body,created_at,profiles(username,display_name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    setComments((data ?? []) as typeof comments);
    setLoading(false);
  }

  useEffect(() => { void load(); }, [postId]);

  async function submit() {
    const text = body.trim();
    if (!text) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from('comments').insert({ post_id: postId, author_id: user.id, body: text });
    if (!error) { setBody(''); await load(); }
  }

  return (
    <div className="mt-3 border-t pt-3">
      <div className="flex gap-2">
        <input value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') void submit(); }} placeholder="Write a comment..." className="min-w-0 flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:ring-2" maxLength={500} />
        <button onClick={() => void submit()} className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white">Post</button>
      </div>
      {!loading && comments.length > 0 && <div className="mt-3 space-y-3">{comments.slice(0, 10).map((c) => { const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles; return <div key={c.id} className="rounded-xl bg-gray-50 px-3 py-2"><div className="text-xs font-semibold">{p?.display_name || p?.username || 'User'}</div><div className="text-sm">{c.body}</div></div>; })}</div>}
    </div>
  );
}
