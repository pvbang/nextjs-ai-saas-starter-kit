import Link from "next/link";
import { PLANS } from "@/lib/plans";

const FEATURES = [
  { icon: "🔐", title: "Passwordless Auth", body: "Auth.js v5 with email magic links + GitHub OAuth and database sessions via Prisma." },
  { icon: "💳", title: "Stripe Subscriptions", body: "Checkout, billing portal, and webhooks that keep subscription state in sync." },
  { icon: "🤖", title: "Streaming OpenAI", body: "A typed, rate-limited chat route streaming tokens straight to the UI." },
  { icon: "📊", title: "Usage Metering", body: "Per-user AI credit counting with a free-tier cap you can customize." },
  { icon: "🧱", title: "Typed End-to-End", body: "TypeScript, Zod request validation, and Prisma models — no any in sight." },
  { icon: "⚡", title: "App Router Ready", body: "Built on Next.js 16 App Router + Tailwind CSS 4. Deploy to Vercel in minutes." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-bold tracking-tight">▲ AI SaaS Starter</span>
        <div className="flex items-center gap-4 text-sm">
          <Link href="#pricing" className="text-slate-300 hover:text-white">Pricing</Link>
          <Link href="/login" className="rounded-lg bg-white px-4 py-2 font-medium text-slate-900 hover:bg-slate-200">Sign in</Link>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <span className="inline-block rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">Next.js 16 · Auth.js · Stripe · OpenAI</span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-6xl">Ship your AI SaaS in a weekend, not a quarter.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">A production-ready boilerplate with passwordless auth, Stripe subscriptions, usage metering, and a streaming OpenAI chat — wired together and typed end-to-end. Clone, set your keys, and launch.</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login" className="rounded-lg bg-indigo-500 px-6 py-3 font-semibold hover:bg-indigo-400">Get started free</Link>
          <Link href="#features" className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:border-slate-500">See what&apos;s inside</Link>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold">Simple pricing</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {Object.values(PLANS).map((plan) => (
            <div key={plan.name} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{plan.description}</p>
              <p className="mt-4 text-4xl font-bold">${plan.priceMonthly}<span className="text-base font-normal text-slate-400">/mo</span></p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                {plan.features.map((feat) => (<li key={feat}>✓ {feat}</li>))}
              </ul>
              <Link href="/login" className="mt-8 rounded-lg bg-indigo-500 px-4 py-2 text-center font-medium hover:bg-indigo-400">{plan.priceMonthly === 0 ? "Start free" : "Go Pro"}</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-500">Built with the AI SaaS Starter Kit · MIT licensed</footer>
    </main>
  );
}
