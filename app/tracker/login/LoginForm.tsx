"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="label">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="field"
        />
      </label>
      <label className="block">
        <span className="label">Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-2xl bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
