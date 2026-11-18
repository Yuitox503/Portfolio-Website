"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "../actions";
import { CheckIcon } from "./icons";

type Option = { id: string; name: string };

type Props = {
  /** "time" = start/end entry, "count" = single timestamp log */
  kind: "time" | "count";
  categories: Option[];
  defaults?: { category_id: string; started_at: string; ended_at?: string; note: string };
  /** End time may be left blank (only when editing the running entry). */
  allowOpenEnd?: boolean;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
  onDone?: () => void;
};

export function EntryForm({ kind, categories, defaults, allowOpenEnd, submitLabel, onSubmit, onDone }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        startTransition(async () => {
          const res = await onSubmit(fd);
          if (!res.ok) return setError(res.error);
          setError(null);
          if (!defaults) {
            form.reset();
            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
          }
          onDone?.();
        });
      }}
    >
      <label className="block">
        <span className="label">Category</span>
        <select name="category_id" defaultValue={defaults?.category_id ?? ""} required className="field">
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

      {kind === "time" ? (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <label className="block">
            <span className="label">Start</span>
            <input type="datetime-local" name="started_at" defaultValue={defaults?.started_at} required className="field" />
          </label>
          <label className="block">
            <span className="label">End{allowOpenEnd ? " · blank = still running" : ""}</span>
            <input
              type="datetime-local"
              name="ended_at"
              defaultValue={defaults?.ended_at}
              required={!allowOpenEnd}
              className="field"
            />
          </label>
        </div>
      ) : (
        <label className="block">
          <span className="label">When</span>
          <input type="datetime-local" name="logged_at" defaultValue={defaults?.started_at} required className="field" />
        </label>
      )}

      <label className="block">
        <span className="label">Note</span>
        <input name="note" defaultValue={defaults?.note} maxLength={500} placeholder="Optional" className="field" />
      </label>

      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : saved ? (<><CheckIcon width={18} height={18} /> Added</>) : submitLabel}
        </button>
        {onDone && defaults && (
          <button type="button" onClick={onDone} className="btn-ghost">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
