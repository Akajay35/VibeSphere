import Link from "next/link";

export default function LoginPage() {
  return <main className="simple-page"><Link className="brand" href="/">Vibe<span>Sphere</span></Link><div className="panel"><p className="eyebrow">Welcome back</p><h1>Sign in</h1><p className="muted">This rebuilt starter keeps authentication UI independent from the deployment pipeline.</p><form className="form"><input type="email" placeholder="Email" aria-label="Email" /><input type="password" placeholder="Password" aria-label="Password" /><button className="button primary" type="button">Continue</button></form><p className="muted">New here? <Link href="/auth/signup">Create an account</Link></p></div></main>;
}
