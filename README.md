# Ferdinand Taslim — Personal Portfolio Website

> A handcrafted, single-file portfolio website built for a Computer Science (Data Analytics) student at Asia Pacific University. Designed to be fast, visually distinctive, and deployable with zero dependencies — just drop the folder onto any static host.



## Live Preview

**[ferdinandtaslim.tech](https://ferdinandtaslim.tech)**



## About the Site

This portfolio was designed and built entirely from scratch in a single `index.html` file — no frameworks, no build tools, no npm. It showcases Ferdinand's academic background, professional experience, data analytics projects, and technical skill set with a strong editorial aesthetic: alternating dark/light sections, a custom crosshair cursor, animated backgrounds, and smooth scroll-driven interactions.



## Sections

| # | Section | Accent |
|---|---------|--------|
| — | Hero | Full-viewport intro with floating profile photo, live status badge, and stats ticker |
| 01 | About | Bio, personality traits, and key stats (GPA · Ranking · Impact · Projects) |
| 02 | Education | APU, De Montfort University, St. Peter's School |
| 03 | Experience | Featured cards for ADA & PPIDK + timeline for Maybank and WorldQuant |
| 04 | Projects | 3 featured cards with marquee image strips + 3 standard project cards |
| 05 | Skills | Programming languages, frameworks, tools, and concepts |
| — | Awards & Certifications | Award cards + expandable masonry gallery of 29 certificates |
| 06 | Contact | Email, phone, LinkedIn, GitHub, and location |



## Features

**Design & UX**
- Custom crosshair cursor (green `+` with centre dot, no lag)
- Page loader with animated name reveal
- Alternating section themes — dark (`#09090f`) and light (`#f5f4f0`) backgrounds
- Animated aurora canvas and dot-grid overlay in the hero
- Smooth scroll-driven `slide-up` and `fade-in` entrance animations
- Section number ghost text as decorative backdrop
- Centered pill-style navigation bar with accurate scroll-based active state

**Hero**
- "Open to work" live status badge with pulsing dot
- Floating profile photo with green glow and subtle float animation
- Horizontal stats ticker bar (GPA, ranking, impact, projects)

**Experience**
- ADA Data & AI Solutions: featured card with workplace photo strip, bullet points, tech pills, and character reference letter download
- PPIDK Asiania: featured card with dual landscape photo strip and tech pills
- Maybank & WorldQuant: standard timeline entries with logo, bullets, and tech pills

**Projects**
- Top 3 projects: infinite-loop horizontal marquee image strip (alternating left/right direction per card) that pauses on hover, above a fully interactive content block
- Bottom 3 projects: clean 3-column grid cards with tag badge, description, tech pills, and GitHub button
- All 6 projects link directly to GitHub repositories

**Education**
- APU card includes a "Download Transcript" dropdown (Year 1 / Year 2) that escapes parent overflow via JS body-append

**Skills**
- Four grouped sections: Programming Languages, Frameworks & Libraries, Tools & Platforms, Concepts & Methods
- Hover-lift pill tags with colour-coded dots

**Awards & Certifications**
- Four award cards (WorldQuant Alphathon 3rd place, CGPA Excellence, etc.)
- Expandable masonry gallery with staggered fade-in animation — 29 certificates displayed as full images with lightbox viewer

**Contact**
- Click-to-copy email address
- Direct links to LinkedIn and GitHub
- CV download button



## Tech Stack

This site uses **zero JavaScript frameworks and zero CSS libraries**. Everything is vanilla.

| Layer | Choice |
|-------|--------|
| Markup | HTML5 (single file) |
| Styling | CSS3 — custom properties, grid, flexbox, keyframe animations |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Syne, DM Sans, Instrument Serif |
| Icons | Inline SVG |
| Hosting | Any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages) |



## Folder Structure

```
portfolio/
├── index.html                  ← entire site lives here
└── assets/
    ├── images/
    │   ├── photo.png           ← profile photo (transparent background PNG)
    │   ├── logo.png            ← site favicon / nav logo
    │   ├── logo-apu.png
    │   ├── logo-dmu.png
    │   ├── logo-stpeter.png
    │   ├── logo-ada.png
    │   ├── logo-maybank.png
    │   ├── logo-worldquant.png
    │   ├── logo-ppidk.png
    │   ├── ada-landscape.jpg   ← ADA workplace photo (landscape)
    │   ├── ada-square.jpg      ← ADA workplace photo (square)
    │   ├── ppidk-photo1.jpg    ← PPIDK event photo
    │   ├── ppidk-photo2.jpg    ← PPIDK team photo
    │   ├── proj-churn-1/2/3.jpg
    │   ├── proj-vouch-1/2/3.jpg
    │   ├── proj-bi-1/2/3.jpg
    │   └── certificates/
    │       ├── cert-1.png
    │       ├── cert-2.png
    │       └── ...             ← all 29 certificate images
    └── resume/
        ├── resume-en.pdf       ← English CV
        ├── transcript-y1.pdf   ← Year 1 academic transcript
        ├── transcript-y2.pdf   ← Year 2 academic transcript
        └── reference-letter.pdf ← ADA character reference letter
```



## Deployment

### GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, root folder `/`
4. Your site will be live at `https://yourusername.github.io/repo-name`

### Netlify / Vercel

Drag and drop the project folder into the Netlify or Vercel dashboard — no configuration needed.

### Cloudflare Pages

Connect your GitHub repository in the Cloudflare Pages dashboard. Build command: *(none)*. Output directory: `/`.



## Customisation

All content lives directly in `index.html`. Key areas to update:

| What | Where in the file |
|------|------------------|
| Name, contact details | Hero section — `hero-meta` block |
| Status badge text | `hero-status` span |
| GPA and stats | `stats-bar` section |
| About bio | `about-text` paragraph |
| Experience entries | `exp-timeline` divs |
| Project descriptions & GitHub links | `proj-featured` and `project-card` divs |
| Skill tags | `skill-tags` groups in the Skills section |
| GitHub repo URLs | `btn-github` anchor `href` attributes |
| CV download | `btn-resume` anchor `href` attribute |
| Transcript files | `transcript-option` anchor `href` attributes |
| Reference letter | `btn-ref-letter` anchor `href` attribute |
| Certificate images | `CERTIFICATES` array in the JavaScript block |



## JavaScript Highlights

| Feature | Implementation |
|---------|---------------|
| Nav active state | Scroll-position based with bottom-of-page snap for short final sections |
| Page loader | Hides after `window.onload` with fade transition |
| Scroll animations | `IntersectionObserver` with `slide-up` and `fade-in` classes |
| Custom cursor | Crosshair `+` with instant snap (no lerp lag) |
| Aurora background | Canvas-based animated radial gradient orbs |
| Image marquee | CSS `@keyframes translateX(-50%)` with duplicated nodes for seamless loop |
| Certificate gallery | Measured-height expand animation — `scrollHeight` → `max-height` → `none` after transition |
| Certificate lightbox | Click-to-open full-screen overlay with keyboard navigation |
| Click-to-copy email | `navigator.clipboard.writeText` with visual feedback |
| Transcript dropdown | Appended to `document.body` to escape parent `overflow:hidden` and `transform` stacking context |



## Browser Support

Tested and working in:
- Chrome / Edge (Chromium) 110+
- Firefox 115+
- Safari 16+



## License

This project is for personal portfolio use. You are welcome to study the code for learning purposes. Please do not redistribute or use it as your own portfolio without significant modification.



## Contact

**Ferdinand Taslim**
📧 ferdinandtbusiness@gmail.com
📍 Kuala Lumpur, Malaysia
🔗 [LinkedIn](https://linkedin.com/in/ferdinandtslm) · [GitHub](https://github.com/Yuitox503)
