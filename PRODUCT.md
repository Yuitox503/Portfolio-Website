# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing codebase: Next.js app (`app/`) that also hosts a private personal tracker at `/tracker`. The public portfolio is a single static file, `public/index.html` (inline CSS and JS, no build step), served at the site root. Fonts load from Google Fonts today.

## Users

Primary: recruiters and hiring managers screening a graduating Computer Science / Data Analytics student for full-time data analytics roles. They skim on laptop or phone, usually for under a minute, deciding whether to open the CV or email.
Secondary: technical peers (data leads, engineers) who click into projects and judge the craft of the person and the page itself. Confirmed by the owner in this session.

## Product Purpose

A personal portfolio for Ferdinand Taslim (APU / De Montfort dual-degree CS student, Data Analytics specialism, based in Kuala Lumpur, from Pontianak, Indonesia). It exists to get him interviews and offers for full-time data analytics work from September 2026 onwards, by showing real experience, real projects, real credentials, and technical ability. Success: a visitor downloads the CV or sends an email.

## Positioning

The proof is specific to him: an internal-audit data analytics internship at ADA Data & AI Solutions (Power BI audit dashboards, reference letter on file), a final-year retail promotion counterfactual model with real metrics (Gradient Boosting, R² 0.8077), a WorldQuant research consultancy and Alphathon podium, 100+ students served by a scholarship site he led, and 29 certificate scans. A neighbouring student portfolio cannot truthfully copy those.

## Operating Context

Single scrolling page with in-page anchors: Home, About, Education, Experience, Projects, Skills (with Awards & Certifications), Contact. Visitors download the CV, three yearly transcripts, and a character reference letter. A certificate gallery opens to a masonry of scanned certificates with a lightbox. A separate `/tracker` app (private login) is linked from the nav and footer. The email address is assembled in JavaScript to avoid email-obfuscation tooling on the host.

## Capabilities and Constraints

- Content is frozen: every word, image, download, link, and number stays exactly as written. This is a design-only redesign. Known copy oddities (e.g. "Open to work · September 2026 onwards", "Present (inactive)") are the owner's to change later, not ours.
- Every file in `public/assets/` stays referenced and reachable: images, logos, project screenshots, 29 certificates, resume, reference letter, three transcripts.
- Must keep: the Awards & Certifications format (award cards, certificate chips, the "View Certificate Gallery" masonry with staggered reveal and lightbox), the Tracker link in the nav, the obfuscated email behaviour, the lightbox, and the transcript download menu.
- Must be functional, smooth, and mobile friendly; desktop is the primary target.
- Delivered on a feature branch (`redesign/portfolio`), not merged to `main` yet.

## Brand Commitments

Name, voice, and all writing are the owner's and unchanged. The owner explicitly does not want an "AI-generated" look, and asked for something creative, good looking, and vibrant that showcases technical capability. The masonry certificates and awards presentation is the one design element the owner asked to keep.

## Evidence on Hand

Real content already on the page: ADA internship bullets, PPIDK, Maybank M'bassador, WorldQuant roles; 8 projects with GitHub / live links (Retail Promotion Counterfactual Analysis, Owy, Customer Churn, Vouch AI, BI Dashboard, Forex, Credit Risk, Mellodie); project screenshots (`proj-*`); ADA and PPIDK event photos; a cut-out portrait (`Photo.png`); institution logos; 29 certificate images; CV, transcripts, reference letter. Absent: a GitHub profile link in the contact area, a standalone case-study write-up, testimonials. Do not fabricate any.

## Product Principles

1. The evidence leads; the interface serves it. Real work and real numbers over decoration.
2. A recruiter must know who this is, what he does, and how to reach him within seconds, on any device.
3. Technical craft is shown by how the page is built and behaves, not claimed in copy.
4. Nothing the owner wrote or supplied is removed, renamed, or rewritten.
5. Fast, smooth, and reliable beats spectacle that janks.

## Accessibility & Inclusion

Mobile phones are a primary recruiter context. Respect `prefers-reduced-motion`, keep keyboard focus visible and operable (including the lightbox and transcript menu), and meet WCAG AA text contrast. The earlier critique found none of these handled well today.
