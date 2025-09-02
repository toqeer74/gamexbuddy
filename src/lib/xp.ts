import { supabase } from "@/lib/supabaseClient";

export async function addXp(amount: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // not signed in
    await supabase.rpc('increment_xp', { user_id: user.id, add: amount });
  } catch {}
}
