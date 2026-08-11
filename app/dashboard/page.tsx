import Link from "next/link";

export default function DashboardPage() {
  return <main className="simple-page"><Link className="brand" href="/">Vibe<span>Sphere</span></Link><div className="panel"><p className="eyebrow">Your space</p><h1>Dashboard</h1><p className="muted">Your creator dashboard is ready for the next VibeSphere phase.</p><div className="feature-grid"><article className="feature"><h2>Posts</h2><p>0 published</p></article><article className="feature"><h2>Followers</h2><p>0 followers</p></article><article className="feature"><h2>Drafts</h2><p>0 drafts</p></article></div><p className="muted"><Link href="/explore">Go to Explore →</Link></p></div></main>;
}
