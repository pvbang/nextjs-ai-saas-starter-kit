# 🚀 Next.js AI SaaS Starter Kit

> Ship your AI SaaS in a weekend, not a quarter. Production-grade boilerplate with **passwordless auth + Stripe subscriptions + OpenAI chat**, built on Next.js 16, TypeScript, Tailwind v4 and Prisma.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Stripe](https://img.shields.io/badge/Stripe-Subscriptions-635bff) ![License](https://img.shields.io/badge/license-Commercial-green)

### [⬇️ Buy for $29](https://paypal.me/pvbang001)

**[⬇️ Buy for $29 →](https://paypal.me/pvbang001)** — one-time payment, instant access. Pay securely via PayPal (guest checkout & card accepted, no account required). After payment, email `phanvanbang.dev@gmail.com` with your receipt to receive the commercial license + full source.

---

## 💰 Get the kit — $29 commercial license

**[⬇️ Download v1.0.0 (full zip)](https://github.com/pvbang/nextjs-ai-saas-starter-kit/releases/download/v1.0.0/nextjs-ai-saas-starter-kit.zip)** · **[📦 Release page](https://github.com/pvbang/nextjs-ai-saas-starter-kit/releases/tag/v1.0.0)**

One-time **$29** — build & ship unlimited products on a single team. Lifetime updates to v1.x.
Prefer Gumroad checkout? A hosted listing is being finalized; the GitHub release above is the canonical download.

---


## ✨ What's inside

Everything wired together and **building green** out of the box:

| Feature | Detail |
|---|---|
| 🔐 **Authentication** | Auth.js (NextAuth v5) — passwordless email magic-link **+** optional GitHub OAuth. Database sessions via Prisma adapter. |
| 💳 **Billing** | Stripe Checkout for subscriptions, Customer Billing Portal, and a hardened webhook that syncs subscription state to your DB. |
| 🤖 **AI** | OpenAI chat wrapper with a typed, validated (`zod`) API route, per-user free-credit metering, and easy model switching. |
| 🗄️ **Database** | Prisma ORM. Ships with **zero-config SQLite** so `npm run dev` works instantly — swap to Postgres in one line for production. |
| 🎨 **UI** | Tailwind CSS v4, dark-mode aware landing page, login flow, and an authenticated dashboard with a working chat component. |
| 🧱 **Architecture** | App Router, server components, lazy-initialised SDK clients (builds without secrets), strict TypeScript, clean `src/lib` separation. |

10 routes, fully typed, `next build` passes with **0 errors**.

---

## 🏁 Quick start (3 minutes)

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
#   → set DATABASE_URL (SQLite default works out of the box)
#   → add OPENAI_API_KEY, STRIPE_SECRET_KEY, EMAIL_SERVER when ready

# 3. Create the database
npx prisma db push

# 4. Run
npm run dev
```

Open <http://localhost:3000> — you'll see the landing page. Click **Sign in**, enter an email, and you're in.

---

## 🔧 Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Prisma connection string (SQLite default: `file:./dev.db`). |
| `AUTH_SECRET` | Auth.js session secret (`openssl rand -base64 32`). |
| `EMAIL_SERVER` / `EMAIL_FROM` | SMTP for magic-link emails. |
| `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET` | Optional GitHub OAuth. |
| `OPENAI_API_KEY` | OpenAI API key for the chat route. |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe billing. |
| `STRIPE_PRICE_ID` | Your Pro plan price ID. |
| `NEXT_PUBLIC_APP_URL` | Public base URL for redirects/webhooks. |

See `.env.example` for the full template.

---

## 📂 Project structure

```
src/
├── app/
│   ├── page.tsx                      # Landing page
│   ├── login/                        # Passwordless sign-in + verify
│   ├── dashboard/                    # Authed dashboard + AI chat
│   └── api/
│       ├── auth/[...nextauth]/       # Auth.js handler
│       ├── chat/                     # OpenAI chat (zod-validated, metered)
│       └── stripe/
│           ├── checkout/             # Checkout + billing portal
│           └── webhook/              # Subscription sync
├── lib/
│   ├── auth.ts    prisma.ts          # Auth + DB clients
│   ├── stripe.ts  openai.ts          # Lazy SDK clients
│   └── plans.ts                      # Pricing plan definitions
└── types/next-auth.d.ts              # Session type augmentation
prisma/schema.prisma                  # User / Account / Session / Subscription
```

---

## 🚢 Deploy

Works on **Vercel** out of the box. Push to GitHub → import → add env vars → deploy.
For the Stripe webhook, point `https://yourdomain/api/stripe/webhook` at your Stripe dashboard and set `STRIPE_WEBHOOK_SECRET`.

For production, switch Prisma's datasource `provider` to `postgresql` and update `DATABASE_URL`.

---

## 🧭 What to customise first

1. **Branding** — `src/app/page.tsx` (landing) and `layout.tsx` (metadata).
2. **Pricing** — `src/lib/plans.ts` and your Stripe price IDs.
3. **AI behaviour** — system prompt, model and credit limit in `src/lib/openai.ts` + `src/app/api/chat/route.ts`.

---

## 📝 License

Commercial single-team license — **[⬇️ Buy for $29](https://paypal.me/pvbang001)**. Build and ship unlimited products; do not resell or redistribute the kit itself.

---

**Built for indie hackers who want to skip the plumbing and start charging.**
