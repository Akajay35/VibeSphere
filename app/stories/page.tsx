'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Story = { id: string; media_url: string; media_type: 'image' | 'video'; caption: string | null; author_id: string; expires_at: string; profiles?: { username?: string; display_name?: string } | null };

export default function StoriesPage() {
  const supabase = createClient();
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState<Story | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.from('stories').select('id,media_url,media_type,caption,author_id,expires_at,profiles(username,display_name)').gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false });
      setStories((data ?? []) as Story[]);
    })();
  }, []);

  async function openStory(i: number) {
    const story = stories[i];
    if (!story) return;
    setIndex(i); setActive(story);
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.id !== story.author_id) await supabase.from('story_views').upsert({ story_id: story.id, viewer_id: user.id }, { onConflict: 'story_id,viewer_id' });
  }

  function next() { if (index + 1 < stories.length) void openStory(index + 1); else setActive(null); }

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center justify-between"><Link href="/" className="font-bold">← VibeSphere</Link><h1 className="text-2xl font-black">Stories</h1><span /></div><div className="grid grid-cols-3 gap-3 sm:grid-cols-4">{stories.map((story, i) => { const p = Array.isArray(story.profiles) ? story.profiles[0] : story.profiles; return <button key={story.id} onClick={() => void openStory(i)} className="overflow-hidden rounded-2xl border bg-white text-left shadow-sm"><div className="aspect-[9/14] bg-black">{story.media_type === 'video' ? <video src={story.media_url} muted playsInline className="h-full w-full object-cover" /> : <img src={story.media_url} alt="Story" className="h-full w-full object-cover" />}</div><div className="truncate p-2 text-sm font-semibold">{p?.display_name || p?.username || 'Creator'}</div></button>; })}</div>{stories.length === 0 && <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">No active stories yet.</div>}</div>{active && <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-3" onClick={next}><div className="relative h-[90vh] w-full max-w-md overflow-hidden rounded-2xl bg-black" onClick={e => e.stopPropagation()}><div className="absolute left-0 right-0 top-0 z-10 h-1 bg-white/30"><div className="h-full bg-white" style={{ width: '100%' }} /></div>{active.media_type === 'video' ? <video src={active.media_url} autoPlay playsInline controls className="h-full w-full object-contain" onEnded={next} /> : <img src={active.media_url} alt="Story" className="h-full w-full object-contain" />}{active.caption && <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-black/50 p-3 text-white">{active.caption}</div>}<button onClick={() => setActive(null)} className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-2 text-white">✕</button></div></div>}</main>;
}
