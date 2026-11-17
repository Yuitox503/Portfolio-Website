import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "./env";
import { LOGIN_PATH } from "@/lib/config";

/** Refreshes the Supabase session cookie and gates /tracker routes. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, key } = supabaseEnv();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // getClaims() verifies the JWT; never trust an unverified session here.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims?.sub);
  const isLoginPage = request.nextUrl.pathname === LOGIN_PATH;

  const redirectTo = (path: string) => {
    const target = NextResponse.redirect(new URL(path, request.url));
    // Carry over any refreshed auth cookies.
    response.cookies.getAll().forEach((c) => target.cookies.set(c));
    return target;
  };

  if (!isLoggedIn && !isLoginPage) return redirectTo(LOGIN_PATH);
  if (isLoggedIn && isLoginPage) return redirectTo("/tracker");

  return response;
}
