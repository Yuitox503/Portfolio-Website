"use client";

import { useState, useTransition } from "react";
import { moveCategory, saveCategory, setCategoryActive } from "../actions";
import type { Category } from "@/lib/types";
import { ArrowDown, ArrowUp, PencilIcon } from "./icons";

type Props = { category: Category; color: string; isFirst: boolean; isLast: boolean };

export function CategoryEditor({ category: c, color, isFirst, isLast }: Props) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) =>
    startTransition(async () => {
      const res = await fn();
      if (res.ok) {
        setError(null);
        after?.();
      } else setError(res.error ?? "Something went wrong.");
    });

  const iconBtn =
    "flex size-9 items-center justify-center rounded-full text-muted transition hover:text-text2 active:bg-surface2 disabled:opacity-25";

  return (
    <li className={`py-3 pl-4 pr-2 ${c.is_active ? "" : "opacity-60"}`}>
      {editing ? (
        <form
          className="space-y-3 pr-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(() => saveCategory(c.id, fd), () => setEditing(false));
          }}
        >
          <div className="grid grid-cols-[1fr_7rem] gap-3">
            <label className="block">
              <span className="label">Name</span>
              <input name="name" defaultValue={c.name} required maxLength={80} className="field" />
            </label>
            <label className="block">
              <span className="label">Target {c.type === "hours" ? "(hrs)" : ""}</span>
              <input
                name="weekly_target"
                type="number"
                inputMode="decimal"
                min={0}
                max={1000}
                step="any"
                defaultValue={c.weekly_target}
                required
                className="field"
              />
            </label>
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary !py-2.5">
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-ghost !py-2.5">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex min-w-[11rem] flex-1 items-center gap-3">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
            <div className="min-w-0">
              <p className="truncate font-medium">{c.name}</p>
              <p className="text-sm text-muted">
                {c.weekly_target} {c.type === "hours" ? "hrs" : Number(c.weekly_target) === 1 ? "time" : "times"} / week
                {!c.is_active && " · archived"}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center">
          <button type="button" className={iconBtn} disabled={pending || isFirst} aria-label={`Move ${c.name} up`} onClick={() => run(() => moveCategory(c.id, -1))}>
            <ArrowUp width={16} height={16} />
          </button>
          <button type="button" className={iconBtn} disabled={pending || isLast} aria-label={`Move ${c.name} down`} onClick={() => run(() => moveCategory(c.id, 1))}>
            <ArrowDown width={16} height={16} />
          </button>
          <button type="button" className={iconBtn} disabled={pending} aria-label={`Edit ${c.name}`} onClick={() => setEditing(true)}>
            <PencilIcon width={16} height={16} />
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (c.is_active && !window.confirm(`Archive "${c.name}"? It disappears from the week, but its history is kept.`)) return;
              run(() => setCategoryActive(c.id, !c.is_active));
            }}
            className="rounded-lg px-2.5 py-1.5 text-sm text-muted hover:text-text2"
          >
            {c.is_active ? "Archive" : "Restore"}
          </button>
          </div>
        </div>
      )}
      {!editing && error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </li>
  );
}

export function NewCategoryForm() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<"hours" | "count">("hours");

  return (
    <form
      className="space-y-3.5"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        fd.set("type", type);
        startTransition(async () => {
          const res = await saveCategory(null, fd);
          if (res.ok) {
            form.reset();
            setError(null);
          } else setError(res.error);
        });
      }}
    >
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface2 p-1 ring-1 ring-line" role="radiogroup" aria-label="Type">
        {(["hours", "count"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={type === t}
            onClick={() => setType(t)}
            className={`rounded-xl py-2 text-sm transition ${type === t ? "bg-raised text-text ring-1 ring-line-strong" : "text-muted"}`}
          >
            {t === "hours" ? "Timed (hours)" : "Counted (+1)"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_7rem] gap-3">
        <label className="block">
          <span className="label">Name</span>
          <input name="name" required maxLength={80} placeholder="e.g. Reading" className="field" />
        </label>
        <label className="block">
          <span className="label">Target {type === "hours" ? "(hrs)" : ""}</span>
          <input name="weekly_target" type="number" inputMode="decimal" min={0} max={1000} step="any" required className="field" />
        </label>
      </div>
      <p className="text-xs text-dim">The type can&apos;t be changed later.</p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={pending} className="btn-primary">
        {pending ? "Adding…" : "Add category"}
      </button>
    </form>
  );
}
