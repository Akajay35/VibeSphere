"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    window.location.assign("/");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-sm">
        <div className="mb-6 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)] text-2xl font-black text-white">V</div><h1 className="mt-4 text-2xl font-black">Welcome back</h1><p className="mt-1 text-sm text-gray-500">Sign in to VibeSphere</p></div>
        <label className="block text-sm font-semibold">Email<input className="mt-2 w-full rounded-xl border p-3" type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="mt-4 block text-sm font-semibold">Password<input className="mt-2 w-full rounded-xl border p-3" type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-[var(--brand)] p-3 font-bold text-white disabled:opacity-60">{loading ? "Signing in…" : "Sign in"}</button>
        <p className="mt-5 text-center text-sm text-gray-500">New here? <Link className="font-bold text-[var(--brand)]" href="/auth/signup">Create an account</Link></p>
      </form>
    </main>
  );
}
