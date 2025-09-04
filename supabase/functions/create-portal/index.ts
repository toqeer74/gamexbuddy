import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import Stripe from "https://esm.sh/stripe@15.12.0?target=deno";

const SB_URL  = Deno.env.get("SUPABASE_URL")!;
const SB_KEY  = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const STRIPE_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const RETURN_URL = Deno.env.get("STRIPE_PORTAL_RETURN_URL")!; // e.g. https://gamexbuddy.com/settings

const sb = createClient(SB_URL, SB_KEY);
const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
  try {
    const { user_id } = await req.json();
    if (!user_id) return new Response("Missing user_id", { status: 400 });

    const { data: prof, error } = await sb.from("profiles")
      .select("stripe_customer_id")
      .eq("id", user_id)
      .single();

    if (error || !prof?.stripe_customer_id) {
      return new Response("No customer", { status: 400 });
    }

    const portal = await stripe.billingPortal.sessions.create({
      customer: prof.stripe_customer_id as string,
      return_url: RETURN_URL,
    });

    return new Response(JSON.stringify({ url: portal.url }), {
      headers: { "content-type":"application/json" },
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response("Portal error", { status: 500 });
  }
});

