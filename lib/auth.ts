import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LOGIN_PATH } from "@/lib/config";

/**
 * Server-side session check. Every protected page, data loader and server
 * action calls this, so access never depends on the proxy alone.
 * Cached per request so parallel loaders verify the session once.
 */
export const requireUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) redirect(LOGIN_PATH);
  return { supabase, userId };
});
