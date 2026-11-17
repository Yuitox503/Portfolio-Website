import Link from "next/link";
import { signOut } from "../../actions";

export function Header({ active }: { active: "dashboard" | "entries" }) {
  const tab = (on: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm ${on ? "bg-surface2 text-text" : "text-muted"}`;
  return (
    <header className="flex items-center gap-2 py-4">
      <Link href="/tracker" className="mr-auto font-display text-xl font-bold">
        Tracker
      </Link>
      <Link href="/tracker" className={tab(active === "dashboard")}>
        Week
      </Link>
      <Link href="/tracker/entries" className={tab(active === "entries")}>
        Entries
      </Link>
      <form action={signOut}>
        <button type="submit" className="rounded-lg px-3 py-1.5 text-sm text-muted">
          Sign out
        </button>
      </form>
    </header>
  );
}
