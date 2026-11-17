---
name: Ferdinand Taslim Portfolio
description: An Isotype wall chart in flat enamel cobalt, signal red, sun yellow, ink and white, where facts are drawn as counted units.
colors:
  cobalt: "#1f4fd8"
  signal-red: "#d62e1f"
  sun-yellow: "#ffc61a"
  ink: "#14110f"
  ink-raised: "#26211d"
  white: "#ffffff"
  mist: "#eef1f8"
  muted-ink: "#4a4338"
  muted-on-ink: "#cfc9bf"
  muted-on-cobalt: "#d4defc"
typography:
  display:
    fontFamily: "League Spartan, Futura, Century Gothic, Trebuchet MS, sans-serif"
    fontSize: "6rem"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "League Spartan, Futura, Century Gothic, Trebuchet MS, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.01em"
  title:
    fontFamily: "League Spartan, Futura, Century Gothic, Trebuchet MS, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Atkinson Hyperlegible, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "League Spartan, Futura, Century Gothic, Trebuchet MS, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  disc: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "48px"
  gutter: "clamp(20px, 4.5vw, 64px)"
  nav-height: "64px"
components:
  button-yellow:
    backgroundColor: "{colors.sun-yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-yellow-hover:
    backgroundColor: "{colors.white}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "14px 24px"
  button-ink-hover:
    backgroundColor: "{colors.cobalt}"
  nav-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    height: "64px"
  nav-link-active:
    backgroundColor: "{colors.sun-yellow}"
    textColor: "{colors.ink}"
  skill-tag-red:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  tech-pill:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  project-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  project-card-small:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
  award-card:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "26px"
  cert-chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 18px"
---

# Design System: Ferdinand Taslim Portfolio

## Overview

**Creative North Star: "The Isotype Wall Chart"**

The page is a wall of flat enamel colour fields, each section a full-bleed panel of cobalt, red, yellow, ink or white. Facts about Ferdinand are drawn as counted units (figures, crates, stacked bars, a podium) with ghost units for the unfilled remainder, so a number reads as a quantity before it reads as a numeral. The world refuses the dark-neon portfolio default: there are no shadows, no gradients, no glows and no rounded cards.

Density is generous and structured: wide gutters, heavy uppercase display type, and square blocks of colour that stack like a printed chart. Bars and rows vary in width (100%, 90%, 80%) to suggest a bar chart rather than a list. Colour carries meaning by position and contrast, not by decoration; each field pairs one text colour with one background and a single focus colour chosen for that field.

**Key Characteristics:**
- Five flat fields (cobalt, signal red, sun yellow, ink, white) with square corners and zero shadows.
- Heavy League Spartan caps for display; Atkinson Hyperlegible for everything read at length.
- One pictogram sprite in a single weight (figure, sheet, crate, podium, medal) used as counted units.
- A segmented section-progress rail across the top replaces the browser scroll bar.
- Circle discs and quarter-discs are the only curves; everything else is a rectangle.

## Colors

A primary-colour enamel palette: three saturated fields, one near-black, one clean white, and a pale blue-grey for quiet containers.

### Primary
- **Cobalt** (#1f4fd8): the hero field, filled crate units, the podium's third step, ink-button hover and technical project tags.
- **Signal Red** (#d62e1f): section fields, GPA bar fills, date labels on white cards and the leading About bar.
- **Sun Yellow** (#ffc61a): the stats chart field, primary buttons, the active nav link, highlight marks on key phrases and the hero disc.

### Neutral
- **Ink** (#14110f): the page background, nav bar, footer, tab blocks on light fields, outlines and rules (3px borders, chart dividers).
- **Ink Raised** (#26211d): secondary experience rows on ink so they separate from the page.
- **White** (#ffffff): content cards, the white section, button hover state and text on coloured fields.
- **Mist** (#eef1f8): logo wells, tech pills, award cards and the scrollbar track.
- **Muted Ink** (#4a4338): secondary text on white and yellow.
- **Muted on Ink** (#cfc9bf): secondary text on ink.
- **Muted on Cobalt** (#d4defc): secondary text on cobalt.

### Named Rules
**The Field Pairing Rule.** Every field sets its own text colour and focus colour: white text on cobalt, red and ink (focus yellow on cobalt and ink, white on red); ink text on yellow and white (focus cobalt). Text never moves to a new field without taking that field's pairing.

**The Flat Enamel Rule.** Colour is applied as solid blocks only. Depth is never simulated with shadow, blur or gradient.

## Typography

**Display Font:** League Spartan (with Futura, Century Gothic, Trebuchet MS, sans-serif)
**Body Font:** Atkinson Hyperlegible (with Segoe UI, system-ui, sans-serif)

**Character:** A geometric, heavy, uppercase poster voice paired with a typeface designed for legibility. Display type announces; body type is for reading.

### Hierarchy
- **Display** (900, clamp(3.25rem, 8.4vw, 6rem), 0.9): the stacked hero name in uppercase, second line in yellow.
- **Headline** (800, clamp(2rem, 4.6vw, 3.5rem), 1.04): section headings (`.h2`), uppercase, balanced wrap, -0.01em tracking.
- **Title** (800, clamp(1.15rem, 2vw, 1.55rem), 1.2): degree, role and project titles; the lead project scales to clamp(1.5rem, 3vw, 2.4rem).
- **Stat** (800, clamp(2.25rem, 4vw, 3.25rem), 1): chart numerals with tabular figures.
- **Body** (400, 1.0625rem, 1.65): running text, capped at 52 to 68ch.
- **Label** (700, 0.8125rem, 0.08em tracking, uppercase, League Spartan): nav links, buttons in the nav, small block labels.

### Named Rules
**The Heavy Caps Rule.** Display and headline text is always uppercase League Spartan at weight 800 or 900. Mixed-case display type does not appear.

**The Readable Text Rule.** Anything longer than a label is Atkinson Hyperlegible at 1rem or larger; secondary copy uses the paired muted token, never opacity.

## Layout

A 1280px maximum content width inside a fluid gutter (`clamp(20px, 4.5vw, 64px)`). Sections are full-bleed fields with vertical padding between 88px and 140px at the top and 72px and 120px at the bottom. The hero is a two-column grid (1.2fr copy, 0.8fr portrait) that collapses to one column at 900px. The stats chart is four columns separated by 3px ink rules, collapsing to two at 1100px and one at 600px. Project cards sit on a two-column grid with a full-width lead card and a three-column row of small cards. Spacing rhythm is multiples of 4 and 12 (12px gaps in lists, 16px to 32px in card grids, 24px internal padding). Breakpoints: 1180, 1100, 900 and 600px. The fixed nav is 64px (58px at 600px) beneath a 6px progress rail.

Rows in the education and About lists narrow in steps (100%, 92%, 84% or 100%, 90%, 80%) to read as bars of a chart; they return to full width below 900px.

## Elevation & Depth

There are no shadows, gradients or blurs in the stylesheet. Depth is conveyed by stacking opaque fields against each other, by 3px ink borders and by overlap (the portrait stands on a yellow disc; a hanging tab sits on the section edge). Overlays (lightbox, jump palette) use a translucent ink scrim, not a blur. Hover movement is a small 3px to 4px translate or a colour swap, never a lift shadow.

### Named Rules
**The No Shadow Rule.** Nothing casts a shadow. Separation comes from a contrasting field, a 3px ink rule or a dashed outline.

## Shapes

Square corners everywhere (radius 0). The only curves are circle discs (the hero yellow disc, 50%) and a single quarter-disc in red. Borders are heavy and flat: 3px solid ink on cert chips, masonry items and the scroll-to-top button; 2px outlines on tag and button borders; a dashed 4px square on the hero as a ghost unit. Focus rings are 3px solid outlines with a 3px offset in the field's own focus colour. Selection inverts to ink with yellow text.

## Components

### Buttons
- **Shape:** Square, 3px border, 14px 24px padding (10px 18px small), Atkinson Hyperlegible 700 at 0.9375rem.
- **Primary (yellow):** Sun yellow fill, ink text; hover swaps to white fill.
- **Line:** Currentcolor 3px outline, transparent fill; hover fills white with ink text.
- **Ink:** Ink fill and white text; hover swaps to cobalt. Inside ink cards it inverts to yellow.
- **Nav buttons:** Spartan caps 0.8125rem with a 2px translucent white outline; the call to action is solid yellow.

### Navigation
- **Style:** Fixed ink bar, 64px high, under a 6px segmented progress rail whose seven segments fill left to right in yellow, red, white, cobalt, yellow, red, white.
- **Links:** Spartan caps with 0.08em tracking; hover is a 14% white wash; the active link is a solid yellow block with ink text.
- **Mobile:** Below 900px the links collapse into a full-width ink panel opened by a bordered Menu toggle whose three bars animate to a cross.

### Section Tab
A solid block (ink on light fields, yellow on ink and cobalt, white on red) that hangs from the section's top edge, aligned to the content column. It carries a numbered section name and mirrors the nav order. It is a wayfinding device, not a heading; the section heading below it is the `.h2`.

### Isotype Stats Chart
The yellow band under the hero: four columns, each with a drawn unit group above a heavy numeral and a bold label. Units are 44x112px ink-bordered bars filled red from the bottom, a podium whose third step fills cobalt, a 20-column crowd of figure pictograms, and 30px cobalt crates with dashed ghost crates for the remainder. Units grow in from zero (scaleY) when the band enters view; reduced motion collapses transitions. Dividers are 3px ink rules.

### Bars and Rows
Full-colour blocks (red, cobalt, yellow, white) of descending width with a 44px pictogram and a Spartan title; each row is a single flat field.

### Experience Timeline
A 6px rail with a yellow progress fill, square 28px stations with a 5px ink border, and cards that are white (latest, with a photo pair on the right) or ink-raised (older rows).

### Project Cards and Galleries
Cards are flat white (lead and standard) or ink (small). A full-bleed colour band (cobalt, red or ink with yellow text) carries the category, then the title, description, pills and an action. Galleries are horizontal scroll-snap tracks of 16:9 shots with 3px gaps, a yellow scrollbar on ink, drag-to-scroll, and an ink control strip whose buttons turn yellow on hover.

### Skill Tags and Lens
Square tags in red, cobalt, yellow or ink, with a 4px ink bottom edge when interactive. Pressing a tag lights the matching projects with a 5px ring and dims the rest to 25% and greyscale; a fixed ink bar at the bottom reports the active filter.

### Jump-to Palette
A white 640px box on a translucent ink scrim, with a 3px ink rule under the search field and a yellow selected row.

### Awards and Certificates
Award cards are mist squares with a pictogram medal; on hover they turn yellow and lift 3px. Certificate chips are white with a 3px ink border and a coloured square dot. The gallery toggle is a full-width ink bar that turns cobalt; it reveals a three-column masonry of bordered certificate scans with staggered fade-up, opening into a full-screen lightbox with a yellow close button.

## Do's and Don'ts

### Do:
- **Do** build every surface from solid fields in cobalt (#1f4fd8), signal red (#d62e1f), sun yellow (#ffc61a), ink (#14110f) and white.
- **Do** keep corners square; use circles only for discs.
- **Do** express quantities as counted pictogram units with a ghost unit for the remainder.
- **Do** set the field's own focus colour and secondary text token when placing content on a new field.
- **Do** use League Spartan 800 or 900 in uppercase for headings and Atkinson Hyperlegible for all running text.
- **Do** disable transitions under `prefers-reduced-motion`.

### Don't:
- **Don't** add shadows, gradients, glows, blurs or rounded cards.
- **Don't** use dark-neon portfolio tropes: aurora, grid backdrops, tickers, crosshairs, loaders or text scramble.
- **Don't** use opacity to make secondary text; use the muted token for the field.
- **Don't** introduce a new accent hue; the three primaries are the whole chromatic range.
- **Don't** replace the pictogram units with generic stock icons.

**Not canonized (defects the build carries):** the numbered section tabs and the small uppercase category and status labels (project tags, "Latest Experience" flag, hero status line) behave as eyebrow-style kickers and are not a rule for new surfaces; award medal tints `#a85a16` and `#b98100` sit outside the palette; the hollow outlined "contact-big" word relies on a 30% white stroke that is a low-contrast decorative flourish.
