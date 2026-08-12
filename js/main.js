/* The Root and Stem — no dependencies.
   Header state · drawer · split-line reveals · scroll reveals ·
   parallax · scrollspy · single-open FAQ. All motion is opt-out
   via prefers-reduced-motion. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header  = document.getElementById('header');
  var burger  = document.querySelector('.burger');
  var drawer  = document.getElementById('drawer');

  /* ── 1. Split headings into animatable lines ──────────────
     Words are wrapped first, then grouped by their measured
     offsetTop so the mask follows real wrapping at any width. */
  function splitLines(el) {
    if (el.dataset.done) return;
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    var html = el.innerHTML;
    var hasEm = /<em>/i.test(html);

    // Rebuild as words, preserving a single <em>…</em> span if present.
    var emText = hasEm ? (html.match(/<em>(.*?)<\/em>/i) || [, ''])[1].replace(/<[^>]+>/g, '') : '';
    var emWords = emText ? emText.trim().split(' ') : [];

    el.textContent = '';
    var frag = document.createDocumentFragment();
    text.split(' ').forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'word';
      s.style.display = 'inline-block';
      s.textContent = w;
      if (emWords.indexOf(w) !== -1) s.style.fontStyle = 'italic';
      frag.appendChild(s);
      frag.appendChild(document.createTextNode(' '));
    });
    el.appendChild(frag);

    // Group words by line.
    var words = [].slice.call(el.querySelectorAll('.word'));
    var lines = [], cur = [], top = null;
    words.forEach(function (w) {
      var t = w.offsetTop;
      if (top === null) top = t;
      if (Math.abs(t - top) > 4) { lines.push(cur); cur = []; top = t; }
      cur.push(w);
    });
    if (cur.length) lines.push(cur);

    el.textContent = '';
    lines.forEach(function (lineWords, i) {
      var outer = document.createElement('span');
      outer.className = 'line';
      var inner = document.createElement('i');
      inner.textContent = lineWords.map(function (w) { return w.textContent; }).join(' ');
      outer.style.setProperty('--i', i);
      outer.appendChild(inner);
      el.appendChild(outer);
    });

    // Re-apply the italic emphasis on whichever line carries it.
    if (emText) {
      [].slice.call(el.querySelectorAll('.line > i')).forEach(function (i) {
        if (i.textContent.indexOf(emText.trim()) !== -1) {
          i.innerHTML = i.textContent.replace(emText.trim(), '<em>' + emText.trim() + '</em>');
        }
      });
    }
    el.dataset.done = '1';
  }

  var splits = [].slice.call(document.querySelectorAll('[data-split]'));
  /* Stash the original markup BEFORE splitting, so a resize can rebuild
     from the source rather than from already-split output. */
  splits.forEach(function (el) { el.dataset.raw = el.innerHTML; });
  if (!REDUCED) splits.forEach(splitLines);

  /* Re-split on resize so the line masks follow the new wrapping. */
  var rt, lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (REDUCED || window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(rt);
    rt = setTimeout(function () {
      splits.forEach(function (el) {
        var wasIn = el.classList.contains('in');
        el.innerHTML = el.dataset.raw;
        delete el.dataset.done;
        splitLines(el);
        if (wasIn) el.classList.add('in');
      });
    }, 220);
  });

  /* ── 2. Reveal on scroll ──────────────────────────────────── */
  if (!REDUCED && 'IntersectionObserver' in window) {
    document.querySelectorAll('.prose > p, .offer, .beats li, .agenda-row, .agenda-empty, .kin, .faq details, .sec-lead')
      .forEach(function (el) { el.classList.add('rise'); });
    document.querySelectorAll('.tenets').forEach(function (el) { el.classList.add('stagger'); });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('[data-split], .frame, .rise, .stagger, .reveal-fade')
      .forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('[data-split], .reveal-fade, .frame').forEach(function (el) { el.classList.add('in'); });
  }

  /* Hero animates immediately rather than on intersection. */
  requestAnimationFrame(function () {
    document.querySelectorAll('.hero [data-split], .hero .reveal-fade')
      .forEach(function (el) { el.classList.add('in'); });
  });

  /* ── 3. Parallax ──────────────────────────────────────────── */
  var layers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function parallax() {
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.dataset.parallax) || 0;
      var progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = 'translate3d(0,' + (progress * speed * 100).toFixed(2) + 'px,0)';
    });
    ticking = false;
  }

  function onScroll() {
    header.classList.toggle('stuck', window.scrollY > 40);
    if (!ticking && !REDUCED && layers.length) {
      ticking = true;
      requestAnimationFrame(parallax);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
  if (!REDUCED) parallax();

  /* ── 4. Drawer ────────────────────────────────────────────── */
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) header.classList.add('stuck');
    });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) closeDrawer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 940) closeDrawer(); });
  }

  /* ── 5. Scrollspy ─────────────────────────────────────────── */
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-46% 0px -50% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ── 6. FAQ: one open at a time ───────────────────────────── */
  var faqs = [].slice.call(document.querySelectorAll('.faq details'));
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ── 7. Sundries ──────────────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Until an email provider is wired up, the form still works: it hands the
     address off to the user's mail client, pre-addressed and pre-written.
     Set action= to a real endpoint and this fallback switches itself off. */
  var form = document.querySelector('.signup');
  if (form && form.getAttribute('action') === '#') {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var addr = (input && input.value || '').trim();
      if (!addr || addr.indexOf('@') < 1) {
        if (input) { input.focus(); input.setAttribute('aria-invalid', 'true'); }
        return;
      }
      input.removeAttribute('aria-invalid');
      window.location.href =
        'mailto:hello@therootandstem.com' +
        '?subject=' + encodeURIComponent('Add me to the list') +
        '&body='    + encodeURIComponent('Please add ' + addr + ' to the mailing list.\n\n');
      var note = document.querySelector('.join-alt');
      if (note) note.textContent = 'Opening your email app — send that message and you’re on the list.';
    });
  }
})();
