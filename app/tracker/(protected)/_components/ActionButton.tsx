"use client";

import { useTransition } from "react";
import type { ActionResult } from "../actions";

type Props = {
  action: () => Promise<ActionResult>;
  label: string;
  confirmText?: string;
  className?: string;
};

/** A button that runs a bound server action, optionally after a confirm(). */
export function ActionButton({ action, label, confirmText, className }: Props) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        startTransition(async () => {
          const res = await action();
          if (!res.ok) window.alert(res.error);
        });
      }}
      className={className ?? "min-h-10 rounded-lg px-3 text-sm font-medium text-muted transition hover:text-danger disabled:opacity-50"}
    >
      {pending ? "…" : label}
    </button>
  );
}
