import { requireUser } from "@/lib/auth";
import { Nav } from "./_components/Nav";
import { RefreshOnFocus } from "./_components/RefreshOnFocus";

// Server-side gate for every page in this group (in addition to the proxy).
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <>
      <RefreshOnFocus />
      <Nav />
      <div className="mx-auto max-w-2xl px-4 pb-32 sm:px-6 sm:pb-16">{children}</div>
    </>
  );
}
