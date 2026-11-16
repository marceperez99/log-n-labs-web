/* Log N Labs · V1 Preciso — hero halving, services rotator, menu, clock, statement, form. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hero = document.querySelector('.hero');
  var cuts = Array.prototype.slice.call(hero.querySelectorAll('.cut'));
  var cells = Array.prototype.slice.call(hero.querySelectorAll('.cell'));
  var finalCell = hero.querySelector('.final');

  var DELAY = 600, STEP = 700, CUTS = 6;

  /* ---------- geometry: always cut across the longer side ---------- */
  function halvingCells(W, H, n) {
    var r = { x: 0, y: 0, w: W, h: H }, out = [], lines = [];
    for (var i = 0; i < n; i++) {
      if (r.w >= r.h) {
        var w = r.w / 2;
        out.push({ x: r.x, y: r.y, w: w, h: r.h });
        lines.push({ v: true, x: r.x + w, y: r.y, len: r.h });
        r = { x: r.x + w, y: r.y, w: w, h: r.h };
      } else {
        var h = r.h / 2;
        out.push({ x: r.x, y: r.y, w: r.w, h: h });
        lines.push({ v: false, x: r.x, y: r.y + h, len: r.w });
        r = { x: r.x, y: r.y + h, w: r.w, h: h };
      }
    }
    out.push(r);
    return { cells: out, lines: lines };
  }

  /* snap edges to whole pixels so every cut is a crisp 1px */
  function snap(c) {
    var x0 = Math.round(c.x), y0 = Math.round(c.y);
    return { x: x0, y: y0, w: Math.round(c.x + c.w) - x0, h: Math.round(c.y + c.h) - y0 };
  }

  function isGrid() {
    var W = window.innerWidth, H = window.innerHeight;
    return W >= 1024 && H >= 600 && W / H >= 1.2;
  }

  function place(el, r) {
    el.style.left = r.x + 'px'; el.style.top = r.y + 'px';
    el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
  }

  var lastKey = '';
  function layout() {
    var mode = isGrid() ? 'grid' : 'stack';
    if (hero.dataset.mode !== mode) {
      hero.dataset.mode = mode;
      if (mode === 'grid') closeMenu();
    }
    if (mode === 'stack') cells.forEach(function (c) { if (c !== finalCell) c.removeAttribute('style'); });

    var W = hero.clientWidth, H = hero.clientHeight;
    var key = mode + W + 'x' + H;
    if (key === lastKey) return;
    lastKey = key;

    var g = halvingCells(W, H, CUTS);
    g.lines.forEach(function (l, i) {
      var el = cuts[i];
      el.removeAttribute('data-v'); el.removeAttribute('data-h');
      el.setAttribute(l.v ? 'data-v' : 'data-h', '');
      var x = Math.round(l.x), y = Math.round(l.y), len = Math.round(l.len);
      el.style.left = (l.v ? x : x) + 'px';
      el.style.top = y + 'px';
      el.style.width = l.v ? '1px' : len + 'px';
      el.style.height = l.v ? len + 'px' : '1px';
    });
    var fin = snap(g.cells[CUTS]);
    // the final cell sits just inside the cut lines
    var fr = { x: fin.x + 1, y: fin.y + 1, w: fin.w - 1, h: fin.h - 1 };
    place(finalCell, fr);
    if (mode === 'grid') {
      for (var i = 0; i < CUTS; i++) place(cells[i], snap(g.cells[i]));
    } else {
      hero.style.setProperty('--final-h', Math.ceil(fin.h) + 'px');
    }
  }

  /* ---------- sequence ---------- */
  var timers = [];
  function setStep(k) {
    for (var i = 0; i < CUTS; i++) {
      cuts[i].classList.toggle('is-on', i < k);
      cells[i].classList.toggle('is-on', i < k);
    }
    finalCell.classList.toggle('is-on', k > CUTS);
    if (k >= 2) rotator.start();
  }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    if (reduce.matches) {
      document.documentElement.classList.add('is-reduced');
      hero.classList.add('is-instant');
      setStep(CUTS + 1);
      return;
    }
    setStep(0);
    for (var k = 1; k <= CUTS + 1; k++) {
      (function (s) { timers.push(setTimeout(function () { setStep(s); }, DELAY + (s - 1) * STEP)); })(k);
    }
  }

  /* ---------- services rotator ---------- */
  var rotator = (function () {
    var root = hero.querySelector('[data-rotator]');
    var groups = Array.prototype.slice.call(root.querySelectorAll('[data-group]'));
    var bars = Array.prototype.slice.call(root.querySelectorAll('.rot__bar'));
    var count = root.querySelector('[data-count]');
    var pauseBtn = root.querySelector('.rot__pause');
    var HOLD = 4500, cat = 0, timer = null, started = false;
    var userPaused = false, hover = false, inView = true;

    function show(i) {
      var prev = cat;
      cat = i;
      groups.forEach(function (g, j) {
        g.classList.toggle('is-active', j === i);
        g.classList.toggle('is-prev', j === prev && j !== i);
        g.setAttribute('aria-hidden', j === i ? 'false' : 'true');
        if ('inert' in g) g.inert = j !== i;
      });
      bars.forEach(function (b, j) {
        if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      count.textContent = (i + 1) + '/' + groups.length;
    }
    function schedule() {
      clearTimeout(timer);
      if (!started || userPaused || hover || !inView || reduce.matches || document.hidden) return;
      timer = setTimeout(function () { show((cat + 1) % groups.length); schedule(); }, HOLD);
    }
    bars.forEach(function (b, j) {
      b.addEventListener('click', function () { if (j !== cat) show(j); schedule(); });
    });
    pauseBtn.addEventListener('click', function () {
      userPaused = !userPaused;
      pauseBtn.setAttribute('aria-pressed', String(userPaused));
      pauseBtn.setAttribute('aria-label', userPaused ? 'Reanudar rotación' : 'Pausar rotación');
      schedule();
    });
    root.addEventListener('pointerenter', function () { hover = true; schedule(); });
    root.addEventListener('pointerleave', function () { hover = false; schedule(); });
    root.addEventListener('focusin', function () { hover = true; schedule(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { hover = false; schedule(); } });
    document.addEventListener('visibilitychange', schedule);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; schedule(); }, { threshold: 0.15 }).observe(hero);
    }
    groups.forEach(function (g, j) { if ('inert' in g) g.inert = j !== 0; });
    return {
      start: function () {
        if (started) return;
        started = true;
        // rotation begins once cell 2 has finished appearing
        timer = setTimeout(schedule, reduce.matches ? 0 : Math.round(STEP * 0.45));
      }
    };
  })();

  /* ---------- mobile menu ---------- */
  var menuBtn = hero.querySelector('.menu-btn');
  var menu = document.getElementById('menu-panel');
  function closeMenu() {
    menu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    menu.hidden = open; menuBtn.setAttribute('aria-expanded', String(!open));
    if (!open) { var f = menu.querySelector('a'); if (f) f.focus(); }
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !menu.hidden) { closeMenu(); menuBtn.focus(); }
  });

  /* ---------- boot ---------- */
  layout();
  play();
  var raf = 0;
  function queue() { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); }
  window.addEventListener('resize', queue);
  if ('ResizeObserver' in window) new ResizeObserver(queue).observe(hero);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
  reduce.addEventListener && reduce.addEventListener('change', function () { if (reduce.matches) play(); });

  /* ---------- live clock (America/Asuncion) ---------- */
  var clocks = Array.prototype.slice.call(document.querySelectorAll('[data-clock]'));
  var fmt;
  try { fmt = new Intl.DateTimeFormat('es-PY', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Asuncion' }); } catch (e) { fmt = null; }
  function tick() {
    if (!fmt) return;
    var t = fmt.format(new Date());
    clocks.forEach(function (c) { c.textContent = t; c.setAttribute('datetime', t); });
  }
  tick(); setInterval(tick, 15000);

  /* ---------- visión: the statement lights up word by word on scroll ---------- */
  var st = document.querySelector('[data-light]');
  if (st) {
    var words = st.textContent.trim().split(/\s+/);
    st.setAttribute('aria-label', st.textContent.trim());
    st.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    var spans = Array.prototype.slice.call(st.querySelectorAll('.w'));
    var lightAll = function () { spans.forEach(function (s) { s.classList.add('is-lit'); }); };
    if (reduce.matches || !('IntersectionObserver' in window)) lightAll();
    else {
      var ticking = false;
      var update = function () {
        ticking = false;
        var r = st.getBoundingClientRect(), vh = window.innerHeight;
        // 0 when the block's top reaches 85% of the viewport, 1 when its bottom reaches 45%
        var p = (vh * 0.85 - r.top) / (vh * 0.4 + r.height);
        var n = Math.round(Math.max(0, Math.min(1, p)) * spans.length);
        spans.forEach(function (s, i) { s.classList.toggle('is-lit', i < n); });
      };
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      update();
    }
  }

  /* ---------- contact form: live message builder (UI only; no backend) ---------- */
  var form = document.querySelector('[data-form]');
  var status = form.querySelector('[data-status]');
  var msg = form.elements.mensaje;
  var touched = false;
  var WA = 'https://wa.me/%%WHATSAPP_NUMBER%%';   // inyectado en el build desde config/.env
  var MAIL = '%%CONTACT_EMAIL%%';                  // inyectado en el build desde config/.env
  function joinEs(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
  }
  function build() {
    var name = form.elements.nombre.value.trim() || '[Nombre]';
    var areas = Array.prototype.slice.call(form.querySelectorAll('input[name=interes]:checked')).map(function (c) { return c.value; });
    var text = 'Hola, soy ' + name + '.';
    if (areas.length) text += ' Quisiera consultar sobre ' + joinEs(areas) + '.';
    return text;
  }
  function sync() {
    if (!touched) msg.value = build();
    var text = encodeURIComponent(msg.value);
    form.querySelector('[data-wa]').href = WA + '?text=' + text;
    form.querySelector('[data-mail]').href = 'mailto:' + MAIL + '?subject=Consulta&body=' + text;
  }
  form.addEventListener('input', function (e) {
    if (e.target === msg) touched = msg.value.trim() !== '';
    sync();
  });
  form.addEventListener('change', sync);
  sync();

  form.querySelector('[data-copy]').addEventListener('click', function () {
    var done = function () { status.textContent = 'Mensaje copiado.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg.value).then(done, function () { msg.select(); document.execCommand('copy'); done(); });
    else { msg.select(); document.execCommand('copy'); done(); }
  });

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[\d\s().-]{7,}$/;
  function check(input, ok) {
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (err) err.hidden = ok;
    return ok;
  }
  function validName(v) { return v.trim().length > 1; }
  function validContact(v) { v = v.trim(); return EMAIL.test(v) || PHONE.test(v); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.nombre, contact = form.elements.contacto;
    var a = check(name, validName(name.value));
    var b = check(contact, validContact(contact.value));
    if (!a) { name.focus(); return; }
    if (!b) { contact.focus(); return; }
    // TODO: conectar el envío (proveedor de correo o webhook).
    status.textContent = 'Prototipo: la consulta todavía no se envía.';
  });
  [['nombre', validName], ['contacto', validContact]].forEach(function (pair) {
    form.elements[pair[0]].addEventListener('input', function () {
      if (this.getAttribute('aria-invalid') === 'true') check(this, pair[1](this.value));
    });
  });
})();
