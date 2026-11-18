---
version: 1
slug: "app-tracker"
primary_target: "app/tracker"
related_targets: []
---

# Surface brief: app/tracker (private weekly tracker)

Mode: Operate. A single user (the owner) opens this on a phone and a laptop several times a day to start/stop timers, tap +1 counts, tick two daily rituals, review the week, and edit logs. Success: the state of the week is readable in a glance and every action is one tap away.

Scope: redesign only. No change to data, server actions, Supabase, auth, routes, or behaviour. The public portfolio (public/index.html and its assets) is out of scope and must not change.

Slop found in the first pass: DM Sans + Instrument Serif (saturated defaults), an uppercase tracked eyebrow above every heading, glow blobs and radial gradients (summary card, timer, body), film grain, backdrop blur, a pulsing dot, a rainbow of six pastel category colours plus mint, unicode glyphs (★ ✓) standing in for icons, progress rings as the main summary, every list row wrapped in its own big rounded card, `!important` ring overrides, 36px tap targets, low-contrast "dim" text, hard-coded hex fallbacks scattered through components.

## Direction contract

THESIS: A calm night ledger. One deep green ground, one ochre voice for what you can act on, a pale yellow that means "done", and rows grouped on shared surfaces instead of a stack of cards.

OWN-WORLD: Wada Sanzo, "A Dictionary of Color Combinations", no. 325 (a different combination from the portfolio's no. 279): Deep Slate Green #112f2c, Naples Yellow #fbe6a0, Yellow Ocher #e2b540, Eugenia Red #da525d. Ground steps are tints of the green; text is a naples-tinted off-white; ochre = primary action and in-progress; naples = target hit; eugenia = stop/destructive. Category dots use six tones drawn from the same combination. One workhorse family (Hanken Grotesk) with tabular figures. Flat surfaces, hairline dividers, 14-20px radii, no glow, no blur, no gradients, no grain.

STORY: Open the app, see the week at a glance (overall percent, targets hit, one meter segment per target), act on a target (timer or +1) without leaving the page, tick rituals, glance at recent logs, and move between Week / Log / Reviews / Settings with the thumb.

FIRST VIEWPORT (phone, 390x844): slim top strip with the way back to the portfolio, greeting and date, week switcher, the summary (percent, score, segmented meter, mood, review link), then the first targets; bottom tab bar fixed. Desktop widens to a two-column dashboard (summary and targets left; rituals and recent logs right).

FORM: Operate redesign of an existing surface (no new-world roll): keep the information architecture and every interaction; replace the visual system.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review and the verdict. The system is recorded in this brief; DESIGN.md at the repo root belongs to the portfolio and is not rewritten.
