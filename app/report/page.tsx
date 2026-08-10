'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type Supabase = ReturnType<typeof createClient>;
const reasons = ['spam','harassment','hate','violence','nudity','impersonation','scam','other'] as const;

export default function ReportPage() {
  const [supabase, setSupabase] = useState<Supabase | null>(null);
  const [reportedUserId, setReportedUserId] = useState('');
  const [reportedPostId, setReportedPostId] = useState('');
  const [reason, setReason] = useState<(typeof reasons)[number]>('spam');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (url && key) setSupabase(createClient());
  }, []);

  async function submit() {
    if (!supabase) { setError('Supabase is not configured.'); return; }
    setError('');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Please sign in before submitting a report.'); return; }
    if (!reportedUserId && !reportedPostId) { setError('Enter a user ID or post ID.'); return; }
    const { error: insertError } = await supabase.from('reports').insert({ reporter_id: user.id, reported_user_id: reportedUserId || null, reported_post_id: reportedPostId || null, reason, details: details.trim() || null });
    if (insertError) setError(insertError.message); else setSent(true);
  }

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-xl rounded-2xl border bg-white p-6 shadow-sm"><Link href="/" className="text-sm text-gray-500">← VibeSphere</Link><h1 className="mt-4 text-2xl font-black">Report content or a user</h1><p className="mt-1 text-sm text-gray-500">Reports help keep VibeSphere safe. Please provide accurate information.</p>{sent ? <div className="mt-6 rounded-xl bg-gray-50 p-4">Thanks. Your report was submitted for review.</div> : <div className="mt-6 space-y-4"><input value={reportedUserId} onChange={e=>setReportedUserId(e.target.value)} placeholder="Reported user ID (optional)" className="w-full rounded-xl border p-3" /><input value={reportedPostId} onChange={e=>setReportedPostId(e.target.value)} placeholder="Reported post ID (optional)" className="w-full rounded-xl border p-3" /><select value={reason} onChange={e=>setReason(e.target.value as typeof reason)} className="w-full rounded-xl border p-3">{reasons.map(r=><option key={r}>{r}</option>)}</select><textarea value={details} onChange={e=>setDetails(e.target.value)} maxLength={1000} placeholder="Additional details" className="min-h-28 w-full rounded-xl border p-3" />{error && <p className="text-sm text-red-600">{error}</p>}<button onClick={()=>void submit()} disabled={!supabase} className="w-full rounded-xl bg-[var(--brand)] px-4 py-3 font-bold text-white disabled:opacity-50">Submit report</button></div>}</div></main>;
}
