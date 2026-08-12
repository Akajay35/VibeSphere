"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!supabase) {
      setError("Authentication is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to the deployment environment.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { data, error: signupError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    setLoading(false);

    if (signupError) {
      setError(signupError.message);
      return;
    }

    if (data.session) {
      window.location.href = "/";
      return;
    }

    setMessage("Account created. Check your email to confirm your account, then sign in.");
    setPassword("");
  }

  return (
    <main className="simple-page">
      <Link className="brand" href="/">
        Vibe<span>Sphere</span>
      </Link>
      <div className="panel">
        <p className="eyebrow">Join the community</p>
        <h1>Create account</h1>
        <p className="muted">Create your VibeSphere account and start exploring.</p>

        <form className="form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" aria-label="Name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required disabled={loading} />
          <input type="email" placeholder="Email" aria-label="Email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" aria-label="Password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required disabled={loading} />

          {error ? <p role="alert" className="muted">{error}</p> : null}
          {message ? <p role="status" className="muted">{message}</p> : null}

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="muted">
          Already registered? <Link href="/auth/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
