"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    const next: Message[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        assistant += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: assistant };
          return copy;
        });
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-4 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">Ask anything — responses stream in real time from OpenAI.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span className={`inline-block max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-100"}`}>
              {m.content || "…"}
            </span>
          </div>
        ))}
      </div>
      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      <form onSubmit={send} className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…" className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-indigo-500" />
        <button type="submit" disabled={loading} className="rounded-lg bg-indigo-500 px-5 py-2 font-medium hover:bg-indigo-400 disabled:opacity-50">{loading ? "…" : "Send"}</button>
      </form>
    </div>
  );
}
