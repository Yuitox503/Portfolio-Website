"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-fetch server data when the tab becomes visible (e.g. timer changed on another device). */
export function RefreshOnFocus() {
  const router = useRouter();
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [router]);
  return null;
}
