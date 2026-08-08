'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PostActions({ postId, authorId, initialLiked = false, initialSaved = false, initialFollowing = false }: { postId: string; authorId: string; initialLiked?: boolean; initialSaved?: boolean; initialFollowing?: boolean }) {
  const supabase = createClient();
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function toggleLike() {
    if (busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      setLiked(false);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      setLiked(true);
    }
    setBusy(false);
  }

  async function toggleSave() {
    if (busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setBusy(false); return; }
    if (saved) {
      await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
      setSaved(false);
    } else {
      await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
      setSaved(true);
    }
    setBusy(false);
  }

  async function toggleFollow() {
    if (busy) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id === authorId) { setBusy(false); return; }
    if (following) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', authorId);
      setFollowing(false);
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: authorId });
      setFollowing(true);
    }
    setBusy(false);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-5 border-t pt-3 text-sm text-gray-600">
      <button onClick={toggleLike} disabled={busy} className={liked ? 'font-bold text-pink-600' : ''}>{liked ? '❤️ Liked' : '🤍 Like'}</button>
      <button>💬 Comment</button>
      <button onClick={toggleSave} disabled={busy} className={saved ? 'font-bold text-indigo-600' : ''}>{saved ? '🔖 Saved' : '🔖 Save'}</button>
      <button onClick={toggleFollow} disabled={busy || following} className={following ? 'text-gray-400' : 'font-semibold text-indigo-600'}>{following ? 'Following' : '+ Follow'}</button>
    </div>
  );
}
