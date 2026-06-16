export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-100">
      <div className="max-w-sm rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <div className="text-3xl">📬</div>
        <h1 className="mt-3 text-xl font-bold">Check your inbox</h1>
        <p className="mt-2 text-sm text-slate-400">We sent you a magic link. Click it to finish signing in.</p>
      </div>
    </main>
  );
}
