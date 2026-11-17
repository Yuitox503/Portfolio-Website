"use client";

import { useState, useTransition } from "react";
import { deleteReview, saveReview } from "../actions";
import type { WeeklyReview } from "@/lib/types";
import { StarIcon } from "./icons";

const PROMPTS = [
  { name: "went_well", label: "What went well?", placeholder: "Wins, small or big…" },
  { name: "to_improve", label: "What got in the way?", placeholder: "Be honest, be kind…" },
  { name: "next_focus", label: "One focus for next week", placeholder: "The thing that matters most…" },
] as const;

const RATING_WORDS = ["", "Rough", "Meh", "Okay", "Good", "Great"];

export function ReviewForm({ week, review }: { week: string; review: WeeklyReview | null }) {
  const [rating, setRating] = useState<number>(review?.rating ?? 0);
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        fd.set("rating", String(rating || ""));
        startTransition(async () => {
          const res = await saveReview(week, fd);
          setStatus(res.ok ? { ok: true, text: "Saved" } : { ok: false, text: res.error });
        });
      }}
    >
      <fieldset>
        <legend className="label">How did the week feel?</legend>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n === rating ? 0 : n)}
              aria-label={`${n} of 5 – ${RATING_WORDS[n]}`}
              aria-pressed={n <= rating}
              className={`flex size-11 items-center justify-center rounded-full transition active:scale-90 ${n <= rating ? "text-amber" : "text-dim"}`}
            >
              <StarIcon width={26} height={26} fill={n <= rating ? "currentColor" : "none"} />
            </button>
          ))}
          <span className="ml-2 font-serif text-lg italic text-text2">{RATING_WORDS[rating]}</span>
        </div>
      </fieldset>

      {PROMPTS.map((p) => (
        <label key={p.name} className="block">
          <span className="label">{p.label}</span>
          <textarea
            name={p.name}
            rows={3}
            maxLength={4000}
            defaultValue={review?.[p.name] ?? ""}
            placeholder={p.placeholder}
            className="field resize-y leading-relaxed"
          />
        </label>
      ))}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "Saving…" : review ? "Update review" : "Save review"}
        </button>
        {status && <span className={`text-sm ${status.ok ? "text-accent" : "text-danger"}`}>{status.text}</span>}
        {review && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!window.confirm("Delete this review? The week's data stays.")) return;
              startTransition(async () => {
                const res = await deleteReview(week);
                if (res.ok) {
                  setRating(0);
                  setStatus({ ok: true, text: "Review deleted" });
                } else setStatus({ ok: false, text: res.error });
              });
            }}
            className="ml-auto text-sm text-muted hover:text-danger"
          >
            Delete review
          </button>
        )}
      </div>
    </form>
  );
}
