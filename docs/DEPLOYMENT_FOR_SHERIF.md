# Chairman AI Platform — Deployment Guide

This document is for Sherif (or whoever is deploying the platform for the first time).
Follow these steps in order. Do not skip steps.

---

## Prerequisites

- Node.js 20+
- npm 10+
- A Supabase project (new or existing)
- A Stripe account with test mode active
- An OpenRouter account with credits
- Vercel account (or any platform that supports Next.js)
- Domain access for: ai.chairmans.uk, app.ai.chairmans.uk, api.ai.chairmans.uk, status.ai.chairmans.uk

---

## Step 1: Clone and install dependencies

```bash
git clone <repo-url>
cd chairman-ai-platform
npm install
```

Verify Turborepo is working:
```bash
npm run typecheck
```

---

## Step 2: Set up Supabase

1. Go to https://supabase.com and create a new project (or use an existing one).
2. Note the following — you will need them in later steps:
   - Project URL (e.g. `https://abcdefgh.supabase.co`)
   - Anon key (safe for browser use)
   - Service role key (NEVER put this in frontend code or git)

3. Run all migrations in order. In the Supabase dashboard, go to SQL Editor and run:

```
supabase/migrations/001_create_profiles.sql
supabase/migrations/002_create_subscriptions.sql
supabase/migrations/003_create_usage.sql
supabase/migrations/004_create_engine_registry.sql
supabase/migrations/005_create_site_connectors.sql
supabase/migrations/006_create_billing_events.sql
```

Run them one at a time, in order. Verify each completes without error before continuing.

4. Enable Email Auth in Supabase:
   - Go to Authentication > Providers > Email
   - Enable "Confirm email" for production
   - Set redirect URL to: `https://app.ai.chairmans.uk`

---

## Step 3: Set up Stripe

1. Log in to https://dashboard.stripe.com
2. Create two Products:
   - "Chairman Private" — $10.00/month recurring
   - "Chairman Executive" — $50.00/month recurring
3. For each product, create a Monthly Price. Note the Price IDs (format: `price_...`).
4. Create a Stripe Webhook pointing to: `https://api.ai.chairmans.uk/v1/webhooks/stripe`
   - Events to send: `checkout.session.completed`, `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`,
     `invoice.paid`, `invoice.payment_failed`
5. Note the Webhook Signing Secret (format: `whsec_...`).

---

## Step 4: Set up OpenRouter

1. Go to https://openrouter.ai
2. Create an account and top up credits.
3. Generate an API key.
4. Note: the only model currently enabled in the engine registry is
   `qwen/qwen3-30b-a3b-instruct-2507` for Business Intelligence.
   All other engines are disabled until you enable them in the Engine Control page.

---

## Step 5: Configure environment variables for apps/api

Create `apps/api/.env.local`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_CHAIRMAN_PRIVATE_MONTHLY=price_...
STRIPE_PRICE_CHAIRMAN_EXECUTIVE_MONTHLY=price_...

NEXT_PUBLIC_APP_URL=https://app.ai.chairmans.uk
NEXT_PUBLIC_API_URL=https://api.ai.chairmans.uk
```

---

## Step 6: Configure environment variables for apps/web-app

Create `apps/web-app/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_API_URL=https://api.ai.chairmans.uk
NEXT_PUBLIC_APP_URL=https://app.ai.chairmans.uk
```

Note: No secrets here. Only public values.

---

## Step 7: Configure apps/marketing (no secrets needed)

Create `apps/marketing/.env.local`:

```
NEXT_PUBLIC_APP_URL=https://app.ai.chairmans.uk
```

---

## Step 8: Configure apps/status

Create `apps/status/.env.local`:

```
INTERNAL_API_URL=https://api.ai.chairmans.uk
INTERNAL_MARKETING_URL=https://ai.chairmans.uk
INTERNAL_APP_URL=https://app.ai.chairmans.uk
```

---

## Step 9: Deploy to Vercel (or equivalent)

Deploy each app separately on Vercel:

1. **api** → connect to `apps/api`, set root directory to `apps/api`, domain: `api.ai.chairmans.uk`
2. **web-app** → connect to `apps/web-app`, root directory `apps/web-app`, domain: `app.ai.chairmans.uk`
3. **marketing** → connect to `apps/marketing`, root directory `apps/marketing`, domain: `ai.chairmans.uk`
4. **status** → connect to `apps/status`, root directory `apps/status`, domain: `status.ai.chairmans.uk`

For each deployment, add the environment variables from the corresponding `.env.local` in the Vercel dashboard.
**Do not commit `.env.local` files to git.**

---

## Step 10: Verify the API health endpoint

Once `api` is deployed, visit:
```
https://api.ai.chairmans.uk/health
```

Expected response:
```json
{ "status": "ok", "service": "chairman-ai-api", "timestamp": "..." }
```

If this fails, check Vercel function logs.

---

## Step 11: Create the first owner account

1. Sign up at `https://app.ai.chairmans.uk/signup`
2. Verify your email
3. In the Supabase dashboard, go to Table Editor > profiles
4. Find your user row and change `role` from `user` to `owner`
5. Sign out and sign back in
6. You now have access to the Owner section (Engine Control, Site Connections)

---

## Step 12: Activate the Business Intelligence engine

1. Go to `https://app.ai.chairmans.uk/owner/engines`
2. Find "Business Intelligence Standard"
3. Verify the model ID is `qwen/qwen3-30b-a3b-instruct-2507`
4. Click Enable
5. Subscribe to a plan (or do so via Stripe test mode)
6. Test a Business Intelligence query in the Intelligence page

---

## Post-deployment checklist

- [ ] Health endpoint returns 200
- [ ] Marketing site loads at ai.chairmans.uk
- [ ] Web app loads at app.ai.chairmans.uk
- [ ] Status page shows real checks at status.ai.chairmans.uk
- [ ] Sign up flow works with email confirmation
- [ ] Stripe test checkout works (use card 4242 4242 4242 4242)
- [ ] Stripe webhook receives events (check Stripe dashboard > Webhooks)
- [ ] Subscription is created in Supabase after checkout
- [ ] Business Intelligence mode works end to end
- [ ] Owner role can access engine control and site connections

---

## Site connectors (Quicky CV and El Arab Club)

To activate the Quicky CV or El Arab Club integrations:

1. Go to Owner > Site Connections and set the site status to "active"
2. In the Supabase dashboard, insert a row into `site_api_keys`:
   - Generate a random key (e.g. `openssl rand -hex 32`)
   - Take the first 8 characters as `key_prefix`
   - Hash the full key with SHA-256 for `key_hash`
   - Set `status` to `active`
3. Provide the full key to the Quicky CV or El Arab Club backend team
4. They configure it as `CHAIRMAN_SITE_KEY` in their environment
5. They import `@chairman/client` (from this monorepo or a published copy)

---

## Notes

- The OPENROUTER_API_KEY must NEVER be in any frontend app or package/chairman-client.
- The SUPABASE_SERVICE_ROLE_KEY must NEVER be in any frontend app.
- STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must NEVER be in any frontend app.
- All secrets are in apps/api only.
- Board Review will show as locked for chairman_private users — this is correct behaviour.
- Extended, Strategic, Executive, and Board engines are disabled by default.
  Enable them only after you have selected and approved a model for each.
