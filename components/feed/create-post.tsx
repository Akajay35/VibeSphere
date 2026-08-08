"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!caption.trim()) return;
    setLoading(true); setStatus("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); setStatus("Please sign in to post."); return; }
    const { error } = await supabase.from("posts").insert({ author_id: user.id, type: "text", caption: caption.trim(), visibility: "public" });
    setLoading(false);
    if (error) return setStatus(error.message);
    setCaption(""); setStatus("Posted successfully.");
    window.location.reload();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-white p-4 shadow-sm">
      <textarea value={caption} onChange={e => setCaption(e.target.value)} maxLength={5000} rows={3} placeholder="What’s happening?" className="w-full resize-none rounded-2xl bg-gray-100 p-4 outline-none" />
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-500">{status}</span>
        <button disabled={loading || !caption.trim()} className="rounded-full bg-[var(--brand)] px-5 py-2 font-bold text-white disabled:opacity-50">{loading ? "Posting…" : "Post"}</button>
      </div>
    </form>
  );
}
