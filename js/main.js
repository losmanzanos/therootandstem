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
    var html = el.innerHTML;

    /* An explicit <br> is an authored line break — honour it exactly
       instead of measuring where the text happens to wrap. */
    if (/<br\s*\/?>/i.test(html)) {
      var chunks = html.split(/<br\s*\/?>/i);
      el.textContent = '';
      chunks.forEach(function (chunk, i) {
        var outer = document.createElement('span');
        outer.className = 'line';
        outer.style.setProperty('--i', i);
        var inner = document.createElement('i');
        inner.innerHTML = chunk.trim();
        outer.appendChild(inner);
        el.appendChild(outer);
      });
      el.dataset.done = '1';
      return;
    }

    var text = el.textContent.replace(/\s+/g, ' ').trim();
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

    /* Text can reveal the moment it enters view. */
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('[data-split], .rise, .stagger, .reveal-fade')
      .forEach(function (el) { io.observe(el); });

    /* Images are different: if the reveal fires before the bytes land you
       watch an empty box wipe in and then the photo pops. So start the
       observer well ahead of the viewport, and hold the reveal until the
       image has actually decoded. */
    var imgIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var frame = e.target;
        obs.unobserve(frame);
        var img = frame.querySelector('img');
        if (!img) { frame.classList.add('in'); return; }

        var show = function () { frame.classList.add('in'); };
        if (img.complete && img.naturalWidth) {
          (img.decode ? img.decode().catch(function () {}) : Promise.resolve()).then(show);
        } else {
          img.addEventListener('load', function () {
            (img.decode ? img.decode().catch(function () {}) : Promise.resolve()).then(show);
          }, { once: true });
          img.addEventListener('error', show, { once: true });
        }
      });
    }, { rootMargin: '600px 0px 400px 0px', threshold: 0 });

    document.querySelectorAll('.frame').forEach(function (el) { imgIO.observe(el); });
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


  /* ── 8. "bloom" ───────────────────────────────────────────
     The headline says "before the bloom". Type the word and the
     bud in the mark opens. Nothing else on the page announces it. */
  (function () {
    var buf = '', WORD = 'bloom';
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (!/^[a-z]$/i.test(e.key)) return;
      buf = (buf + e.key.toLowerCase()).slice(-WORD.length);
      if (buf !== WORD || document.body.classList.contains('bloomed')) return;
      document.body.classList.add('bloomed');
      var note = document.querySelector('.egg-note');
      if (note) note.hidden = false;
      var mark = document.querySelector('.brand-mark');
      if (mark) { mark.setAttribute('role','img'); mark.setAttribute('aria-label','The mark, now in bloom'); }
    });
  })();


  /* ── 9. Daylight in Denver ────────────────────────────────
     Sunrise/sunset from the NOAA solar equations, computed on the
     visitor's machine. No API, no key, no request — and it changes
     every day of the year. Denver: 39.7392 N, 104.9903 W. */
  (function () {
    var box = document.getElementById('daylight');
    if (!box) return;

    var LAT = 39.7392, LON = -104.9903;
    var rad = Math.PI / 180;

    function dayLength(date) {
      // days since 2000-01-01 12:00 UT
      var n = Math.floor((date - Date.UTC(2000, 0, 1, 12)) / 86400000);
      var Jstar = n - LON / 360;
      var M = (357.5291 + 0.98560028 * Jstar) % 360;                 // solar mean anomaly
      var C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad)
            + 0.0003 * Math.sin(3 * M * rad);                        // equation of the centre
      var L = (M + C + 180 + 102.9372) % 360;                        // ecliptic longitude
      var Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(M * rad)
            - 0.0069 * Math.sin(2 * L * rad);
      var decl = Math.asin(Math.sin(L * rad) * Math.sin(23.44 * rad));
      // −0.833° accounts for refraction and the sun's disc
      var cosW = (Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(decl)) /
                 (Math.cos(LAT * rad) * Math.cos(decl));
      if (cosW >= 1) return null;              // polar night
      if (cosW <= -1) return { len: 1440, rise: null, set: null };   // midnight sun
      var w = Math.acos(cosW) / rad;
      var Jset  = Jtransit + w / 360;
      var Jrise = Jtransit - w / 360;
      return {
        len:  (Jset - Jrise) * 1440,                                  // minutes
        rise: new Date((Jrise - 2440587.5) * 86400000),
        set:  new Date((Jset  - 2440587.5) * 86400000)
      };
    }

    var now = new Date();
    var today = dayLength(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    var prev  = dayLength(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    if (!today || !prev) return;

    var h = Math.floor(today.len / 60), m = Math.round(today.len % 60);
    if (m === 60) { h += 1; m = 0; }
    document.getElementById('dl-len').textContent =
      h + ' hours ' + m + ' minutes of daylight.';

    var diff = Math.round((today.len - prev.len) * 60);   // seconds
    var a = Math.abs(diff), mm = Math.floor(a / 60), ss = a % 60;
    var amount = mm ? (mm + ' min ' + ss + ' sec') : (ss + ' seconds');
    document.getElementById('dl-delta').textContent =
      diff === 0 ? 'The same as yesterday.'
      : diff > 0 ? amount + ' more than yesterday.'
                 : amount + ' less than yesterday.';

    if (today.rise && today.set) {
      var fmt = function (d) {
        return d.toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver'
        }).toLowerCase().replace(' ', '');
      };
      document.getElementById('dl-rise').textContent = 'Sunrise ' + fmt(today.rise);
      document.getElementById('dl-set').textContent  = 'Sunset '  + fmt(today.set);
    }
    box.hidden = false;
  })();

  /* ── 7. Sundries ──────────────────────────────────────────── */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ── Signup ───────────────────────────────────────────────
     Posts to Kit with fetch() so the visitor never leaves the page. Kit's
     embed script would do this too, but pulling in third-party JS for one
     POST isn't worth it. Degrades in three stages:
       · fetch succeeds        → inline confirmation
       · fetch fails / no JS   → ordinary form POST to Kit (still subscribes)
       · action still "#"      → hands off to the visitor's mail client      */
  var form = document.querySelector('.signup');

  function say(msg) {
    var note = document.querySelector('.join-alt');
    if (note) note.textContent = msg;
  }

  if (form) {
    var action = form.getAttribute('action');

    form.addEventListener('submit', function (e) {
      var input = form.querySelector('input[type="email"]');
      var addr = (input && input.value || '').trim();

      if (!addr || addr.indexOf('@') < 1) {
        e.preventDefault();
        if (input) { input.focus(); input.setAttribute('aria-invalid', 'true'); }
        return;
      }
      if (input) input.removeAttribute('aria-invalid');

      /* No endpoint yet — fall back to the visitor's mail client. */
      if (action === '#') {
        e.preventDefault();
        window.location.href =
          'mailto:hello@therootandstem.com' +
          '?subject=' + encodeURIComponent('Add me to the list') +
          '&body='    + encodeURIComponent('Please add ' + addr + ' to the mailing list.\n\n');
        say('Opening your email app — send that message and you’re on the list.');
        return;
      }

      /* No fetch (very old browser) — let the native POST happen. */
      if (!window.fetch) return;

      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Adding…'; }

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.innerHTML = '<p class="signup-done">You’re on the list. ' +
            'Watch for a confirmation email — it decides whether the rest arrive.</p>';
          say('');
        })
        .catch(function () {
          /* Network or CORS trouble: submit the old-fashioned way rather than
             losing the address. Kit will render its own confirmation page. */
          if (btn) { btn.disabled = false; btn.textContent = label; }
          form.submit();
        });
    });
  }
})();
