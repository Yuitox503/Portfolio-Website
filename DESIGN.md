---
name: Ferdinand Taslim Portfolio
description: A calm tonal portfolio drawn as soft stacked sheets in Sanzo Wada combination no. 279 (tyrian blue, cinnamon, ecru, sienna), with counted pictogram units in the stats.
colors:
  tyrian: "#12354e"
  deep: "#0d2739"
  lift: "#194560"
  cinnamon: "#eea78c"
  ecru: "#c2ae93"
  sienna: "#bb7125"
  sienna-ink: "#8f541a"
  paper: "#f3ece2"
  paper-2: "#fbf7f0"
  text: "#f6efe6"
  text-2: "#d3c6b2"
  ink: "#12354e"
  ink-2: "#44596a"
  line-d: "rgba(246, 239, 230, 0.14)"
  line-l: "rgba(18, 53, 78, 0.14)"
  veil-d: "rgba(246, 239, 230, 0.06)"
  veil-l: "rgba(18, 53, 78, 0.06)"
  cinnamon-wash: "rgba(238, 167, 140, 0.45)"
  scrim: "rgba(8, 24, 36, 0.7)"
typography:
  display:
    fontFamily: "Shippori Mincho, Hina Mincho, Yu Mincho, Hiragino Mincho ProN, Georgia, serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Shippori Mincho, Hina Mincho, Yu Mincho, Hiragino Mincho ProN, Georgia, serif"
    fontSize: "3.4rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Shippori Mincho, Hina Mincho, Yu Mincho, Hiragino Mincho ProN, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Zen Kaku Gothic New, Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  s: "14px"
  md: "24px"
  l: "32px"
  sheet: "40px"
  pill: "999px"
  disc: "50%"
spacing:
  xs: "8px"
  sm: "14px"
  md: "28px"
  lg: "56px"
  gutter: "clamp(20px, 4.5vw, 64px)"
  nav-height: "64px"
  max-width: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.cinnamon}"
    textColor: "{colors.tyrian}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-dark:
    backgroundColor: "{colors.tyrian}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  button-dark-hover:
    backgroundColor: "{colors.lift}"
  nav-bar:
    backgroundColor: "{colors.deep}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    height: "64px"
  nav-link-active:
    backgroundColor: "{colors.cinnamon}"
    textColor: "{colors.tyrian}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-cta:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.tyrian}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  sheet-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  sheet-tyrian:
    backgroundColor: "{colors.tyrian}"
    textColor: "{colors.text}"
    rounded: "{rounded.sheet}"
  skill-tag-tyrian:
    backgroundColor: "{colors.tyrian}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  skill-tag-cinnamon:
    backgroundColor: "{colors.cinnamon}"
    textColor: "{colors.tyrian}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  skill-tag-ecru:
    backgroundColor: "{colors.ecru}"
    textColor: "{colors.tyrian}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  tech-pill:
    backgroundColor: "{colors.veil-l}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4px 14px"
  project-card:
    backgroundColor: "#153d58"
    textColor: "{colors.text}"
    rounded: "{rounded.l}"
  experience-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.l}"
  award-card:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "26px"
  cert-chip:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "13px 24px"
  palette-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.l}"
---

# Design System: Ferdinand Taslim Portfolio

## Overview

**Creative North Star: "The Stacked Paper Sheets"**

The page is a deck of soft sheets laid over one another. Each section is a full-width sheet with rounded 40px shoulders that rises over the one before it, alternating deep blue, tyrian, lifted blue and warm paper. The palette is a single Sanzo Wada combination (no. 279 in A Dictionary of Color Combinations): dark tyrian blue carries the page, vinaceous cinnamon is the one accent, ecru and raw sienna play quiet supporting roles. The mood is calm, tonal and tactile rather than loud; the world refuses multi-colour fields, hard blocks and the dark-neon portfolio default.

The Isotype idea survives only in the stats band, where facts are drawn as counted pictogram units with dashed ghost units for the unfilled remainder, so a number reads as a quantity before it reads as a numeral. Everywhere else form is soft: pill buttons and tags, 24 to 32px card radii, a floating pill nav, and a wavy cinnamon underline that marks the key word of a heading. Everything is flat colour with no shadows; depth comes from stacking, tone and overlap.

Density is generous. Wide gutters, a Mincho display voice over a clean Kaku Gothic text face, and motion limited to reveals that remove themselves, slow drifting circles and compositor-only marquee galleries.

**Key Characteristics:**
- Stacked rounded sheets (40px top radius, negative margin overlap) in deep, tyrian, lift and paper.
- Cinnamon as the single accent; ecru for quiet lines and fills; sienna only as small marks.
- Shippori Mincho for display and titles, Zen Kaku Gothic New for all reading text.
- A floating pill nav and pill buttons, tags and chips; no sharp-cornered containers.
- One pictogram sprite in a single stroke weight with round joins, used as counted units.
- Project galleries flow as a looping marquee that pauses on hover, focus or by button.

## Colors

A tonal blue field with one warm accent and a warm paper counterpart, all from the Wada 279 set.

### Primary
- **Dark Tyrian Blue** (tyrian, #12354e): the stats sheet and the tyrian sections, dark pill buttons, ink text on paper, and one of the three tag fills.
- **Vinaceous Cinnamon** (cinnamon, #eea78c): the single accent. Primary button, active nav link, the second hero name line, selection, focus ring on dark sheets, timeline fill, unit fills, wavy underline, and the scroll-to-top button.

### Secondary
- **Ecru** (ecru, #c2ae93): quiet outlines (units, ghost circles, line buttons), hero subtitle, the middle About bar, and the third tag fill.
- **Raw Sienna** (sienna, #bb7125): small marks only: the wavy underline and hover borders on paper, one station, one certificate dot. On paper, small text uses **Sienna Ink** (sienna-ink, #8f541a), which is dark enough to read.

### Neutral
- **Deep** (deep, #0d2739): page background, hero, nav bar and footer; the darkest tyrian.
- **Lift** (lift, #194560): lighter tyrian for the portrait disc, hover on dark buttons, the lifted section and scrollbar thumb.
- **Paper** (paper, #f3ece2) and **Paper 2** (paper-2, #fbf7f0): the light sheets and the cards that sit on them (award cards, cert chips, the fourth tag).
- **Text** (text, #f6efe6) and **Text 2** (text-2, #d3c6b2): primary and secondary copy on dark sheets.
- **Ink** (ink, #12354e) and **Ink 2** (ink-2, #44596a): primary and secondary copy on paper.
- **Hairlines and veils**: line-d / line-l (14% light or tyrian) for borders and dividers; veil-d / veil-l (6%) for quiet fills such as the section tab, education rows and tech pills; cinnamon-wash (cinnamon at 45%) for the highlighted phrase in About copy and the selected palette row; scrim (rgba(8,24,36,.7)) behind the jump palette, with a .94 variant behind the lightbox.

### Named Rules
**The One Warm Voice Rule.** Cinnamon is the only accent. Ecru and sienna support it in small amounts; no other hue is introduced.

**The Sheet Pairing Rule.** Each sheet sets its own text colour and focus colour: text and cinnamon focus on deep, tyrian and lift; ink and tyrian focus on paper. Content that moves to a new sheet takes that sheet's pairing and its secondary token, never opacity.

## Typography

**Display Font:** Shippori Mincho (with Hina Mincho, Yu Mincho, Hiragino Mincho ProN, Georgia, serif)
**Body Font:** Zen Kaku Gothic New (with Hiragino Kaku Gothic ProN, Yu Gothic, system-ui, sans-serif)

**Character:** A literary Mincho serif, warm and bookish, over a rounded, even Gothic that reads cleanly at length. Display announces; text reads.

### Hierarchy
- **Display** (800, clamp(3.25rem, 8.4vw, 6rem), 0.98): the stacked hero name, second line in cinnamon.
- **Headline** (700, clamp(2rem, 4.4vw, 3.4rem), 1.12): section headings, balanced wrap, with one phrase marked by colour or the wavy underline.
- **Title** (700, clamp(1.15rem, 2vw, 1.55rem), 1.3): degree, role and project titles; the lead project scales to clamp(1.5rem, 3vw, 2.3rem).
- **Stat** (700, clamp(2.25rem, 4vw, 3.25rem), 1.05): chart numerals with tabular figures.
- **Body** (400, 1.0625rem, 1.75): running text, capped at 52 to 68ch.
- **Label** (500, 0.875rem, 0.04em tracking, sentence case): nav links, dates, tags and pills in Zen Kaku Gothic New.

### Named Rules
**The Mincho Voice Rule.** Headings, titles, names and numerals are Shippori Mincho at 700 to 800; everything read as a sentence is Zen Kaku Gothic New at 1rem or larger.

## Layout

A 1240px maximum content width inside a fluid gutter (clamp(20px, 4.5vw, 64px)). Sections are full-bleed sheets with vertical padding of 64px to 104px (plus the 40px sheet overlap) above and 72px to 120px below. The hero fills the viewport and is a two-column grid (1.2fr copy, 0.8fr portrait) that collapses at 900px. The stats chart is four columns with hairline dividers, two columns at 1100px and one at 600px. Projects sit on a two-column grid with a full-width lead card (text split into two columns) and a three-column row of small cards, all collapsing to one column at 900px. Gaps run 12 to 32px in fluid steps; internal card padding is 22 to 40px. Breakpoints: 1180, 1100, 900 and 600px. The sheet overlap shrinks from 40px to 30px at 900px and 26px at 600px. The nav is a 64px floating pill (58px at 600px), 14px from the top, under a 4px segmented section-progress rail.

## Elevation & Depth

There are no shadows, gradients (apart from the edge fades that mask the marquee) or blurs. Depth is stacked tone: each sheet overlaps the previous one by its own corner radius, so the curved shoulder reads as a layer edge. Cards separate with 1px hairlines (line-d or line-l) and a contrasting fill. Overlays use a translucent blue scrim, not a blur. Hover movement is a 3px to 4px translate or a colour swap.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow. Separation comes from tone, a hairline, or overlap.

## Shapes

Every container is rounded. The scale is 14px (menu items, palette rows), 24px (award cards, transcript menu, gallery toggle), 32px (cards, bars, rows, palette box), 40px sheet tops (30px at 900px, 26px at 600px) and 999px pills for every button, tag, chip, pill and the nav. Circles (50%) are used for the hero discs, the brand mark, station dots, round icon buttons and units' dots. Logos sit in 22 to 28px rounded wells. Pictograms use a 1.6px stroke with round joins and caps, so no corner is sharp. Focus is a 3px solid outline with 3px offset in the sheet's focus colour. Selection is cinnamon with tyrian text.

## Components

### Buttons
- **Shape:** Pill (999px), 1.5px border, 14px 26px padding (10px 20px small), Zen Kaku Gothic New 700 at 0.9375rem.
- **Primary:** Cinnamon fill, tyrian text; hover swaps to paper.
- **Line:** Ecru outline, inherits text colour; hover fills text colour with tyrian text.
- **Dark:** Tyrian fill, paper text; hover lifts to lift blue. Inside project cards and the transcript wrap it inverts to paper, hovering to cinnamon.

### Navigation
- **Style:** A floating pill (deep at 96%, 1px line-d border) holding a 40px round paper brand mark, centred links, a Jump button with a kbd hint, a Tracker link and a paper call-to-action.
- **Links:** 15px, text-2; hover adds a veil wash; the active link is a cinnamon pill with tyrian text.
- **Mobile:** Below 900px the links fold into a rounded 28px panel under the nav, opened by a pill Menu toggle whose bars animate to a cross.
- **Progress rail:** Segments at the top edge fill left to right in cinnamon and ecru alternately.

### Section Tab
A small veil-filled pill with a hairline border that hangs at the top of each sheet, aligned to the content column. Wayfinding only; see the not-canonized note.

### Isotype Stats Chart
The tyrian sheet under the hero: four columns, each with a drawn unit group above a Mincho numeral and label. Units are 46x112px ecru-outlined rounded bars filled cinnamon from the bottom, a podium whose third step fills cinnamon, a 20-column crowd of figure pictograms, and 30px crates with dashed ghost crates for the remainder. Units grow in from zero when the band enters view. A dotted text-2 strip of facts sits below.

### Bars and Rows
Three About bars in tyrian, ecru and cinnamon (32px radius) each carry a 44px pictogram and a Mincho title. Education rows are veil-filled, hairline-bordered 32px rows with a rounded paper logo well.

### Experience Timeline
A 3px rail with a cinnamon progress fill, round stations ringed in deep, and cards that are paper (latest, with a photo pair on the right) or veil rows (older).

### Project Cards and Galleries
Cards are a slightly lifted blue (#153d58, a local card colour) with a hairline border and 32px radius. A gallery of 16:9 shots (20px radius) flows as a seamless marquee that pauses on hover, focus or the pause button; with reduced motion it stays a manual scroll-snap strip with arrows. Edge fades match the card colour. Then a pill category tag, title, description, tech pills and a paper pill action. The lead card splits its text into two columns.

### Skill Tags and Lens
Pill tags in tyrian, cinnamon, ecru or paper-2 with hairline border; interactive tags carry a dotted underline. Pressing a tag rings matching cards with a 3px cinnamon outline and dims the rest to 28% greyscale; a fixed paper pill bar at the bottom reports the active filter and offers clear and jump actions.

### Jump-to Palette
A paper 640px box (32px radius) over a scrim, with a hairline under the search field, 14px-rounded rows and a cinnamon-wash selected row.

### Awards and Certificates
Award cards are paper-2 with a hairline border, 24px radius and a pictogram medal in sienna, cinnamon, tyrian or ecru; hover lifts 3px to white. Certificate chips are paper-2 pills with a coloured dot. The gallery toggle is a full-width tyrian bar that lifts on hover; it reveals a three-column masonry of 18px-rounded certificate scans with a staggered fade-up, opening in a lightbox with a paper round close button.

## Do's and Don'ts

### Do:
- **Do** build with the Wada 279 set only: tyrian (#12354e) with its deep (#0d2739) and lift (#194560) steps, cinnamon (#eea78c), ecru (#c2ae93), sienna (#bb7125) and paper (#f3ece2).
- **Do** keep cinnamon as the single accent and use sienna ink (#8f541a) for small text on paper.
- **Do** round every container: 14, 24, 32px, 40px sheet tops, 999px pills.
- **Do** express quantities as counted pictogram units with a dashed ghost for the remainder.
- **Do** set the sheet's own text, secondary text and focus colour when placing content on a new sheet.
- **Do** use Shippori Mincho for headings and numerals and Zen Kaku Gothic New for running text.
- **Do** keep motion compositor-only and make reveals remove themselves; disable animation under `prefers-reduced-motion`.

### Don't:
- **Don't** add shadows, glows, blurs or sharp-cornered cards.
- **Don't** use dark-neon portfolio tropes: aurora, grid backdrops, crosshairs, loaders or text scramble.
- **Don't** make secondary text with opacity; use the paired secondary token.
- **Don't** introduce a new accent hue, or loud multi-colour fields.
- **Don't** replace the pictogram units with generic stock icons.

**Not canonized (defects the build carries):** the section tabs and the small label pills (project tags, the Latest Experience flag, the hero status pill) behave as eyebrow-style kickers and are not a rule for new surfaces. Off-palette one-offs sit outside the tokens: the project card fill #153d58, the second-tag tint #d9c9b0, the award medal tints #d98a6b and #a8916f, white certificate backing, and the 22% ecru outlined "contact-big" word, which is a low-contrast decorative flourish.
