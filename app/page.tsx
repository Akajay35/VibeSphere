const posts = [
  { user: "Aarav Sharma", handle: "@aarav", time: "12 min", text: "New day, new ideas. Building something meaningful. 🚀", likes: 248, comments: 32 },
  { user: "Maya Creative", handle: "@mayacreative", time: "28 min", text: "Behind the scenes from today's creator session 🎥✨", likes: 517, comments: 64 },
  { user: "Tech With Raj", handle: "@techraj", time: "1 hr", text: "What feature should VibeSphere launch next?", likes: 183, comments: 21 }
];

export default function HomePage() {
  return (
    <main className="min-h-screen pb-20">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--brand)] text-xl font-black text-white">V</div><div><div className="text-xl font-black">VibeSphere</div><div className="text-xs text-gray-500">Create. Connect. Discover.</div></div></div>
          <div className="hidden w-80 rounded-full bg-gray-100 px-4 py-2 md:block">🔎 Search creators, videos, hashtags</div>
          <a href="/auth/login" className="rounded-full bg-[var(--brand)] px-4 py-2 font-semibold text-white">Sign in</a>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <aside className="hidden lg:block"><nav className="sticky top-24 space-y-2">{[["🏠","Home"],["🎬","Reels"],["▶️","Videos"],["🧭","Explore"],["💬","Messages"],["🔔","Notifications"],["🔖","Saved"],["👤","Profile"]].map(([i,n])=><a key={n} href="#" className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold hover:bg-white"><span className="text-lg">{i}</span>{n}</a>)}</nav></aside>
        <section className="space-y-5">
          <div className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gray-200">👤</div><div className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-gray-500">What’s happening?</div></div><div className="mt-4 flex justify-between border-t pt-3 text-sm"><button>📷 Photo</button><button>🎥 Video</button><button>✨ Reel</button><button className="rounded-full bg-[var(--brand)] px-4 py-1.5 font-bold text-white">Create</button></div></div>
          {posts.map(p=><article key={p.handle} className="rounded-2xl border bg-white p-4 shadow-sm"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-gray-200 font-bold">{p.user[0]}</div><div className="flex-1"><div className="font-bold">{p.user}</div><div className="text-sm text-gray-500">{p.handle} · {p.time}</div></div><button className="text-gray-400">•••</button></div><p className="mt-4 leading-7">{p.text}</p><div className="mt-4 flex justify-between border-t pt-3 text-sm text-gray-600"><button>❤️ {p.likes}</button><button>💬 {p.comments}</button><button>🔁 Share</button><button>🔖 Save</button></div></article>)}
        </section>
        <aside className="hidden space-y-5 lg:block"><div className="rounded-2xl border bg-white p-4 shadow-sm"><h2 className="font-bold">Trending now</h2><div className="mt-3 space-y-4 text-sm"><div><b>#VibeSphere</b><p className="m-0 text-gray-500">18.4K posts</p></div><div><b>#CreatorLife</b><p className="m-0 text-gray-500">9.7K posts</p></div><div><b>#AI</b><p className="m-0 text-gray-500">7.2K posts</p></div></div></div><div className="rounded-2xl border bg-white p-4 shadow-sm"><h2 className="font-bold">Suggested creators</h2>{["Travel Tales","Food Lab","AI Daily"].map(x=><div key={x} className="mt-4 flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-gray-200">✨</div><div className="flex-1 text-sm font-semibold">{x}</div><button className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold">Follow</button></div>)}</div></aside>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t bg-white p-3 lg:hidden">{[["🏠","Home"],["🎬","Reels"],["➕","Create"],["🔎","Explore"],["👤","Profile"]].map(([i,n])=><button key={n} className="text-xs"><div className="text-lg">{i}</div>{n}</button>)}</nav>
    </main>
  );
}
