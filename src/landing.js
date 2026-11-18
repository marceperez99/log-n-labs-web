/* Log N Labs · service landings: hero demonstrations, scroll reveals, process track, mobile dock */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function onceVisible(el, fn, threshold) {
    if (!el) return;
    if (!hasIO || reduce) { fn(); return; }
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); fn(); }
    }, { threshold: threshold || 0.4 });
    io.observe(el);
  }

  /* ---------- marketing hero: the audience is halved five times ---------- */
  var funnel = document.querySelector('.funnel');
  if (funnel) {
    var cuts = Array.prototype.slice.call(funnel.querySelectorAll('.f-cut'));
    var cells = Array.prototype.slice.call(funnel.querySelectorAll('.f-cell'));
    var legend = Array.prototype.slice.call(document.querySelectorAll('.f-legend li'));
    var finish = function () {
      cuts.forEach(function (c) { c.style.setProperty('--k', '1'); });
      cells.concat(legend).forEach(function (el) { el.classList.add('on'); });
      funnel.classList.add('done');
    };
    if (reduce) finish();
    else {
      cuts.forEach(function (c) { c.style.setProperty('--k', '0'); });
      var showStep = function (i) {
        cells[i].classList.add('on');
        if (legend[i]) legend[i].classList.add('on');
      };
      onceVisible(funnel, function () {
        showStep(0);
        cuts.forEach(function (c, i) {
          setTimeout(function () {
            c.style.setProperty('--k', '1');
            setTimeout(function () { showStep(i + 1); }, 300);
          }, 500 + i * 620);
        });
        setTimeout(function () { funnel.classList.add('done'); }, 500 + cuts.length * 620 + 200);
      }, 0.3);
    }
  }

  /* ---------- software hero: the order collects payment, invoice and stock ---------- */
  var rec = document.querySelector('.rec-steps');
  if (rec) {
    var steps = Array.prototype.slice.call(rec.querySelectorAll('li'));
    if (reduce) steps.forEach(function (s) { s.classList.add('on'); });
    else onceVisible(rec, function () {
      steps.forEach(function (s, i) { setTimeout(function () { s.classList.add('on'); }, 500 + i * 900); });
    }, 0.3);
  }

  /* ---------- scroll reveals: fraction cuts, bullets ---------- */
  var revealTargets = document.querySelectorAll('.rail, .principles li');
  if (hasIO && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.35, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- statement lights up word by word as you scroll ---------- */
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

  /* ---------- process: track fills and steps light up with scroll ---------- */
  var pasos = document.getElementById('pasos');
  var pSteps = Array.prototype.slice.call(document.querySelectorAll('.pstep'));
  function procScroll(vh) {
    if (!pasos) return;
    var q = pasos.getBoundingClientRect();
    var k = Math.min(1, Math.max(0, (vh * 0.62 - q.top) / q.height));
    pasos.style.setProperty('--proc', reduce ? '1' : k.toFixed(4));
    pSteps.forEach(function (el) { el.classList.toggle('on', reduce || el.getBoundingClientRect().top < vh * 0.66); });
  }

  /* ---------- phones: action dock between the hero and the contact section ---------- */
  var dock = document.querySelector('.dock');
  var heroEl = document.querySelector('.lhero');
  var contactEl = document.getElementById('contacto');
  if (dock) document.body.classList.add('has-dock');
  function dockScroll(vh) {
    if (!dock) return;
    var pastHero = heroEl.getBoundingClientRect().bottom < 0;
    var atContact = contactEl.getBoundingClientRect().top < vh;
    var show = pastHero && !atContact;
    dock.classList.toggle('on', show);
    if (show) dock.removeAttribute('inert'); else dock.setAttribute('inert', '');
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      fillScroll(vh); procScroll(vh); dockScroll(vh);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
