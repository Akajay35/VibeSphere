import Link from "next/link";

export default function SignupPage() {
  return <main className="simple-page"><Link className="brand" href="/">Vibe<span>Sphere</span></Link><div className="panel"><p className="eyebrow">Join the community</p><h1>Create account</h1><p className="muted">Start with the clean VibeSphere experience. Database wiring can be enabled separately when your Supabase secrets are ready.</p><form className="form"><input type="text" placeholder="Name" aria-label="Name" /><input type="email" placeholder="Email" aria-label="Email" /><input type="password" placeholder="Password" aria-label="Password" /><button className="button primary" type="button">Create account</button></form><p className="muted">Already registered? <Link href="/auth/login">Sign in</Link></p></div></main>;
}
