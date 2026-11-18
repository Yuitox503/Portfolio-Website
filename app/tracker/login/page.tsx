import { BackToSite } from "../BackToSite";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">Tracker</h1>
          <p className="mt-3 inline-flex items-center rounded-full bg-surface2 px-3 py-1 text-xs font-medium text-muted ring-1 ring-line">
            Private
          </p>
          <p className="mt-3 text-sm text-muted">Small steps, every week.</p>
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
