"use client";

import { useState } from "react";
import type { ActionResult } from "../actions";
import { ActionButton } from "./ActionButton";
import { EntryForm } from "./EntryForm";
import { PencilIcon } from "./icons";

type Props = {
  kind: "time" | "count";
  color: string;
  title: string;
  badge?: string;
  subtitle: string;
  categories: { id: string; name: string }[];
  defaults: { category_id: string; started_at: string; ended_at?: string; note: string };
  allowOpenEnd?: boolean;
  onSave: (fd: FormData) => Promise<ActionResult>;
  onDelete: () => Promise<ActionResult>;
};

/** A time entry or count log that expands into an edit form. */
export function EditableRow({ kind, color, title, badge, subtitle, categories, defaults, allowOpenEnd, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="bg-surface2/60 p-4">
        <EntryForm
          kind={kind}
          categories={categories}
          defaults={defaults}
          allowOpenEnd={allowOpenEnd}
          submitLabel="Save changes"
          onSubmit={onSave}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-3 pl-4 pr-2">
      <span className="size-2 shrink-0 rounded-full" style={{ background: color }} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px]">
          {title}
          {badge && <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-hit">{badge}</span>}
        </p>
        <p className="truncate text-sm text-muted">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${title}`}
        className="icon-btn"
      >
        <PencilIcon width={16} height={16} />
      </button>
      <ActionButton action={onDelete} label="Delete" confirmText={`Delete this ${title} ${kind === "time" ? "entry" : "log"}?`} />
    </li>
  );
}
