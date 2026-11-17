import { requireUser } from "@/lib/auth";

// Server-side gate for every page in this group (in addition to the proxy).
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return children;
}
