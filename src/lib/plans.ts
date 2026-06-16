/** Subscription plan definitions. Wire the priceId to your Stripe dashboard. */
export interface Plan {
  name: string;
  description: string;
  priceMonthly: number;
  priceId: string | undefined;
  features: string[];
  credits: number | "unlimited";
}

export const PLANS: Record<"free" | "pro", Plan> = {
  free: {
    name: "Free",
    description: "Kick the tires. No card required.",
    priceMonthly: 0,
    priceId: undefined,
    credits: 20,
    features: ["20 AI messages / month", "GPT-4o-mini", "Community support"],
  },
  pro: {
    name: "Pro",
    description: "For builders shipping real products.",
    priceMonthly: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    credits: "unlimited",
    features: [
      "Unlimited AI messages",
      "GPT-4o + streaming",
      "Priority support",
      "Stripe billing portal",
    ],
  },
};
