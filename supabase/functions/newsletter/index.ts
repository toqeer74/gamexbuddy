import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const ORIGIN = Deno.env.get("PUBLIC_SITE_ORIGIN") || "https://gamexbuddy.netlify.app";
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(SB_URL, SB_KEY);

// SendGrid configuration
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY")!;
const SENDGRID_TEMPLATE_CONFIRM = Deno.env.get("SENDGRID_TEMPLATE_CONFIRM")!;
const SENDGRID_FROM_EMAIL = Deno.env.get("SENDGRID_FROM_EMAIL")!;
const SENDGRID_FROM_NAME = Deno.env.get("SENDGRID_FROM_NAME") || "GameXBuddy";
const SENDGRID_LINK_DOMAIN = Deno.env.get("SENDGRID_LINK_DOMAIN"); // optional

async function sendConfirmEmail(email: string, confirmUrl: string) {
  const payload = {
    from: { email: SENDGRID_FROM_EMAIL, name: SENDGRID_FROM_NAME },
    personalizations: [
      {
        to: [{ email }],
        dynamic_template_data: {
          confirm_url: confirmUrl,
          brand_color: "#ff2bd6", // GameXBuddy neon magenta
          site_name: "GameXBuddy"
        }
      }
    ],
    template_id: SENDGRID_TEMPLATE_CONFIRM,
    // optional custom args / asm groups here
    ...(SENDGRID_LINK_DOMAIN ? {
      tracking_settings: { click_tracking: { enable: true, enable_text: false } },
      mail_settings: { sandbox_mode: { enable: false } }
    } : {})
  };

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("SendGrid error:", res.status, text);
    throw new Error("sendgrid_failed");
  }
}

serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname.endsWith("/subscribe")) {
    try {
      const { email } = await req.json();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        return new Response(JSON.stringify({ error: "bad_email" }), { status: 400 });
      }
      const token = crypto.randomUUID().replace(/-/g, "");
      const { error } = await sb.from("newsletter_subscribers").upsert(
        { email, confirm_token: token, confirmed: false, confirmed_at: null },
        { onConflict: "email" }
      );
      if (error) throw error;
      const confirmUrl = `${ORIGIN}/api/newsletter/confirm?token=${token}&email=${encodeURIComponent(email)}`;

      // Send confirmation email via SendGrid
      try {
        await sendConfirmEmail(email, confirmUrl);
        return new Response(JSON.stringify({ ok: true, sent: true }), {
          headers: { "content-type": "application/json" }
        });
      } catch (e) {
        console.error("Email send failed:", e);
        // Still return success to avoid exposing email issues
        return new Response(JSON.stringify({ ok: true, sent: false }), {
          headers: { "content-type": "application/json" }
        });
      }
    } catch (_e) {
      return new Response(JSON.stringify({ error: "server" }), { status: 500 });
    }
  }

  if (req.method === "GET" && url.pathname.endsWith("/confirm")) {
    const token = url.searchParams.get("token");
    const email = url.searchParams.get("email");
    if (!token || !email) return new Response("Invalid link", { status: 400 });
    const { data, error } = await sb
      .from("newsletter_subscribers")
      .update({ confirmed: true, confirmed_at: new Date().toISOString() })
      .eq("email", email)
      .eq("confirm_token", token)
      .select()
      .single();
    if (error || !data) return new Response("Invalid or expired link", { status: 400 });
    return new Response("Thanks! You're subscribed to GameXBuddy!", { headers: { "content-type": "text/plain" } });
  }

  return new Response("Not found", { status: 404 });
});

