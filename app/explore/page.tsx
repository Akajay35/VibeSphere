'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Profile = { id: string; username: string; display_name: string | null; bio: string | null; avatar_url: string | null };
type Post = { id: string; caption: string | null; post_type: string; created_at: string; author_id: string };

export default function ExplorePage() {
  const supabase = createClient();
  const [query, setQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => { const timer = setTimeout(() => void search(), 300); return () => clearTimeout(timer); }, [query]);
  async function search() {
    const q = query.trim();
    if (!q) { setProfiles([]); setPosts([]); return; }
    setLoading(true);
    const [{ data: ps }, { data: postData }] = await Promise.all([
      supabase.rpc('search_profiles', { search_text: q }),
      supabase.rpc('search_posts', { search_text: q }),
    ]);
    setProfiles((ps ?? []) as Profile[]); setPosts((postData ?? []) as Post[]); setLoading(false);
  }
  return <main className="min-h-screen bg-gray-50"><header className="border-b bg-white p-4"><div className="mx-auto flex max-w-5xl items-center gap-4"><Link href="/" className="font-black">VibeSphere</Link><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search creators, posts, hashtags..." className="flex-1 rounded-full bg-gray-100 px-5 py-3 outline-none focus:ring-2" /></div></header><div className="mx-auto max-w-5xl space-y-6 p-4"><section><h1 className="text-2xl font-black">Explore</h1><p className="text-gray-500">Discover creators and conversations across VibeSphere.</p></section>{loading && <p className="text-gray-500">Searching…</p>}{query && !loading && <><section><h2 className="mb-3 text-lg font-bold">Creators</h2><div className="grid gap-3 sm:grid-cols-2">{profiles.map(p => <Link href={`/profile/${p.username}`} key={p.id} className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-full bg-gray-200 font-bold">{(p.display_name || p.username)[0].toUpperCase()}</div><div><div className="font-bold">{p.display_name || p.username}</div><div className="text-sm text-gray-500">@{p.username}</div></div></div>{p.bio && <p className="mt-2 text-sm text-gray-600">{p.bio}</p>}</Link>)}</div>{profiles.length === 0 && <p className="text-sm text-gray-500">No creators found.</p>}</section><section><h2 className="mb-3 text-lg font-bold">Posts</h2><div className="space-y-3">{posts.map(p => <article key={p.id} className="rounded-2xl border bg-white p-4"><div className="text-xs font-semibold uppercase text-gray-400">{p.post_type}</div><p className="mt-2">{p.caption || 'Media post'}</p></article>)}</div>{posts.length === 0 && <p className="text-sm text-gray-500">No matching posts found.</p>}</section></>}</div></main>;
}
