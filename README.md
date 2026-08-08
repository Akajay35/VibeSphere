# VibeSphere

Creator-first social media platform built with Next.js, Supabase and Cloudflare Workers.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, RLS and Storage
- Cloudflare Workers via OpenNext

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`.

## Database

Run `supabase/migrations/0001_initial_schema.sql` and `supabase/migrations/0002_storage.sql` in Supabase SQL Editor.

## Deployment

```bash
npm run build
npm run deploy
```

The first deployment can use Cloudflare's `workers.dev` hostname. A custom domain can be added later.

## Product roadmap

1. Authentication and profiles
2. Feed and posts
3. Reels and video
4. Stories
5. Likes, comments, follows and subscriptions
6. Messaging and notifications
7. Search and explore
8. Creator analytics
9. Moderation/admin
10. PWA/mobile polish
