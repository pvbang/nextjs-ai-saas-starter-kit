import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, absoluteUrl } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, stripeSubscriptionId: true },
  });

  const billingUrl = absoluteUrl("/dashboard/billing");

  if (user?.stripeCustomerId && user.stripeSubscriptionId) {
    const portal = await getStripe().billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: billingUrl,
    });
    return NextResponse.json({ url: portal.url });
  }

  const priceId = PLANS.pro.priceId;
  if (!priceId) {
    return NextResponse.json(
      { error: "Pro price ID not configured" },
      { status: 500 }
    );
  }

  const checkout = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${billingUrl}?success=true`,
    cancel_url: `${billingUrl}?canceled=true`,
    metadata: { userId: session.user.id },
    subscription_data: { metadata: { userId: session.user.id } },
  });

  return NextResponse.json({ url: checkout.url });
}
