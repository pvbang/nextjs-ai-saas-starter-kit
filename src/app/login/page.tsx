import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="mt-1 text-sm text-slate-400">Use a magic link — no password required.</p>
        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", { email: formData.get("email") as string, redirectTo: "/dashboard" });
          }}
          className="mt-6 space-y-3"
        >
          <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-indigo-500" />
          <button type="submit" className="w-full rounded-lg bg-indigo-500 px-4 py-2 font-medium hover:bg-indigo-400">Send magic link</button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/dashboard" });
          }}
          className="mt-3"
        >
          <button type="submit" className="w-full rounded-lg border border-slate-700 px-4 py-2 font-medium hover:border-slate-500">Continue with GitHub</button>
        </form>
      </div>
    </main>
  );
}
