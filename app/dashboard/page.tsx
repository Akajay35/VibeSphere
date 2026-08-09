'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Stats = { views: number; likes: number; comments: number; followers: number; posts: number };

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

      // Keep the page prerender-safe when deployment secrets are not available.
      if (!url || !key) {
        if (!cancelled) setLoading(false);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase.rpc('creator_analytics');

      if (!cancelled) {
        setStats(Array.isArray(data) ? (data[0] as Stats) : (data as Stats | null));
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = stats
    ? [
        ['👁️', 'Views', stats.views],
        ['❤️', 'Likes', stats.likes],
        ['💬', 'Comments', stats.comments],
        ['👥', 'Followers', stats.followers],
        ['📝', 'Posts', stats.posts],
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-gray-500">← VibeSphere</Link>
            <h1 className="text-3xl font-black">Creator Dashboard</h1>
            <p className="text-gray-500">Track how your content is performing.</p>
          </div>
          <Link href="/create" className="rounded-full bg-[var(--brand)] px-5 py-3 font-bold text-white">Create</Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border bg-white p-8">Loading analytics…</div>
        ) : !stats ? (
          <div className="rounded-2xl border bg-white p-8 text-gray-500">
            Sign in to view your creator analytics.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {cards.map(([icon, label, value]) => (
                <div key={String(label)} className="rounded-2xl border bg-white p-5 shadow-sm">
                  <div className="text-2xl">{icon}</div>
                  <div className="mt-4 text-2xl font-black">{Number(value).toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="font-bold">Audience growth</h2>
                <p className="mt-2 text-sm text-gray-500">Follower and engagement trend charts can be connected to date-filtered analytics as your audience grows.</p>
              </div>
              <div className="rounded-2xl border bg-white p-6">
                <h2 className="font-bold">Content performance</h2>
                <p className="mt-2 text-sm text-gray-500">Use views, likes and comments to identify your strongest posts, Reels and videos.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
