"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BackToSite } from "../../BackToSite";
import { BookIcon, ListIcon, SlidersIcon, SunIcon } from "./icons";

const ITEMS = [
  { href: "/tracker", label: "Week", Icon: SunIcon, match: (p: string) => p === "/tracker" },
  { href: "/tracker/log", label: "Log", Icon: ListIcon, match: (p: string) => p.startsWith("/tracker/log") },
  { href: "/tracker/reviews", label: "Reviews", Icon: BookIcon, match: (p: string) => p.startsWith("/tracker/reviews") },
  { href: "/tracker/settings", label: "Settings", Icon: SlidersIcon, match: (p: string) => p.startsWith("/tracker/settings") },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop / tablet: top bar */}
      <header className="mx-auto hidden max-w-2xl items-center gap-1 px-6 pt-6 sm:flex">
        <BackToSite label="" className="-ml-1 pr-1" />
        <span className="mx-2 h-5 w-px bg-line-strong" aria-hidden />
        <Link href="/tracker" className="mr-auto font-serif text-2xl italic text-text">
          Tracker
        </Link>
        {ITEMS.map(({ href, label, match }) => {
          const on = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition ${on ? "bg-surface2 text-text ring-1 ring-line" : "text-muted hover:text-text2"}`}
            >
              {label}
            </Link>
          );
        })}
      </header>

      {/* Phone: slim top strip with the way back to the portfolio */}
      <div className="mx-auto flex max-w-2xl items-center justify-between px-3 pt-3 sm:hidden">
        <BackToSite />
        <span className="pr-1 font-serif text-lg italic text-muted">Tracker</span>
      </div>

      {/* Phone: bottom tab bar, within thumb reach */}
      <nav
        aria-label="Tracker"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/85 backdrop-blur-xl sm:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-4">
          {ITEMS.map(({ href, label, Icon, match }) => {
            const on = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={on ? "page" : undefined}
                  className={`flex flex-col items-center gap-1 pb-2.5 pt-3 text-[11px] font-medium transition ${on ? "text-amber" : "text-muted"}`}
                >
                  <Icon width={22} height={22} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
