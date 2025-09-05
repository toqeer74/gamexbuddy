import { supabase } from "@/lib/supabaseClient";

export async function requireEditor() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: "unauth" as const };
  const { data, error } = await supabase
    .from("profiles")
    .select("is_editor")
    .eq("id", user.id)
    .single();
  if (error) return { ok: false, reason: "error" as const, error } as const;
  return data?.is_editor ? { ok: true as const } : { ok: false as const, reason: "forbidden" as const };
}

