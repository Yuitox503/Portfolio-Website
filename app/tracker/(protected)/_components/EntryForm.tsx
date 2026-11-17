"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "../actions";

type Option = { id: string; name: string };

type Props = {
  categories: Option[];
  defaults?: { category_id: string; started_at: string; ended_at: string; note: string };
  /** End time may be left blank (only when editing the running entry). */
  allowOpenEnd?: boolean;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
  onDone?: () => void;
};

const field =
  "w-full rounded-xl border border-line bg-surface2 px-3 py-2.5 text-base outline-none focus:border-accent";

export function EntryForm({ categories, defaults, allowOpenEnd, submitLabel, onSubmit, onDone }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) return setError(res.error);
          setError(null);
          if (!defaults) form.reset();
          onDone?.();
        });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm text-text2">Category</span>
        <select name="category_id" defaultValue={defaults?.category_id ?? ""} required className={field}>
          <option value="" disabled>
            Choose…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm text-text2">Start</span>
          <input type="datetime-local" name="started_at" defaultValue={defaults?.started_at} required className={field} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-text2">End{allowOpenEnd ? " (blank = still running)" : ""}</span>
          <input
            type="datetime-local"
            name="ended_at"
            defaultValue={defaults?.ended_at}
            required={!allowOpenEnd}
            className={field}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm text-text2">Note</span>
        <input name="note" defaultValue={defaults?.note} maxLength={500} className={field} />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-accent px-4 py-2.5 font-semibold text-bg disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
        {onDone && defaults && (
          <button type="button" onClick={onDone} className="rounded-xl px-4 py-2.5 text-muted">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
