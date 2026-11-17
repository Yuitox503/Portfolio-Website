"use client";

import { useState } from "react";
import type { ActionResult } from "../actions";
import { EntryForm } from "./EntryForm";
import { PlusIcon } from "./icons";

type Props = {
  kind: "time" | "count";
  label: string;
  categories: { id: string; name: string }[];
  onSubmit: (fd: FormData) => Promise<ActionResult>;
};

/** Collapsible "add a missing entry/log" form. */
export function AddPanel({ kind, label, categories, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-text2"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-amber/15 text-amber">
          <PlusIcon width={16} height={16} className={`transition ${open ? "rotate-45" : ""}`} />
        </span>
        {label}
      </button>
      {open && (
        <div className="border-t border-line p-4">
          <EntryForm kind={kind} categories={categories} submitLabel="Add" onSubmit={onSubmit} />
        </div>
      )}
    </div>
  );
}
