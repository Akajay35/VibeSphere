import Link from "next/link";

const features = [
  ["Create", "Share posts, stories and ideas from one simple workspace."],
  ["Discover", "Explore a clean feed built around people and communities you care about."],
  ["Connect", "Keep your profile, dashboard and future Supabase data in one place."],
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <nav className="nav">
        <Link className="brand" href="/">Vibe<span>Sphere</span></Link>
        <div className="nav-links">
          <Link href="/explore">Explore</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link className="nav-button" href="/auth/login">Sign in</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">A fresh social experience</p>
          <h1>Find your people.<br /><span>Share your vibe.</span></h1>
          <p className="hero-text">VibeSphere brings creators, stories and communities together in a fast, focused space built for the modern web.</p>
          <div className="actions">
            <Link className="button primary" href="/auth/signup">Create your account</Link>
            <Link className="button secondary" href="/explore">Explore the sphere →</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="glass-card"><div className="mini-avatar">VS</div><div><strong>Welcome to VibeSphere</strong><p>Make something worth sharing.</p></div></div>
          <div className="stat-card"><strong>24/7</strong><span>Always your space</span></div>
        </div>
      </section>

      <section className="feature-grid">
        {features.map(([title, text], index) => (
          <article className="feature" key={title}><p className="feature-number">0{index + 1}</p><h2>{title}</h2><p>{text}</p></article>
        ))}
      </section>
    </main>
  );
}
