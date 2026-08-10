import Link from 'next/link';
import ReelCard from '@/components/reels/reel-card';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ReelsPage() {
  const supabase = await createClient();
  const { data: reels, error } = await supabase
    .from('posts')
    .select('id,caption,author_id,created_at,profiles(username,display_name),media_assets!inner(path,mime_type)')
    .eq('post_type', 'reel')
    .eq('media_assets.kind', 'video')
    .order('created_at', { ascending: false })
    .limit(30);

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-black">← VibeSphere</Link>
          <h1 className="text-lg font-black">Reels</h1>
          <Link href="/create" className="rounded-full bg-[var(--brand)] px-4 py-2 text-sm font-bold text-white">Create</Link>
        </div>
      </header>
      <section className="mx-auto max-w-2xl space-y-4 px-2 py-4">
        {error && <div className="rounded-2xl border bg-white p-5 text-sm text-red-600">Unable to load Reels. Run the media migration and make sure your Supabase environment variables are configured.</div>}
        {!error && (reels ?? []).length === 0 && <div className="rounded-2xl border bg-white p-8 text-center"><div className="text-4xl">🎬</div><h2 className="mt-3 text-xl font-black">No Reels yet</h2><p className="mt-2 text-sm text-gray-500">Upload a video and publish it as a Reel to start the feed.</p><Link href="/create" className="mt-4 inline-block rounded-full bg-[var(--brand)] px-5 py-2 font-bold text-white">Create a Reel</Link></div>}
        {(reels ?? []).map((reel) => <ReelCard key={reel.id} reel={reel as never} />)}
      </section>
    </main>
  );
}
