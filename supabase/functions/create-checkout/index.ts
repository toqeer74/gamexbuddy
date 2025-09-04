// Deno / Supabase Edge Function
// POST body: { user_id: string, email?: string }
// Returns: { url: string }

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@15.12.0?target=deno";

const SB_URL  = Deno.env.get("SUPABASE_URL")!;
const SB_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PRICE   = Deno.env.get("STRIPE_PRICE_ID")!; // e.g. price_123
const SUCCESS = Deno.env.get("STRIPE_SUCCESS_URL")!; // e.g. https://gamexbuddy.com/plus/success
const CANCEL  = Deno.env.get("STRIPE_CANCEL_URL")!;  // e.g. https://gamexbuddy.com/plus
const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;

const sb = createClient(SB_URL, SB_KEY);
const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { user_id, email } = await req.json();

    if (!user_id) return new Response("Missing user_id", { status: 400 });

    // 1) Get existing profile (to reuse customer)
    const { data: prof, error } = await sb
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user_id)
      .single();

    if (error) throw error;

    // 2) Ensure we have a Stripe customer
    let customerId = (prof?.stripe_customer_id as string | null) || null;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email || undefined,
        metadata: { user_id },
      });
      customerId = customer.id;
      await sb.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user_id);
    }

    // 3) Create Checkout Session (subscription mode)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId!,
      line_items: [{ price: PRICE, quantity: 1 }],
      success_url: SUCCESS + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: CANCEL,
      allow_promotion_codes: true,
      metadata: { user_id },
      subscription_data: { metadata: { user_id } },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Checkout error", { status: 500 });
  }
});

