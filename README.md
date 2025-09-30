# HOT HERBE Landing Page

A Next.js landing page for HOT HERBE, a Korean natural warming cream.

## Features

- Responsive design with Tailwind CSS
- Next.js Image optimization
- Interactive components (FAQ accordion, review voting)
- TypeScript support
- Optimized for performance

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - Reusable React components
- `/src/data` - Content data for the site
- `/public` - Static assets

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Next.js Image optimization

## Stripe Integration

This project includes a ready-to-use Stripe Checkout flow.

- Server route: `src/app/api/checkout/create-session/route.ts`
- Webhook handler: `src/app/api/webhooks/stripe/route.ts`
- Client button: `src/components/PricingCard.tsx`

### Setup

1) Configure environment variables (copy `.env.example` to `.env.local`):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET` (set after creating a webhook via Stripe CLI or Dashboard)
- Price ID 方式: `STRIPE_PRICE_30DAYS`, `STRIPE_PRICE_90DAYS`, `STRIPE_PRICE_180DAYS`
- もしくは Product ID 方式: `STRIPE_PRODUCT_30DAYS`, `STRIPE_PRODUCT_90DAYS`, `STRIPE_PRODUCT_180DAYS`（default_price を自動解決）
- `NEXT_PUBLIC_APP_URL` (e.g. `http://localhost:3000`)
- Supabase vars if you use the webhook persistence: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

2) Run the app:

```
npm run dev
```

3) Start a local webhook forwarder (Stripe CLI):

```
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will print a signing secret (starts with `whsec_`). Set it as `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart the dev server.

### How it works

- The client calls `/api/checkout/create-session` with a `productId` and gets a Checkout Session back.
- The user is redirected to Stripe Checkout (`session.url`).
- After a successful payment, Stripe sends events to `/api/webhooks/stripe` where orders are recorded in Supabase.

### Notes

- The Stripe SDK uses your account's default API version by default. If you need to pin a version, update `src/lib/stripe/server.ts`.
- CSP headers in `src/middleware.ts` already allow Stripe resources in development and production.
