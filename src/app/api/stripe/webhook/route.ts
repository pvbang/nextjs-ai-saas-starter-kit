import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object as Stripe.Checkout.Session;
      const subscription = await getStripe().subscriptions.retrieve(
        cs.subscription as string
      );
      const userId = cs.metadata?.userId;
      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.items.data[0].current_period_end * 1000
            ),
          },
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          stripePriceId: sub.items.data[0]?.price.id,
          stripeCurrentPeriodEnd: new Date(
            sub.items.data[0].current_period_end * 1000
          ),
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await prisma.user.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
