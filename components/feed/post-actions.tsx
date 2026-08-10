'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Supabase = ReturnType<typeof createClient>;

export default function PostActions({ postId, authorId, initialLiked = false, initialSaved = false, initialFollowing = false }: { postId: string; authorId: string; initialLiked?: boolean; initialSaved?: boolean; initialFollowing?: boolean }) {
  const [supabase, setSupabase] = useState<Supabase | null>(null);
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) setSupabase(createClient());
  }, []);

  async function toggleLike() {
    if (!supabase || busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    if (liked) { await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id); setLiked(false); }
    else { await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id }); setLiked(true); }
    setBusy(false);
  }

  async function toggleSave() {
    if (!supabase || busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    if (saved) { await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id); setSaved(false); }
    else { await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id }); setSaved(true); }
    setBusy(false);
  }

  async function toggleFollow() {
    if (!supabase || busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === authorId) { setBusy(false); return; }
    if (following) { await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', authorId); setFollowing(false); }
    else { await supabase.from('follows').insert({ follower_id: user.id, following_id: authorId }); setFollowing(true); }
    setBusy(false);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-5 border-t pt-3 text-sm text-gray-600">
      <button onClick={() => void toggleLike()} disabled={!supabase || busy} className={liked ? 'font-bold text-pink-600' : ''}>{liked ? '❤️ Liked' : '🤍 Like'}</button>
      <button>💬 Comment</button>
      <button onClick={() => void toggleSave()} disabled={!supabase || busy} className={saved ? 'font-bold text-indigo-600' : ''}>{saved ? '🔖 Saved' : '🔖 Save'}</button>
      <button onClick={() => void toggleFollow()} disabled={!supabase || busy || following} className={following ? 'text-gray-400' : 'font-semibold text-indigo-600'}>{following ? 'Following' : '+ Follow'}</button>
    </div>
  );
}
