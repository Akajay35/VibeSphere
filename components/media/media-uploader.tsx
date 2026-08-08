'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const MAX_IMAGE = 10 * 1024 * 1024;
const MAX_VIDEO = 100 * 1024 * 1024;

export default function MediaUploader() {
  const supabase = createClient();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function publish() {
    if (!file) return;
    setBusy(true); setMessage('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first.');
      const kind = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (!kind) throw new Error('Choose an image or video file.');
      if (kind === 'image' && file.size > MAX_IMAGE) throw new Error('Images must be 10 MB or smaller.');
      if (kind === 'video' && file.size > MAX_VIDEO) throw new Error('Videos must be 100 MB or smaller.');

      const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const upload = await supabase.storage.from('media').upload(path, file, { contentType: file.type, upsert: false });
      if (upload.error) throw upload.error;
      const { data: publicFile } = supabase.storage.from('media').getPublicUrl(path);

      const media = await supabase.from('media_assets').insert({ owner_id: user.id, kind, path, mime_type: file.type, size_bytes: file.size }).select('id').single();
      if (media.error) throw media.error;
      const post = await supabase.from('posts').insert({ author_id: user.id, caption: caption.trim(), media_asset_id: media.data.id, post_type: kind === 'video' ? 'video' : 'image' }).select('id').single();
      if (post.error) throw post.error;
      setFile(null); setCaption(''); setMessage(`Published successfully: ${publicFile.publicUrl}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally { setBusy(false); }
  }

  return <section className="rounded-2xl border bg-white p-5 shadow-sm">
    <h1 className="text-xl font-black">Create media post</h1>
    <p className="mt-1 text-sm text-gray-500">Upload an image or video directly to VibeSphere.</p>
    <input className="mt-4 block w-full rounded-xl border p-3 text-sm" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." maxLength={2200} className="mt-3 min-h-24 w-full rounded-xl border p-3 outline-none" />
    {file && <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">Selected: <b>{file.name}</b> · {(file.size / 1024 / 1024).toFixed(1)} MB</div>}
    <button disabled={!file || busy} onClick={() => void publish()} className="mt-4 rounded-full bg-[var(--brand)] px-5 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{busy ? 'Uploading…' : 'Publish'}</button>
    {message && <p className="mt-3 break-all text-sm text-gray-600">{message}</p>}
  </section>;
}
