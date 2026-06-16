import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { Chat } from "./chat";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isPro =
    !!session.user.stripeCurrentPeriodEnd &&
    new Date(session.user.stripeCurrentPeriodEnd).getTime() > Date.now();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <div>
          <p className="text-sm text-slate-400">Signed in as</p>
          <p className="font-medium">{session.user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs ${isPro ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700/50 text-slate-300"}`}>{isPro ? "Pro" : "Free"}</span>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
            <button className="text-sm text-slate-400 hover:text-white">Sign out</button>
          </form>
        </div>
      </header>
      <section className="mx-auto max-w-3xl px-6 pb-16"><Chat /></section>
    </main>
  );
}
