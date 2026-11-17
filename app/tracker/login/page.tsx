import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6">
        <h1 className="font-display text-2xl font-bold">Tracker</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Private. Sign in to continue.</p>
        <LoginForm />
      </div>
    </main>
  );
}
