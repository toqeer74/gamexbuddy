import { supabase } from "@/lib/supabaseClient";
import { publishPoints } from "@/lib/points-bus";

export async function getPointsBalance() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { balance: 0 };
  const { data, error } = await supabase
    .from("points_ledger")
    .select("delta_points")
    .eq("user_id", user.id);
  if (error) throw error;
  const balance = (data ?? []).reduce((s, r: any) => s + (r?.delta_points ?? 0), 0);
  return { balance };
}

export async function getRecentPoints(limit = 10) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [] as any[];
  const { data, error } = await supabase
    .from("points_ledger")
    .select("event_type,event_ref,delta_points,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as any[];
}

export async function refreshAndPublishBalance() {
  const { balance } = await getPointsBalance();
  publishPoints(balance);
  return balance;
}

export async function awardPointsClient(eventType: string, eventRef: string | null, delta = 10) {
  const { error } = await supabase.rpc("award_points", {
    p_event_type: eventType,
    p_event_ref: eventRef,
    p_delta: delta,
  });
  if (error) throw error;
}

export async function awardPointsAndRefresh(eventType: string, eventRef: string | null, delta = 10) {
  await awardPointsClient(eventType, eventRef, delta);
  await refreshAndPublishBalance();
}
