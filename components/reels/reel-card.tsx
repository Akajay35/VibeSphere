'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import PostActions from '@/components/feed/post-actions';
import Comments from '@/components/feed/comments';

type Reel = {
  id: string;
  caption: string | null;
  author_id: string;
  profiles?: { username?: string | null; display_name?: string | null } | null;
  media_assets?: { path: string; mime_type: string } | null;
};

type Supabase = ReturnType<typeof createClient>;

export default function ReelCard({ reel }: { reel: Reel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [supabase, setSupabase] = useState<Supabase | null>(null);
  const profile = Array.isArray(reel.profiles) ? reel.profiles[0] : reel.profiles;
  const media = Array.isArray(reel.media_assets) ? reel.media_assets[0] : reel.media_assets;
  const videoUrl = media && supabase ? supabase.storage.from('media').getPublicUrl(media.path).data.publicUrl : '';

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) setSupabase(createClient());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.7 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  async function share() {
    const url = `${window.location.origin}/reels#${reel.id}`;
    if (navigator.share) await navigator.share({ title: 'VibeSphere Reel', text: reel.caption || 'Watch this Reel on VibeSphere', url });
    else await navigator.clipboard.writeText(url);
  }

  return (
    <article id={reel.id} className="relative flex min-h-[calc(100svh-80px)] snap-start items-end overflow-hidden rounded-3xl bg-black shadow-xl">
      <video ref={videoRef} src={videoUrl} className="absolute inset-0 h-full w-full object-cover" muted={muted} loop playsInline preload="metadata" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      <div className="relative z-10 w-full p-5 text-white">
        <div className="mb-4 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-white/20 font-bold">{(profile?.display_name || profile?.username || 'V')[0].toUpperCase()}</div><div><div className="font-bold">{profile?.display_name || 'VibeSphere creator'}</div><div className="text-sm text-white/70">@{profile?.username || 'creator'}</div></div></div>
        {reel.caption && <p className="mb-4 max-w-xl whitespace-pre-wrap text-sm leading-6">{reel.caption}</p>}
        <div className="flex items-center gap-2"><button onClick={() => { setMuted(v => !v); if (videoRef.current) videoRef.current.muted = !muted; }} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">{muted ? '🔇 Sound' : '🔊 Sound'}</button><button onClick={() => void share()} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">↗ Share</button><button onClick={() => setShowComments(v => !v)} className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">💬 Comments</button></div>
        <div className="mt-3 rounded-2xl bg-white p-2 text-black"><PostActions postId={reel.id} authorId={reel.author_id} />{showComments && <Comments postId={reel.id} />}</div>
      </div>
    </article>
  );
}
