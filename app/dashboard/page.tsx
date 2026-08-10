"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function DashboardPage(){const [status,setStatus]=useState('Checking configuration…');useEffect(()=>{try{const client=createClient();client.auth.getUser().then(({data,error})=>setStatus(error?'Supabase connected · signed out':'Supabase connected · '+(data.user?.email||'signed out'))).catch(()=>setStatus('Supabase configured · signed out'));}catch{setStatus('Supabase is not configured yet · app remains usable')}} ,[]);return <main className="shell"><nav><strong>VibeSphere</strong><div className="navlinks"><Link href="/">Home</Link><Link href="/explore">Explore</Link></div></nav><section className="hero"><span className="pill">Dashboard</span><h1>Your sphere.</h1><p>{status}</p><div className="cards"><article><h2>Profile</h2><p>Your creator profile will appear here.</p></article><article><h2>Content</h2><p>Stories and reels management will appear here.</p></article><article><h2>Community</h2><p>Messages and notifications will appear here.</p></article></div></section></main>}
