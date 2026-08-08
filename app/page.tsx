export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <span className="mb-5 w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
          VibeSphere · Creator-first social platform
        </span>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
          Create. Share. Discover.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          One original platform for short videos, long videos, photos, stories,
          creators, communities and conversations.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a className="rounded-xl bg-white px-6 py-3 font-semibold text-slate-950" href="/auth/signup">
            Get started
          </a>
          <a className="rounded-xl border border-white/15 px-6 py-3 font-semibold" href="/explore">
            Explore
          </a>
        </div>
      </section>
    </main>
  );
}
