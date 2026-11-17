import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

// Only the tracker runs through auth. The public portfolio is untouched.
export const config = {
  matcher: ["/tracker", "/tracker/:path*"],
};
