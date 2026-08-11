# VibeSphere — clean rebuild

VibeSphere is a lightweight Next.js social starter designed for Cloudflare Workers with OpenNext.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run typecheck
npm run build
```

## Cloudflare deployment

The GitHub Actions workflow requires these repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

The Cloudflare token must be scoped to the account that owns the `vibesphere` Worker and have permission to edit Workers scripts.

The workflow intentionally verifies the token and account access before installing/building/deploying so a credential problem fails early with a useful message.
