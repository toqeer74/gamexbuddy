import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@15.12.0?target=deno";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_SIGNING_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

const sb = createClient(SB_URL, SB_KEY);
const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });

serve(async (req) => {
  const raw = await req.text();
  let evt: Stripe.Event;

  try {
    const sig = req.headers.get("stripe-signature")!;
    evt = stripe.webhooks.constructEvent(raw, sig, STRIPE_SIGNING_SECRET);
  } catch (_e) {
    return new Response("Bad signature", { status: 400 });
  }

  async function setPremiumByCustomer(customerId: string, status: "active" | "canceled") {
    const isActive = status === "active";
    await sb
      .from("profiles")
      .update({ is_premium: isActive, stripe_status: status })
      .eq("stripe_customer_id", customerId);
  }

  try {
    switch (evt.type) {
      case "checkout.session.completed": {
        const s = evt.data.object as Stripe.Checkout.Session;
        const customerId = String(s.customer);
        const userId = s.metadata?.user_id as string | undefined;
        if (userId) {
          await sb
            .from("profiles")
            .update({ stripe_customer_id: customerId, is_premium: true, stripe_status: "active" })
            .eq("id", userId);
        } else {
          await setPremiumByCustomer(customerId, "active");
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = evt.data.object as Stripe.Subscription;
        const status = sub.status === "active" || sub.status === "trialing" ? "active" : "canceled";
        await setPremiumByCustomer(String(sub.customer), status);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = evt.data.object as Stripe.Subscription;
        await setPremiumByCustomer(String(sub.customer), "canceled");
        break;
      }
      default:
        break;
    }
  } catch (_e) {
    return new Response("Hook error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
});
