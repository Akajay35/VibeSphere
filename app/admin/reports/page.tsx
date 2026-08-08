'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Report = { id: string; reporter_id: string; reported_user_id: string | null; reported_post_id: string | null; reason: string; details: string | null; status: string; created_at: string };

export default function ReportsPage() {
  const supabase = createClient();
  const [reports, setReports] = useState<Report[]>([]);
  const [message, setMessage] = useState('Loading…');

  async function load() {
    const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) setMessage(error.message); else { setReports((data ?? []) as Report[]); setMessage(''); }
  }

  useEffect(() => { void load(); }, []);

  async function resolve(id: string, status: 'reviewing' | 'resolved' | 'dismissed') {
    const { error } = await supabase.rpc('resolve_report', { report_id: id, new_status: status });
    if (error) setMessage(error.message); else await load();
  }

  return <main className="min-h-screen bg-gray-50 p-4"><div className="mx-auto max-w-6xl"><div className="mb-6 flex items-center justify-between"><div><Link href="/" className="text-sm text-gray-500">← VibeSphere</Link><h1 className="text-3xl font-black">Moderation</h1><p className="text-gray-500">Review community reports.</p></div><span className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm">Moderator / Admin</span></div>{message && <div className="mb-4 rounded-xl border bg-white p-4 text-sm text-gray-600">{message}</div>}<div className="space-y-3">{reports.map(r => <article key={r.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase">{r.reason}</span><span className="ml-2 text-sm text-gray-500">{r.status}</span></div><time className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString()}</time></div><p className="mt-3 text-sm">{r.details || 'No additional details.'}</p><div className="mt-3 text-xs text-gray-500">User: {r.reported_user_id || '—'} · Post: {r.reported_post_id || '—'}</div>{r.status !== 'resolved' && r.status !== 'dismissed' && <div className="mt-4 flex gap-2"><button onClick={()=>void resolve(r.id,'reviewing')} className="rounded-lg border px-3 py-2 text-sm font-semibold">Review</button><button onClick={()=>void resolve(r.id,'resolved')} className="rounded-lg bg-[var(--brand)] px-3 py-2 text-sm font-semibold text-white">Resolve</button><button onClick={()=>void resolve(r.id,'dismissed')} className="rounded-lg border px-3 py-2 text-sm font-semibold">Dismiss</button></div>}</article>)}{!message && reports.length === 0 && <div className="rounded-2xl border bg-white p-8 text-center text-gray-500">No reports to review.</div>}</div></div></main>;
}
