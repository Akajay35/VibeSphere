'use client';

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = { id:string; username:string; display_name:string; bio:string; avatar_url:string|null; cover_url:string|null; website:string|null; created_at:string } | null;
type Post = { id:string; caption:string; created_at:string };

export default function ProfileClient({ profile, followers, following, posts }: { profile:Profile; followers:number; following:number; posts:Post[] }) {
  const supabase = createClient();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [saving, setSaving] = useState(false);

  if (!profile) return <main className="mx-auto max-w-2xl p-6">Profile not found.</main>;

  async function save() {
    setSaving(true);
    await supabase.from("profiles").update({ display_name: name.trim(), bio: bio.trim() }).eq("id", profile.id);
    setSaving(false); setEditing(false); window.location.reload();
  }

  return <main className="min-h-screen bg-gray-50 pb-16">
    <header className="border-b bg-white px-4 py-5"><div className="mx-auto max-w-3xl"><div className="h-32 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      <div className="-mt-10 flex items-end justify-between"><div className="grid h-24 w-24 place-items-center rounded-full border-4 border-white bg-gray-200 text-3xl font-black shadow">{(profile.display_name || profile.username)[0].toUpperCase()}</div><button onClick={() => setEditing(!editing)} className="rounded-full border bg-white px-5 py-2 font-semibold">{editing ? "Cancel" : "Edit profile"}</button></div>
      <h1 className="mt-3 text-2xl font-black">{profile.display_name || profile.username}</h1><p className="text-gray-500">@{profile.username}</p>
      {editing ? <div className="mt-4 space-y-3"><input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border p-3" placeholder="Display name" /><textarea value={bio} onChange={e=>setBio(e.target.value)} className="w-full rounded-xl border p-3" rows={3} placeholder="Bio" /><button disabled={saving} onClick={()=>void save()} className="rounded-full bg-indigo-600 px-5 py-2 font-bold text-white">{saving ? "Saving..." : "Save changes"}</button></div> : <p className="mt-3 whitespace-pre-wrap">{profile.bio || "Tell the VibeSphere community about yourself."}</p>}
      <div className="mt-5 flex gap-7 text-sm"><span><b>{posts.length}</b> posts</span><span><b>{followers}</b> followers</span><span><b>{following}</b> following</span></div>
    </div></header>
    <section className="mx-auto max-w-3xl px-4 py-6"><h2 className="mb-4 text-xl font-bold">Posts</h2><div className="space-y-4">{posts.map(p=><article key={p.id} className="rounded-2xl border bg-white p-5 shadow-sm"><p className="whitespace-pre-wrap">{p.caption}</p><time className="mt-3 block text-xs text-gray-500">{new Date(p.created_at).toLocaleString()}</time></article>)}{posts.length===0&&<div className="rounded-2xl border bg-white p-8 text-center text-gray-500">Your posts will appear here.</div>}</div></section>
  </main>;
}
