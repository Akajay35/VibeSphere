"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Authentication is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the deployment environment.");
      return;
    }

    setLoading(true);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (loginError) {
      setError(loginError.message);
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="simple-page">
      <Link className="brand" href="/">
        Vibe<span>Sphere</span>
      </Link>
      <div className="panel">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in</h1>
        <p className="muted">Sign in to continue to VibeSphere.</p>

        <form className="form" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" aria-label="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" aria-label="Password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} />

          {error ? <p role="alert" className="muted">{error}</p> : null}

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="muted">
          New here? <Link href="/auth/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
