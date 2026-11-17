import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "@/lib/config";

/**
 * Server-side session check. Every protected page and server action calls this,
 * so access never depends on the proxy alone.
 */
export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect(LOGIN_PATH);
  return { supabase, userId };
}
