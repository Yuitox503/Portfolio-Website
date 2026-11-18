"use client";

import { useRef, useState, useTransition } from "react";
import { logCount } from "../actions";
import { CheckIcon, PencilIcon } from "./icons";

type Props = { categoryId: string; categoryName: string; color: string; notePlaceholder?: string };

/** Round +1 button. Categories with a placeholder show the note field by default. */
export function CountLogger({ categoryId, categoryName, color, notePlaceholder }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showNote, setShowNote] = useState(Boolean(notePlaceholder));
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const note = inputRef.current?.value ?? "";
    startTransition(async () => {
      const res = await logCount(categoryId, note);
      if (res.ok) {
        if (inputRef.current) inputRef.current.value = "";
        setError(null);
        setFlash(true);
        setTimeout(() => setFlash(false), 900);
      } else setError(res.error);
    });
  }

  return (
    <form
      className="mt-3.5 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {showNote ? (
        <input
          ref={inputRef}
          name="note"
          placeholder={notePlaceholder ?? "Note (optional)"}
          maxLength={500}
          aria-label={`Note for ${categoryName}`}
          className="field !py-2.5"
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNote(true)}
          className="mr-auto inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted transition hover:text-text2"
        >
          <PencilIcon width={15} height={15} /> Add note
        </button>
      )}
      <button
        type="submit"
        disabled={pending}
        aria-label={`Log one ${categoryName}`}
        className="relative flex h-11 min-w-16 shrink-0 items-center justify-center rounded-full px-4 text-lg font-semibold text-bg transition active:scale-95 disabled:opacity-60"
        style={{ background: color }}
      >
        {flash ? <CheckIcon width={20} height={20} /> : "+1"}
      </button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </form>
  );
}
