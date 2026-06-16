import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getOpenAI, DEFAULT_MODEL, FREE_CREDIT_LIMIT } from "@/lib/openai";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["system", "user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(50),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { aiCreditsUsed: true, stripeCurrentPeriodEnd: true },
  });

  const isPro =
    !!user?.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() > Date.now();

  if (!isPro && (user?.aiCreditsUsed ?? 0) >= FREE_CREDIT_LIMIT) {
    return NextResponse.json(
      { error: "Free credit limit reached. Upgrade to Pro." },
      { status: 402 }
    );
  }

  const completion = await getOpenAI().chat.completions.create({
    model: DEFAULT_MODEL,
    stream: true,
    messages: parsed.data.messages,
  });

  if (!isPro) {
    prisma.user
      .update({
        where: { id: session.user.id },
        data: { aiCreditsUsed: { increment: 1 } },
      })
      .catch(() => {});
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content ?? "";
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(
          encoder.encode(`\n[stream error] ${(err as Error).message}`)
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
