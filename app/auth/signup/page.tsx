"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    const { error } = await createClient().auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, user_name: username } },
    });
    setLoading(false);
    if (error) return setError(error.message);
    setMessage("Account created. Check your email if confirmation is enabled.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-sm">
        <div className="mb-6 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)] text-2xl font-black text-white">V</div><h1 className="mt-4 text-2xl font-black">Join VibeSphere</h1><p className="mt-1 text-sm text-gray-500">Create your creator profile</p></div>
        <input className="w-full rounded-xl border p-3" required placeholder="Display name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <input className="mt-3 w-full rounded-xl border p-3" required minLength={3} maxLength={30} pattern="[a-z0-9_]+" placeholder="Username (a-z, 0-9, _)" value={username} onChange={e => setUsername(e.target.value.toLowerCase())} />
        <input className="mt-3 w-full rounded-xl border p-3" required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="mt-3 w-full rounded-xl border p-3" required minLength={8} type="password" placeholder="Password (8+ characters)" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-xl bg-[var(--brand)] p-3 font-bold text-white disabled:opacity-60">{loading ? "Creating…" : "Create account"}</button>
        <p className="mt-5 text-center text-sm text-gray-500">Already have an account? <Link className="font-bold text-[var(--brand)]" href="/auth/login">Sign in</Link></p>
      </form>
    </main>
  );
}
