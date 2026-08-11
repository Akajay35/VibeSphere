# VibeSphere

A clean Next.js social starter rebuilt for reliable Cloudflare Workers deployment with OpenNext.

## Stack

- Next.js 16
- React 19
- TypeScript
- OpenNext for Cloudflare Workers
- Supabase client ready for future data/auth integration

## Local

```bash
npm install
npm run dev
```

Verify production readiness:

```bash
npm run typecheck
npm run build
```

## GitHub Actions → Cloudflare

Required repository secrets:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

The workflow now checks Cloudflare in two stages before building:

1. Token verification
2. Access to the configured Cloudflare account

If stage 2 fails, the workflow explicitly reports the likely cause: wrong account ID, token account scope, or missing Workers Scripts Edit/Write permission.

The Cloudflare account ID must be the 32-character ID of the account that owns the `vibesphere` Worker.
