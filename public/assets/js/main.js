/* Ferdinand Taslim — portfolio behaviour.
   Plain JS, no dependencies. Everything degrades: with JS off every word,
   image and download is still on the page. */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const reducedMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const fineMQ = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => reducedMQ.matches;

  /* ── Email (assembled here so the host's obfuscation can't break it) ── */
  const EMAIL = 'ferdinandtbusiness' + '@' + 'gmail.com';
  ['nav-cta-email', 'hero-email', 'contact-email'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.href = 'mailto:' + EMAIL;
    if (id === 'hero-email') el.textContent = EMAIL;
  });

  /* ── Dialog bookkeeping (lightbox + palette share Esc and scroll lock) ── */
  const lockScroll = on => { document.documentElement.style.overflow = on ? 'hidden' : ''; };

  /* ═══════════════════ Isotype chart (the stats) ═══════════════════ */
  (function chart() {
    const chartEl = $('#chart');
    if (!chartEl) return;

    const crowd = $('#crowd');
    if (crowd) {
      const NS = 'http://www.w3.org/2000/svg';
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 100; i++) {
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 24 40');
        svg.setAttribute('focusable', 'false');
        svg.style.transitionDelay = (i * 11) + 'ms';
        const use = document.createElementNS(NS, 'use');
        use.setAttribute('href', '#p-fig');
        svg.appendChild(use);
        frag.appendChild(svg);
      }
      crowd.appendChild(frag);
    }
    $$('.crate', chartEl).forEach((c, i) => { c.style.transitionDelay = (i * 90) + 'ms'; });
    $$('.unit b', chartEl).forEach((b, i) => { b.style.transitionDelay = (i * 130) + 'ms'; });

    const countUp = (el, target, suffix, duration) => {
      const isFloat = target % 1 !== 0;
      const t0 = performance.now();
      const step = ts => {
        const p = Math.min((ts - t0) / duration, 1);
        const e = 1 - Math.pow(1 - p, 4);
        el.textContent = (isFloat ? (e * target).toFixed(2) : Math.floor(e * target)) + (suffix || '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const fire = () => {
      chartEl.classList.add('in');
      if (reduced()) return;
      [['.c-1', 3.88, ''], ['.c-2', 3, 'rd'], ['.c-3', 100, '+'], ['.c-4', 6, '+']]
        .forEach(([sel, val, suf]) => { const el = $(sel, chartEl); if (el) countUp(el, val, suf, 1600); });
    };

    if (!('IntersectionObserver' in window)) { chartEl.classList.add('in'); return; }
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); fire(); }
    }, { threshold: 0.3 });
    io.observe(chartEl);
  })();

  /* ═══════════════════ Hero halftone field (canvas) ═══════════════════
     Dots swell under the cursor. Idle = zero frames; the loop only runs
     while the pointer is moving, and only while the hero is on screen. */
  (function heroDots() {
    const canvas = $('#heroDots');
    if (!canvas || !canvas.getContext) return;
    const hero = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    const GAP = 30;
    let w = 0, h = 0, dpr = 1;
    let tx = -9999, ty = -9999, sx = -9999, sy = -9999;
    let raf = 0, inView = true;

    const base = (x) => {
      const t = clamp((x / w - 0.42) / 0.5, 0, 1);
      return 1 + 2.6 * t * t * (3 - 2 * t);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 190;
      ctx.fillStyle = 'rgba(194,174,147,0.22)';
      ctx.beginPath();
      const near = [];
      for (let y = GAP / 2; y < h + GAP; y += GAP) {
        for (let x = GAP / 2; x < w + GAP; x += GAP) {
          const dx = x - sx, dy = y - sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) { near.push(x, y, 1 - Math.sqrt(d2) / R); continue; }
          const r = base(x);
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, 6.2832);
        }
      }
      ctx.fill();
      if (near.length) {
        ctx.fillStyle = '#eea78c';
        ctx.beginPath();
        for (let i = 0; i < near.length; i += 3) {
          const n = near[i + 2];
          const r = base(near[i]) + n * n * 9;
          ctx.moveTo(near[i] + r, near[i + 1]);
          ctx.arc(near[i], near[i + 1], r, 0, 6.2832);
        }
        ctx.fill();
      }
    };

    const loop = () => {
      sx += (tx - sx) * 0.16; sy += (ty - sy) * 0.16;
      draw();
      const settled = Math.abs(tx - sx) < 0.6 && Math.abs(ty - sy) < 0.6;
      raf = (settled || !inView) ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && inView) raf = requestAnimationFrame(loop); };

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = hero.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    size();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 120); });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { inView = es[0].isIntersecting; if (inView) kick(); }, { threshold: 0 }).observe(hero);
    }

    if (fineMQ.matches && !reduced()) {
      hero.addEventListener('pointermove', e => {
        const r = hero.getBoundingClientRect();
        tx = e.clientX - r.left; ty = e.clientY - r.top;
        if (sx < -9000) { sx = tx; sy = ty; }
        kick();
      });
      hero.addEventListener('pointerleave', () => { tx = -9999; ty = -9999; sx = -9999; sy = -9999; draw(); });
    }
  })();

  /* ═══════════════════ Nav, progress rail, scroll effects ═══════════════════ */
  (function chrome() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const links = $$('.nav-links a');
    const ids = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'contact'];
    const secs = ids.map(id => document.getElementById(id));
    const segs = $$('#rail i');
    const timeline = $('#timeline');
    const topBtn = $('#scroll-top');

    const setOpen = open => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    links.forEach(a => a.addEventListener('click', () => setOpen(false)));
    $('#nav-cta-email').addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const doc = document.documentElement;

      // progress rail: one segment per section
      secs.forEach((s, i) => {
        if (!s || !segs[i]) return;
        const top = s.offsetTop, hgt = s.offsetHeight;
        segs[i].style.setProperty('--p', clamp((y + vh - top) / (hgt + vh * 0.6), 0, 1).toFixed(3));
      });
      if (y + vh >= doc.scrollHeight - 2) segs.forEach(s => s.style.setProperty('--p', 1));

      // active link
      let current = ids[0];
      const trigger = y + vh * 0.4;
      secs.forEach((s, i) => { if (s && s.offsetTop <= trigger) current = ids[i]; });
      if (y + vh >= doc.scrollHeight - 60) current = ids[ids.length - 1];
      links.forEach(l => {
        const on = l.getAttribute('href') === '#' + current;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });

      // experience rail draws as you scroll
      if (timeline) {
        const r = timeline.getBoundingClientRect();
        const p = clamp((vh * 0.65 - r.top) / r.height, 0, 1);
        timeline.style.setProperty('--p', p.toFixed(3));
      }
      topBtn.classList.toggle('visible', y > 500);
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('load', update);
    update();

    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' }));
  })();

  /* ═══════════════════ Magnetic CTAs (fine pointers only) ═══════════════════ */
  (function magnetic() {
    if (!fineMQ.matches || reduced()) return;
    $$('.hero-actions .btn, .nav-cta').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        btn.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  })();

  /* ═══════════════════ Lightbox (screenshots + certificates) ═══════════════════ */
  const lightbox = $('#cert-lightbox');
  const lightboxImg = document.createElement('img');
  lightboxImg.id = 'cert-lightbox-img';
  lightboxImg.alt = '';
  lightbox.appendChild(lightboxImg);
  const lightboxClose = $('#cert-lightbox-close');
  let lbOpener = null;
  function openLightbox(src, alt, opener) {
    lbOpener = opener || document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    lockScroll(true);
    lightboxClose.focus();
  }
  function closeLightbox() {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    lockScroll(false);
    if (lbOpener && lbOpener.focus) lbOpener.focus();
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('keydown', e => { if (e.key === 'Tab') { e.preventDefault(); lightboxClose.focus(); } });

  /* Screenshots inside horizontal scrollers never count as 'near the viewport',
     so fetch them once the page is idle instead of leaving black plates. */
  window.addEventListener('load', () => {
    const warm = () => $$('.shot img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
    (window.requestIdleCallback || (f => setTimeout(f, 1200)))(warm);
  });

  /* ═══════════════════ Project galleries ═══════════════════ */
  (function galleries() {
    $$('[data-gallery]').forEach(g => {
      const track = $('.gallery-track', g);
      const prev = $('.g-prev', g), next = $('.g-next', g), count = $('.g-count', g);
      const shots = () => $$('.shot', track);
      const index = () => {
        const s = shots(); if (!s.length) return 0;
        const x = track.scrollLeft + 4;
        let best = 0;
        s.forEach((el, i) => { if (el.offsetLeft <= x) best = i; });
        if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = s.length - 1;
        return best;
      };
      const update = () => {
        const s = shots(), i = index();
        count.textContent = s.length ? (i + 1) + ' / ' + s.length : '';
        prev.disabled = i <= 0;
        next.disabled = i >= s.length - 1;
        const none = s.length < 2;
        $('.gallery-ctl', g).hidden = none && !s.length;
      };
      const go = d => {
        const s = shots(); if (!s.length) return;
        const i = clamp(index() + d, 0, s.length - 1);
        track.scrollTo({ left: s[i].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
      };
      prev.addEventListener('click', () => go(-1));
      next.addEventListener('click', () => go(1));
      track.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      });
      track.addEventListener('scroll', update, { passive: true });
      window.addEventListener('load', update);
      window.addEventListener('resize', update);
      update();

      // mouse drag-to-scroll (touch and trackpads already scroll natively)
      let down = false, startX = 0, startLeft = 0, moved = false, pid = null;
      track.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || g.classList.contains('is-marquee')) return;
        down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft; pid = e.pointerId;
      });
      track.addEventListener('pointermove', e => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 6) { moved = true; track.classList.add('dragging'); track.setPointerCapture(pid); }
        if (moved) track.scrollLeft = startLeft - dx;
      });
      const end = () => {
        if (!down) return;
        down = false;
        if (moved) {
          track.classList.remove('dragging');
          const s = shots(); const x = track.scrollLeft;
          let best = 0, bd = Infinity;
          s.forEach((el, i) => { const d = Math.abs(el.offsetLeft - x); if (d < bd) { bd = d; best = i; } });
          if (s[best]) track.scrollTo({ left: s[best].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
          setTimeout(() => { moved = false; }, 0);
        }
      };
      track.addEventListener('pointerup', end);
      track.addEventListener('pointercancel', end);
      track.addEventListener('click', e => {
        if (moved) { e.preventDefault(); e.stopPropagation(); return; }
        const shot = e.target.closest('[data-zoom]');
        if (!shot) return;
        const img = $('img', shot);
        if (img) openLightbox(img.currentSrc || img.src, img.alt, shot);
      }, true);
    });
  })();


  /* ═══════════════════ Flowing project strips (marquee) ═══════════════════
     Compositor-only (transform). Pauses on hover/focus, with a visible pause
     button, and while off screen. Reduced motion keeps the manual strip. */
  (function marquee() {
    const NS = 'http://www.w3.org/2000/svg';
    const icon = (cls, d) => {
      const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', 'ic ' + cls); s.setAttribute('aria-hidden', 'true');
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.appendChild(p); return s;
    };
    const start = () => {
      if (reduced()) return;
      $$('[data-gallery]').forEach((g, idx) => {
        const track = $('.gallery-track', g);
        const shots = $$('.shot', track);
        if (shots.length < 2 || g.classList.contains('is-marquee')) return;
        const rail = document.createElement('div');
        rail.className = 'rail-move' + (idx % 2 ? ' rev' : '');
        shots.forEach(s => rail.appendChild(s));
        shots.forEach(s => {
          const c = s.cloneNode(true);
          c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1;
          rail.appendChild(c);
        });
        track.appendChild(rail);
        track.removeAttribute('tabindex');
        track.scrollLeft = 0;
        track.addEventListener('focusin', () => { track.scrollLeft = 0; });
        track.addEventListener('scroll', () => { if (track.scrollLeft) track.scrollLeft = 0; }, { passive: true });
        rail.style.setProperty('--dur', Math.max(28, shots.length * 9) + 's');
        g.classList.add('is-marquee');

        const ctl = $('.gallery-ctl', g);
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'g-pause'; btn.setAttribute('aria-label', 'Pause screenshots'); btn.setAttribute('aria-pressed', 'false');
        btn.append(icon('i-pause', 'M7 5h3.5v14H7zM13.5 5h3.5v14h-3.5z'), icon('i-play', 'M7 4l13 8-13 8z'));
        btn.addEventListener('click', () => {
          const p = g.classList.toggle('paused');
          btn.setAttribute('aria-pressed', String(p));
          btn.setAttribute('aria-label', p ? 'Play screenshots' : 'Pause screenshots');
        });
        ctl.hidden = false; ctl.appendChild(btn);

        if ('IntersectionObserver' in window) {
          new IntersectionObserver(es => g.classList.toggle('off', !es[0].isIntersecting), { rootMargin: '120px' }).observe(g);
        }
      });
    };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
    reducedMQ.addEventListener('change', () => { if (reducedMQ.matches) $$('[data-gallery].is-marquee').forEach(g => g.classList.add('paused')); });
  })();

  /* ═══════════════════ Scroll reveals ═══════════════════
     Content is visible by default; only elements below the fold get .r, and
     the class is removed again once the entrance has played. */
  (function reveals() {
    if (reduced() || !('IntersectionObserver' in window)) return;
    const groups = [
      ['.about-text > *', 70], ['.bar', 110], ['.edu-row', 110], ['.exp', 0], ['.proj-grid > .proj', 90],
      ['.proj-small > .proj', 100], ['.skills-grid > div', 120], ['.award-item', 70], ['.cert-item', 50],
      ['.contact-inner > *', 90], ['.h2', 0]
    ];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        e.target.classList.add('r-in');
        e.target.addEventListener('animationend', () => e.target.classList.remove('r', 'r-in'), { once: true });
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    groups.forEach(([sel, step]) => {
      $$(sel).forEach((el, i) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already on screen
        el.classList.add('r');
        el.style.setProperty('--d', Math.min(i, 5) * step + 'ms');
        io.observe(el);
      });
    });
  })();

  /* ═══════════════════ Certificate gallery (masonry, format kept) ═══════════════════ */
  const CERTIFICATES = [
    'WORLDQUANT CERT.png',
    'UDEMY BUSINESS ANALYSIS.png',
    'VICE LIST.png',
    'PPKOMP 2024 BRONZE AWARD.png',
    'EVENT MANAGEMENT PPI.png',
    'CISCO INTORDUCTION TO NETWORKING CERTIFICATE.png',
    '5G.png',
    'DATA SCIENCE WEEK MACHINE LEARNING.png',
    'ACCOUNTING 1.png',
    'MAYBANK.png',
    'PPIDK 1.png',
    'PPIDK 2.png',
    'DATA SCIENCE WEEK GIS.png',
    'DATACAMP-GITHUB.png',
    'GDSC.png',
    'IACD CERTIFICATE.png',
    'IELTS TEST REPORT.png',
    'JOGET PARTICIPATION.png',
    'MYSKILL DATA ANALYSIS BOOTCAMP.png',
    'MYSKILL MICROSOFT EXCEL BOOTCAMP.png',
    'SOLOLEARN JAVA 1.png',
    'SOLOLEARN JAVA 2.png',
    'VICE CHANCELLOR LIST 2.png',
    'VICE CHANCELLOR LIST 3.png',
    'WORLDQUANT BADGE.png',
    'WORLDQUANT BRONZE.png',
    'WORLDQUANT GOLD.png',
    'WORLDQUANT SILVER.png',
    'SPRINGBOARD.png'
  ];

  (function certGallery() {
    const masonry = $('#certMasonry');
    const countEl = $('#certCount');
    const toggle = $('#certGalleryToggle');
    const wrap = $('#certGalleryWrap');
    if (!masonry || !toggle || !wrap) return;

    const valid = CERTIFICATES.filter(f => f.trim() !== '');
    countEl.textContent = valid.length + ' certs';
    const units = $('#certUnits');
    if (units) {
      const NS = 'http://www.w3.org/2000/svg';
      valid.forEach(() => {
        const s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 32 40');
        const u = document.createElementNS(NS, 'use'); u.setAttribute('href', '#p-sheet'); s.appendChild(u); units.appendChild(s);
      });
    }
    valid.forEach(filename => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'cert-masonry-item';
      const img = document.createElement('img');
      img.src = 'assets/images/certificates/' + filename;
      img.alt = filename.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.onerror = () => { item.style.display = 'none'; };
      item.appendChild(img);
      item.addEventListener('click', () => openLightbox(img.src, img.alt, item));
      masonry.appendChild(item);
    });

    wrap.inert = true;
    toggle.addEventListener('click', () => {
      const open = !wrap.classList.contains('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      wrap.classList.toggle('open', open);
      wrap.inert = !open;
      $$('.cert-masonry-item', wrap).forEach((it, i) => {
        it.style.transitionDelay = open && !reduced() ? (i * 30) + 'ms' : '0ms';
      });
    });
  })();

  /* ═══════════════════ Transcript menu ═══════════════════ */
  (function transcript() {
    const wrap = $('#transcriptWrap');
    const btn = $('#transcriptBtn');
    const menu = $('#transcriptMenu');
    if (!wrap || !btn || !menu) return;
    const setOpen = open => {
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', e => { e.stopPropagation(); setOpen(menu.hidden); });
    document.addEventListener('click', e => { if (!menu.hidden && !wrap.contains(e.target)) setOpen(false); });
    wrap.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setOpen(false); btn.focus(); e.stopPropagation(); } });
    menu.addEventListener('click', () => setOpen(false));
  })();

  /* ═══════════════════ Skill lens: pick a skill, see where it was used ═══════════════════ */
  (function lens() {
    const items = $$('[data-lens]');
    const chips = $$('.skill-tag');
    const bar = $('#lensBar');
    if (!items.length || !chips.length || !bar) return;
    document.body.appendChild(bar);
    bar.setAttribute('role', 'status');

    const toks = s => s.toLowerCase().split(/[^a-z0-9+#]+/).filter(Boolean);
    const prefix = (a, b) => { const [s, l] = a.length <= b.length ? [a, b] : [b, a]; return s.length > 0 && s.every((t, i) => t === l[i]); };
    const itemPills = items.map(it => $$('.tech-pill', it).map(p => ({ el: p, t: toks(p.textContent) })));

    const matchesFor = chip => {
      const st = toks(chip.textContent);
      const hits = [];
      items.forEach((it, i) => {
        const lit = itemPills[i].filter(p => prefix(st, p.t));
        if (lit.length) hits.push({ it, lit: lit.map(p => p.el) });
      });
      return hits;
    };

    const cache = new Map();
    chips.forEach(chip => {
      const m = matchesFor(chip);
      cache.set(chip, m);
      if (!m.length) return;
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.setAttribute('aria-pressed', 'false');
      chip.title = 'Highlight where I used ' + chip.textContent.trim();
    });

    let active = null;
    const clear = () => {
      active = null;
      document.body.classList.remove('lens-on');
      items.forEach(it => it.classList.remove('is-hit', 'is-dim'));
      $$('.tech-pill.is-lit').forEach(p => p.classList.remove('is-lit'));
      chips.forEach(c => { if (c.hasAttribute('aria-pressed')) c.setAttribute('aria-pressed', 'false'); });
      bar.hidden = true;
    };
    const apply = chip => {
      if (active === chip) { clear(); return; }
      clear();
      active = chip;
      const hits = cache.get(chip);
      const hitSet = new Set(hits.map(h => h.it));
      document.body.classList.add('lens-on');
      items.forEach(it => it.classList.add(hitSet.has(it) ? 'is-hit' : 'is-dim'));
      hits.forEach(h => h.lit.forEach(p => p.classList.add('is-lit')));
      chip.setAttribute('aria-pressed', 'true');
      const name = chip.textContent.trim();
      bar.innerHTML = '';
      const msg = document.createElement('span');
      msg.innerHTML = '<b></b> used in ' + hits.length + (hits.length === 1 ? ' place' : ' places');
      $('b', msg).textContent = name;
      const go = document.createElement('button');
      go.type = 'button'; go.className = 'lens-go'; go.textContent = 'View projects';
      go.addEventListener('click', () => $('#projects').scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }));
      const x = document.createElement('button');
      x.type = 'button'; x.textContent = 'Clear';
      x.addEventListener('click', clear);
      bar.append(msg, go, x);
      bar.hidden = false;
    };

    chips.forEach(chip => {
      if (!chip.hasAttribute('role')) return;
      chip.addEventListener('click', () => apply(chip));
      chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); apply(chip); } });
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && active && lightbox.hidden && $('#palette').hidden) clear();
    });
  })();

  /* ═══════════════════ Jump-to palette (Ctrl/Cmd + K, or /) ═══════════════════ */
  (function palette() {
    const root = $('#palette');
    const input = $('#paletteInput');
    const list = $('#paletteList');
    const openBtn = $('#paletteOpen');
    if (!root || !input || !list) return;

    const go = id => () => document.getElementById(id).scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    const click = sel => () => { const a = $(sel); if (a) a.click(); };
    const entries = [
      { label: 'Home', hint: 'Section', run: go('home') },
      { label: 'About', hint: 'Section', run: go('about') },
      { label: 'Education', hint: 'Section', run: go('education') },
      { label: 'Experience', hint: 'Section', run: go('experience') },
      { label: 'Projects', hint: 'Section', run: go('projects') },
      { label: 'Skills', hint: 'Section', run: go('skills') },
      { label: 'Contact', hint: 'Section', run: go('contact') },
      { label: 'Download CV', hint: 'Download', run: click('.hero-actions a[download]') },
      { label: 'Get in touch', hint: 'Email', run: () => { location.href = 'mailto:' + EMAIL; } },
      { label: 'Tracker', hint: 'Page', run: () => { location.href = '/tracker'; } },
      { label: 'LinkedIn', hint: 'Link', run: () => { window.open('https://www.linkedin.com/in/ferdinandtslm', '_blank', 'noopener'); } }
    ];

    let shown = entries, sel = 0, opener = null;
    const render = () => {
      list.innerHTML = '';
      if (!shown.length) {
        const li = document.createElement('li'); li.className = 'empty'; li.textContent = 'Nothing matches'; list.appendChild(li);
        input.removeAttribute('aria-activedescendant'); return;
      }
      shown.forEach((en, i) => {
        const li = document.createElement('li');
        li.id = 'pal-' + i; li.setAttribute('role', 'option');
        li.setAttribute('aria-selected', String(i === sel));
        const s = document.createElement('span'); s.textContent = en.label;
        const h = document.createElement('small'); h.textContent = en.hint;
        li.append(s, h);
        li.addEventListener('pointermove', () => { if (sel !== i) { sel = i; mark(); } });
        li.addEventListener('click', () => choose(i));
        list.appendChild(li);
      });
      input.setAttribute('aria-activedescendant', 'pal-' + sel);
    };
    const mark = () => {
      $$('li', list).forEach((li, i) => li.setAttribute('aria-selected', String(i === sel)));
      input.setAttribute('aria-activedescendant', 'pal-' + sel);
      const cur = $('#pal-' + sel); if (cur) cur.scrollIntoView({ block: 'nearest' });
    };
    const open = () => {
      if (!root.hidden) return;
      opener = document.activeElement;
      root.hidden = false; lockScroll(true);
      input.value = ''; shown = entries; sel = 0; render(); input.focus();
    };
    const close = () => {
      if (root.hidden) return;
      root.hidden = true; lockScroll(false);
      if (opener && opener.focus) opener.focus();
    };
    const choose = i => { const en = shown[i]; if (!en) return; close(); setTimeout(en.run, 30); };

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      shown = q ? entries.filter(e => e.label.toLowerCase().includes(q)) : entries;
      sel = 0; render();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (shown.length) { sel = (sel + 1) % shown.length; mark(); } }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) { sel = (sel - 1 + shown.length) % shown.length; mark(); } }
      else if (e.key === 'Enter') { e.preventDefault(); choose(sel); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    root.addEventListener('click', e => { if (e.target === root) close(); });
    if (openBtn) openBtn.addEventListener('click', open);

    document.addEventListener('keydown', e => {
      const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); root.hidden ? open() : close(); }
      else if (e.key === '/' && !typing && root.hidden && lightbox.hidden) { e.preventDefault(); open(); }
      else if (e.key === 'Escape') {
        if (!root.hidden) { close(); }
        else if (!lightbox.hidden) { closeLightbox(); }
      }
    });
  })();
})();
