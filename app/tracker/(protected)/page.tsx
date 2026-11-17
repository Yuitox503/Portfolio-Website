import { requireUser } from "@/lib/auth";

export default async function TrackerPage() {
  await requireUser();
  return <main className="p-4">Signed in.</main>;
}
