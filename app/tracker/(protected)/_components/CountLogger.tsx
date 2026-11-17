"use client";

import { useRef, useState, useTransition } from "react";
import { logCount } from "../actions";

export function CountLogger({ categoryId, placeholder }: { categoryId: string; placeholder: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="mt-3 flex flex-wrap gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const note = inputRef.current?.value ?? "";
        startTransition(async () => {
          const res = await logCount(categoryId, note);
          if (res.ok) {
            if (inputRef.current) inputRef.current.value = "";
            setError(null);
          } else setError(res.error);
        });
      }}
    >
      <input
        ref={inputRef}
        name="note"
        placeholder={placeholder}
        maxLength={500}
        aria-label="Note (optional)"
        className="min-w-0 flex-1 rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base outline-none placeholder:text-dim focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="min-w-16 rounded-xl bg-accent px-4 py-2.5 font-display text-lg font-bold text-bg active:scale-95 disabled:opacity-60"
      >
        {pending ? "…" : "+1"}
      </button>
      {error && <p className="basis-full text-xs text-danger">{error}</p>}
    </form>
  );
}
