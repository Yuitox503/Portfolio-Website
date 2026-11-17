import { BackToSite } from "../BackToSite";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="eyebrow">Private</p>
          <h1 className="mt-2 font-serif text-5xl italic">Tracker</h1>
          <p className="mt-2 text-sm text-muted">Small steps, every week.</p>
        </div>
        <div className="card p-6">
          <LoginForm />
        </div>
        <div className="mt-6 text-center">
          <BackToSite label="Back to main site" />
        </div>
      </div>
    </main>
  );
}
