/* Log N Labs · V3 Editorial — hero halving, rotator, reveals, accordion, form */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) doc.classList.add('reduce');

  // TODO(config): both come from env/config in production. Leave empty until the owner provides them.
  var WHATSAPP_NUMBER = ''; // international format, digits only, e.g. 5959XXXXXXXX
  var CONTACT_EMAIL = '';
  if (WHATSAPP_NUMBER) document.querySelectorAll('a.wa').forEach(function (a) { a.href = 'https://wa.me/' + WHATSAPP_NUMBER; });
  if (CONTACT_EMAIL) document.querySelectorAll('a.mail').forEach(function (a) { a.href = 'mailto:' + CONTACT_EMAIL; });

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
  var cellEls = ['.c1', '.c2', '.c3', '.c4', '.c5', '.c6', '.c7'].map(function (s) { return hero.querySelector(s); });
  var mobileMQ = window.matchMedia('(max-width: 767px)');

  function px(n) { return Math.round(n) + 'px'; }
  function layout() {
    var mobile = mobileMQ.matches;
    cellEls.forEach(function (el) { el.style.cssText = ''; });
    var W = hero.clientWidth, H = hero.clientHeight;
    var g = halvingCells(W, H, 6);
    g.lines.forEach(function (ln, i) {
      var el = cutEls[i];
      el.classList.toggle('v', ln.vertical);
      el.classList.toggle('h', !ln.vertical);
      el.style.left = px(ln.x); el.style.top = px(ln.y);
      if (ln.vertical) { el.style.height = px(ln.len); el.style.width = ''; }
      else { el.style.width = px(ln.len); el.style.height = ''; }
    });
    g.cells.forEach(function (c, i) {
      if (mobile && i < 6) return;
      var s = cellEls[i].style;
      s.left = px(c.x); s.top = px(c.y); s.width = px(c.w); s.height = px(c.h);
    });
  }

  var step = 0, timers = [];
  function setStep(k) {
    step = k;
    hero.setAttribute('data-step', String(k));
    for (var i = 0; i < 6; i++) cutEls[i].classList.toggle('on', i < k);
  }
  function showCell(i) { cellEls[i].classList.add('on'); }

  var SPEED = 700;
  function play() {
    if (reduce) {
      setStep(7);
      for (var i = 0; i < 6; i++) showCell(i);
      startRotation(0, true);
      return;
    }
    for (var k = 1; k <= 7; k++) {
      (function (k) {
        timers.push(setTimeout(function () {
          setStep(k);
          if (k <= 6) timers.push(setTimeout(function () { showCell(k - 1); }, Math.round(SPEED * 0.45)));
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

  cellEls[6].addEventListener('click', function () {
    document.getElementById('vision').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });

  layout();
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(layout, 80); });
  play();

  /* ---------- Fig. 1 log curve ---------- */
  var pts = [];
  for (var x = 0; x <= 480; x += 8) {
    var y = 260 - 48 * Math.log(1 + x / 12);
    pts.push((x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1));
  }
  document.getElementById('logPath').setAttribute('d', pts.join(' '));

  /* ---------- scroll reveals: fraction cuts, Fig. 1, process bars ---------- */
  var revealTargets = document.querySelectorAll('.rail, .fig, .steps');
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

  /* ---------- live clock, America/Asuncion ---------- */
  var clocks = document.querySelectorAll('.clock');
  var fmt;
  try { fmt = new Intl.DateTimeFormat('es-PY', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Asuncion' }); } catch (e) { fmt = null; }
  function tick() {
    if (!fmt) return;
    var now = new Date(), t = fmt.format(now);
    clocks.forEach(function (c) { c.textContent = t; c.setAttribute('datetime', now.toISOString()); });
  }
  tick(); setInterval(tick, 15000);

  /* ---------- contact form: live message builder + actions (UI only) ---------- */
  var form = document.getElementById('form');
  var status = document.getElementById('status');
  var msg = form.elements.mensaje;
  var chips = Array.prototype.slice.call(form.querySelectorAll('.chips button'));
  var userEdited = false;

  function joinEs(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
  }
  function buildMessage() {
    var name = form.elements.nombre.value.trim() || '[Nombre]';
    var areas = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })
      .map(function (b) { return b.getAttribute('data-area'); });
    var text = 'Hola, soy ' + name + '.';
    if (areas.length) text += ' Quisiéramos hablar de ' + joinEs(areas) + '.';
    return text;
  }
  function sync() {
    if (!userEdited) msg.value = buildMessage();
    var text = msg.value.trim() || buildMessage();
    var wa = document.getElementById('send-wa'), mail = document.getElementById('send-mail');
    wa.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    mail.href = 'mailto:' + CONTACT_EMAIL + '?subject=Consulta&body=' + encodeURIComponent(text);
  }
  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      sync();
    });
  });
  form.elements.nombre.addEventListener('input', sync);
  msg.addEventListener('input', function () { userEdited = msg.value.trim() !== ''; sync(); });
  sync();

  function setErr(input, text) {
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    if (text) { input.setAttribute('aria-invalid', 'true'); err.textContent = text; err.hidden = false; }
    else { input.removeAttribute('aria-invalid'); err.hidden = true; err.textContent = ''; }
    return !text;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = form.elements.nombre, contacto = form.elements.contacto;
    var c = contacto.value.trim();
    var okN = setErr(nombre, nombre.value.trim() ? '' : 'Decinos tu nombre o el de tu empresa.');
    var looksOk = /\S+@\S+\.\S+/.test(c) || c.replace(/\D/g, '').length >= 8;
    var okC = setErr(contacto, !c ? 'Dejanos un correo o un número para responderte.' : (looksOk ? '' : 'Revisá el correo o el número: no parece completo.'));
    if (!okN) { nombre.focus(); return; }
    if (!okC) { contacto.focus(); return; }
    // TODO(delivery): pluggable sender (email provider or webhook). Not decided yet.
    status.textContent = 'Prototipo: la consulta todavía no se envía.';
  });
  document.getElementById('copy').addEventListener('click', function () {
    var text = msg.value.trim() || buildMessage();
    function done() { status.textContent = 'Mensaje copiado.'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { msg.select(); document.execCommand('copy'); done(); });
    } else { msg.select(); document.execCommand('copy'); done(); }
  });
})();
