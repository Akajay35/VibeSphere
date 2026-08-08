import Link from "next/link";
import CreatePost from "@/components/feed/create-post";
import PostActions from "@/components/feed/post-actions";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const [{ data: posts }, { data: { user } }] = await Promise.all([
    supabase.from("posts").select("id,caption,created_at,author_id,profiles(username,display_name,avatar_url)").order("created_at", { ascending: false }).limit(30),
    supabase.auth.getUser(),
  ]);

  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand)] text-xl font-black text-white">V</div><div><div className="text-xl font-black">VibeSphere</div><div className="text-xs text-gray-500">Create. Connect. Discover.</div></div></Link>
          <div className="hidden w-80 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-500 md:block">🔎 Search creators, videos, hashtags</div>
          {user ? <Link href="/profile/me" className="rounded-full bg-[var(--brand)] px-4 py-2 font-semibold text-white">Profile</Link> : <Link href="/auth/login" className="rounded-full bg-[var(--brand)] px-4 py-2 font-semibold text-white">Sign in</Link>}
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <aside className="hidden lg:block"><nav className="sticky top-24 space-y-2">{[["🏠","Home"],["🎬","Reels"],["▶️","Videos"],["🧭","Explore"],["💬","Messages"],["🔔","Notifications"],["🔖","Saved"],["👤","Profile"]].map(([i,n])=><Link key={n} href={n === "Home" ? "/" : `/${n.toLowerCase()}`} className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold hover:bg-white"><span className="text-lg">{i}</span>{n}</Link>)}</nav></aside>
        <section className="space-y-5">
          {user ? <CreatePost /> : <div className="rounded-2xl border bg-white p-5 text-center shadow-sm"><p className="font-semibold">Join the VibeSphere community.</p><Link href="/auth/signup" className="mt-3 inline-block rounded-full bg-[var(--brand)] px-5 py-2 font-bold text-white">Create account</Link></div>}
          {(posts ?? []).map((post) => {
            const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
            return <article key={post.id} className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-gray-200 font-bold">{(profile?.display_name || profile?.username || "V")[0].toUpperCase()}</div><div className="flex-1"><div className="font-bold">{profile?.display_name || "VibeSphere creator"}</div><div className="text-sm text-gray-500">@{profile?.username || "creator"} · {new Date(post.created_at).toLocaleString()}</div></div><button className="text-gray-400">•••</button></div><p className="mt-4 whitespace-pre-wrap leading-7">{post.caption}</p><PostActions postId={post.id} authorId={post.author_id} /></article>;
          })}
          {(!posts || posts.length === 0) && <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">No posts yet. Be the first creator to post.</div>}
        </section>
        <aside className="hidden space-y-5 lg:block"><div className="rounded-2xl border bg-white p-4 shadow-sm"><h2 className="font-bold">Trending now</h2><div className="mt-3 space-y-4 text-sm"><div><b>#VibeSphere</b><p className="m-0 text-gray-500">Discover the community</p></div><div><b>#CreatorLife</b><p className="m-0 text-gray-500">Creator conversations</p></div><div><b>#AI</b><p className="m-0 text-gray-500">Technology & creativity</p></div></div></div><div className="rounded-2xl border bg-white p-4 shadow-sm"><h2 className="font-bold">Build your audience</h2><p className="mt-2 text-sm text-gray-500">Complete your profile, publish consistently, and connect with creators.</p></div></aside>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t bg-white p-3 lg:hidden">{[["🏠","Home"],["🎬","Reels"],["➕","Create"],["🔎","Explore"],["👤","Profile"]].map(([i,n])=><Link key={n} href={n === "Home" ? "/" : `/${n.toLowerCase()}`} className="text-center text-xs"><div className="text-lg">{i}</div>{n}</Link>)}</nav>
    </main>
  );
}
