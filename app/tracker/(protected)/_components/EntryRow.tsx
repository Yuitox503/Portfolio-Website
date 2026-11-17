"use client";

import { useState } from "react";
import { deleteEntry, updateEntry } from "../actions";
import { ActionButton } from "./ActionButton";
import { EntryForm } from "./EntryForm";

type Props = {
  entry: { id: string; category_id: string; note: string | null; ended_at: string | null };
  categoryName: string;
  when: string;
  duration: string;
  inputs: { started_at: string; ended_at: string };
  categories: { id: string; name: string }[];
};

export function EntryRow({ entry, categoryName, when, duration, inputs, categories }: Props) {
  const [editing, setEditing] = useState(false);
  const running = entry.ended_at === null;

  if (editing) {
    return (
      <li className="rounded-xl border border-accent/40 bg-surface p-4">
        <EntryForm
          categories={categories}
          defaults={{ category_id: entry.category_id, ...inputs, note: entry.note ?? "" }}
          allowOpenEnd={running}
          submitLabel="Save"
          onSubmit={(fd) => updateEntry(entry.id, fd)}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {categoryName}
          {running && <span className="ml-2 text-xs font-semibold uppercase text-accent">running</span>}
        </p>
        <p className="truncate text-sm text-muted">
          {when} · {duration}
          {entry.note ? ` · ${entry.note}` : ""}
        </p>
      </div>
      <button type="button" onClick={() => setEditing(true)} className="rounded-lg px-2.5 py-1.5 text-sm text-text2">
        Edit
      </button>
      <ActionButton
        action={() => deleteEntry(entry.id)}
        label="Delete"
        confirmText={`Delete this ${categoryName} entry?`}
      />
    </li>
  );
}
