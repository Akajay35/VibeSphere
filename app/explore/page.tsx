import Link from "next/link";

const posts = [
  ["Welcome to VibeSphere", "The new community space is live."],
  ["Creator mode", "Build, share and discover without the clutter."],
  ["What's your vibe?", "Travel, tech, food, stories and everything between."],
];

export default function ExplorePage() {
  return <main className="simple-page"><Link className="brand" href="/">Vibe<span>Sphere</span></Link><div className="panel"><p className="eyebrow">Discover</p><h1>Explore</h1><p className="muted">A lightweight starter feed, ready for real content and Supabase data.</p><div className="feature-grid">{posts.map(([title, text]) => <article className="feature" key={title}><p className="feature-number">POST</p><h2>{title}</h2><p>{text}</p></article>)}</div></div></main>;
}
