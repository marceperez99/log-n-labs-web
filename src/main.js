/* Log N Labs · V7 Combinado — hero halving, rotator, scroll fill, servicios, proceso, equipo (contact.js: links, clock, form) */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) doc.classList.add('reduce');

  /* ---------- hero geometry (port of geom() from Main.dc.html) ---------- */
  function halvingCells(W, H, cuts) {
    var r = { x: 0, y: 0, w: W, h: H }, cells = [], lines = [];
    for (var i = 0; i < cuts; i++) {
      if (r.w >= r.h) {
        var w = r.w / 2;
        cells.push({ x: r.x, y: r.y, w: w, h: r.h });
        lines.push({ vertical: true, x: r.x + w, y: r.y, len: r.h });
        r = { x: r.x + w, y: r.y, w: w, h: r.h };
      } else {
        var h = r.h / 2;
        cells.push({ x: r.x, y: r.y, w: r.w, h: h });
        lines.push({ vertical: false, x: r.x, y: r.y + h, len: r.w });
        r = { x: r.x, y: r.y + h, w: r.w, h: h };
      }
    }
    cells.push(r);
    return { cells: cells, lines: lines };
  }

  var hero = document.querySelector('.hero');
  var cutEls = Array.prototype.slice.call(hero.querySelectorAll('.cut'));
  var cellEls = ['.c1', '.c2', '.c3', '.c4', '.c7'].map(function (s) { return hero.querySelector(s); });
  // Stacked hero: phones, portrait tablets, landscape phones (same query as styles.css).
  var mobileMQ = window.matchMedia('(max-width: 1023px), (max-height: 560px)');

  function px(n) { return Math.round(n) + 'px'; }
  // Mobile: the content stacks, so the halving runs in a band at the foot of the hero
  // (keep in sync with the hero's bottom padding in styles.css) instead of across the text.
  var MOBILE_BAND = 176;
  function layout() {
    var mobile = mobileMQ.matches;
    cellEls.forEach(function (el) { el.style.cssText = ''; });
    var W = hero.clientWidth, H = hero.clientHeight;
    var y0 = mobile ? H - MOBILE_BAND : 0;
    var g = halvingCells(W, H - y0, mobile ? 3 : 4);
    if (mobile) g.lines.unshift({ vertical: false, x: 0, y: 0, len: W });
    cutEls.forEach(function (el, i) {
      var ln = g.lines[i];
      el.style.display = ln ? '' : 'none';
      if (!ln) return;
      el.classList.toggle('v', ln.vertical);
      el.classList.toggle('h', !ln.vertical);
      el.style.left = px(ln.x); el.style.top = px(y0 + ln.y);
      if (ln.vertical) { el.style.height = px(ln.len); el.style.width = ''; }
      else { el.style.width = px(ln.len); el.style.height = ''; }
    });
    g.cells.forEach(function (c, i) {
      // mobile band: lines only; the cells stay out of it
      var el = mobile ? null : cellEls[i];
      if (!el) return;
      var s = el.style;
      s.left = px(c.x); s.top = px(y0 + c.y); s.width = px(c.w); s.height = px(c.h);
    });
    hero.classList.add('laid');
  }

  var step = 0, timers = [];
  function setStep(k) {
    step = k;
    hero.setAttribute('data-step', String(k));
    for (var i = 0; i < cutEls.length; i++) cutEls[i].classList.toggle('on', i < k);
  }
  function showCell(i) { cellEls[i].classList.add('on'); }

  var SPEED = 700;
  function play() {
    if (reduce) {
      setStep(5);
      for (var i = 0; i < 4; i++) showCell(i);
      startRotation(0, true);
      return;
    }
    for (var k = 1; k <= 5; k++) {
      (function (k) {
        timers.push(setTimeout(function () {
          setStep(k);
          if (k <= 4) timers.push(setTimeout(function () { showCell(k - 1); }, Math.round(SPEED * 0.45)));
        }, 600 + (k - 1) * SPEED));
      })(k);
    }
    timers.push(setTimeout(function () { rotStarted = true; if (heroVisible) startRotation(0); }, 600 + SPEED + Math.round(SPEED * 0.45)));
  }

  /* ---------- services rotator ---------- */
  var HOLD = 4500;
  var groups = Array.prototype.slice.call(hero.querySelectorAll('.group'));
  var barBtns = Array.prototype.slice.call(hero.querySelectorAll('.bars button'));
  var counter = hero.querySelector('.counter b');
  var cat = 0, rotT = null, rotStarted = false, heroVisible = true;
  hero.style.setProperty('--hold', HOLD + 'ms');

  function render(i) {
    groups.forEach(function (g, j) {
      var was = g.classList.contains('is-on');
      g.classList.toggle('is-on', j === i);
      g.classList.toggle('is-out', was && j !== i);
      if (j === i) g.removeAttribute('aria-hidden'); else g.setAttribute('aria-hidden', 'true');
    });
    barBtns.forEach(function (b, j) {
      b.classList.toggle('done', j < i);
      if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    counter.textContent = String(i + 1);
  }
  function startRotation(i, noAuto) {
    clearTimeout(rotT);
    cat = i;
    // restart the fill: clear current, force reflow, set again
    barBtns.forEach(function (b) { b.removeAttribute('aria-current'); });
    void hero.offsetWidth;
    render(i);
    if (reduce || noAuto) return;
    rotT = setTimeout(function () { startRotation((i + 1) % 3); }, HOLD);
  }
  barBtns.forEach(function (b, j) {
    b.addEventListener('click', function () { rotStarted = true; startRotation(j); });
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      if (!rotStarted || reduce) return;
      if (heroVisible) startRotation(cat); else clearTimeout(rotT);
    }, { threshold: 0.15 }).observe(hero);
  }

  cellEls[4].addEventListener('click', function () {
    document.getElementById('enfoque').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  layout();
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(layout, 80); });
  play();

  /* ---------- scroll reveals: fraction cuts, problem bullets ---------- */
  var revealTargets = document.querySelectorAll('.rail, .principles li');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 1/2: statement lights up word by word as you scroll ---------- */
  var fillEl = document.querySelector('[data-fill]'), words = [], lit = -1;
  if (fillEl) {
    var plain = fillEl.textContent.trim();
    fillEl.setAttribute('aria-label', plain);
    fillEl.innerHTML = plain.split(/\s+/).map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    words = Array.prototype.slice.call(fillEl.querySelectorAll('.w'));
    if (reduce) words.forEach(function (w) { w.classList.add('lit'); });
  }
  function fillScroll(vh) {
    if (!words.length || reduce) return;
    var f = fillEl.getBoundingClientRect();
    var t = Math.min(1, Math.max(0, (vh * 0.85 - f.top) / (vh * 0.45 + f.height)));
    var n = Math.round(t * words.length);
    if (n !== lit) { lit = n; words.forEach(function (w, i) { w.classList.toggle('lit', i < n); }); }
  }

  /* ---------- 1/4 servicios: rows open in turn while scrolling ---------- */
  var solSec = document.querySelector('.sol-sec');
  var solPin = solSec.querySelector('.sol-pin');
  var solBtns = Array.prototype.slice.call(solSec.querySelectorAll('.sol-b'));
  var solPanels = Array.prototype.slice.call(solSec.querySelectorAll('.sol-p'));
  var solArts = Array.prototype.slice.call(solSec.querySelectorAll('.art'));
  var solCount = solSec.querySelector('.sol-count b');
  var solCap = solSec.querySelector('.sol-art-cap');
  var solNames = ['consultoría', 'software', 'marketing'];
  var pinMQ = window.matchMedia('(min-width: 1024px) and (min-height: 640px)');
  var solMode = '', solIdx = -1, solOpened = [true, false, false];

  function solSet(i) {
    if (i === solIdx) return;
    solIdx = i;
    solBtns.forEach(function (b, j) { b.setAttribute('aria-expanded', String(j === i)); });
    solPanels.forEach(function (p, j) { p.classList.toggle('on', j === i); });
    solArts.forEach(function (a, j) { a.classList.toggle('on', j === i); });
    solCount.textContent = '0' + (i + 1);
    solCap.innerHTML = 'Lámina <b>' + (i + 1) + '</b> · ' + solNames[i];
  }
  function solApplyMode() {
    var m = (pinMQ.matches && !reduce) ? 'pinned' : 'stacked';
    if (m === solMode) return;
    solMode = m;
    solSec.classList.toggle('pinned', m === 'pinned');
    solSec.classList.toggle('stacked', m === 'stacked');
    if (m === 'stacked') {
      solIdx = -1;
      solPanels.forEach(function (p, j) {
        var open = reduce || solOpened[j];
        p.classList.toggle('on', open);
        solBtns[j].setAttribute('aria-expanded', String(open));
      });
    } else { solIdx = -1; solSet(0); }
  }
  function solScroll(vh) {
    if (solMode === 'pinned') {
      var r = solPin.getBoundingClientRect();
      var span = r.height - vh;
      var p = span > 0 ? Math.min(.999, Math.max(0, -r.top / span)) : 0;
      solSet(Math.floor(p * 3));
    } else if (!reduce) {
      // open each row once it reaches the lower third; never collapse (no layout jump)
      solBtns.forEach(function (b, j) {
        if (!solOpened[j] && b.getBoundingClientRect().top < vh * 0.7) {
          solOpened[j] = true;
          solPanels[j].classList.add('on');
          b.setAttribute('aria-expanded', 'true');
        }
      });
    }
  }
  solBtns.forEach(function (b, j) {
    b.addEventListener('click', function () {
      if (solMode === 'pinned') {
        // jump the scroll to that row's segment so scroll and state stay in sync
        var top = solPin.getBoundingClientRect().top + window.pageYOffset;
        var span = solPin.offsetHeight - window.innerHeight;
        window.scrollTo({ top: top + span * (j + 0.5) / 3, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        var open = !solPanels[j].classList.contains('on');
        solOpened[j] = true;
        solPanels[j].classList.toggle('on', open);
        b.setAttribute('aria-expanded', String(open));
      }
    });
  });
  solApplyMode();
  (pinMQ.addEventListener ? pinMQ.addEventListener('change', solApplyMode) : pinMQ.addListener(solApplyMode));

  /* ---------- 1/16 proceso: track fills and steps light up with scroll ---------- */
  var pasos = document.getElementById('pasos');
  var pSteps = Array.prototype.slice.call(document.querySelectorAll('.pstep'));
  function procScroll(vh) {
    var q = pasos.getBoundingClientRect();
    var k = Math.min(1, Math.max(0, (vh * 0.62 - q.top) / q.height));
    pasos.style.setProperty('--proc', reduce ? '1' : k.toFixed(4));
    pSteps.forEach(function (el) { el.classList.toggle('on', reduce || el.getBoundingClientRect().top < vh * 0.66); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      fillScroll(vh); solScroll(vh); procScroll(vh);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 1/32 equipo: one panel open, auto-advances until the visitor takes over ---------- */
  var rolesBox = document.querySelector('.roles');
  var roleEls = Array.prototype.slice.call(rolesBox.querySelectorAll('.role-p'));
  var role = 0, roleAuto = true, rolesVisible = false;
  var wideMQ = window.matchMedia('(min-width: 1101px)');
  var listMQ = window.matchMedia('(max-width: 1100px)'); // panels stack: plain list (styles.css)
  // Where the panels stack they become a plain list with every description shown.
  function roleSet(i) {
    role = i;
    var list = listMQ.matches;
    roleEls.forEach(function (el, j) {
      el.classList.toggle('on', j === i);
      el.setAttribute('aria-expanded', String(list || j === i));
    });
  }
  roleSet(0);
  listMQ.addEventListener('change', function () { roleSet(role); });
  function roleTake(e) {
    if (listMQ.matches) return;
    var b = e.target.closest ? e.target.closest('.role-p') : null;
    if (!b) return;
    var i = roleEls.indexOf(b);
    if (roleAuto) { roleAuto = false; rolesBox.classList.add('manual'); }
    if (i !== role) roleSet(i);
  }
  ['mouseover', 'focusin', 'click'].forEach(function (ev) { rolesBox.addEventListener(ev, roleTake); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { rolesVisible = en[0].isIntersecting; }, { threshold: 0.3 }).observe(rolesBox);
  }
  if (reduce) rolesBox.classList.add('manual');
  else setInterval(function () { if (roleAuto && rolesVisible && wideMQ.matches) roleSet((role + 1) % roleEls.length); }, 5000);

})();
