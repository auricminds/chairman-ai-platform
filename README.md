# Chairman AI Platform

This is the monorepo for the Chairman AI cloud platform.

## Apps

| App | Domain | Port | Description |
|-----|--------|------|-------------|
| `apps/marketing` | ai.chairmans.uk | 3000 | Marketing site |
| `apps/web-app` | app.ai.chairmans.uk | 3001 | Customer application |
| `apps/api` | api.ai.chairmans.uk | 3002 | API server |
| `apps/status` | status.ai.chairmans.uk | 3003 | Status page |

## Packages

| Package | Purpose |
|---------|---------|
| `packages/contracts` | Shared TypeScript types and Zod schemas |
| `packages/chairman-client` | Server-side site connector SDK |
| `packages/chairman-ui` | Shared UI components |

## Quick start

```bash
npm install

# All apps
npm run dev

# Individual apps
npm run dev:marketing
npm run dev:web
npm run dev:api
npm run dev:status
```

## Deployment

See `docs/DEPLOYMENT_FOR_SHERIF.md` for full step-by-step deployment instructions.

## Security notes

- `OPENROUTER_API_KEY` — apps/api only. Never frontend.
- `SUPABASE_SERVICE_ROLE_KEY` — apps/api only. Never frontend.
- `STRIPE_SECRET_KEY` — apps/api only. Never frontend.
- `STRIPE_WEBHOOK_SECRET` — apps/api only. Never frontend.
- The frontend never sends model IDs — only `chairmanMode` strings.
- Board Review is locked for `chairman_private` users.
