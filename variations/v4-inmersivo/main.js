/* Log N Labs · V4 Inmersivo
 * La página entera es una búsqueda binaria: el hero corta la pantalla 6 veces y cada
 * sección vuelve a cortar la celda que queda (½ → ¼ → ⅛ … → 1/64 = contacto).
 * Vanilla JS. Solo transform/opacity en el camino caliente. Sin JS / con
 * prefers-reduced-motion la página queda en su estado final, completa y legible. */
(function () {
  'use strict';
  var root = document.documentElement;
  var MOTION = root.classList.contains('motion');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var LN100 = Math.log(100);
  var logCurve = function (t) { return Math.log(1 + 99 * t) / LN100; }; // curva de marca
  var outExpo = function (t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); };

  // cubic-bezier(.7,0,.2,1): la misma curva del corte en el hero
  function bezier(x1, y1, x2, y2) {
    function a(p1, p2) { return 1 - 3 * p2 + 3 * p1; }
    function b(p1, p2) { return 3 * p2 - 6 * p1; }
    function c(p1) { return 3 * p1; }
    function calc(t, p1, p2) { return ((a(p1, p2) * t + b(p1, p2)) * t + c(p1)) * t; }
    function slope(t, p1, p2) { return 3 * a(p1, p2) * t * t + 2 * b(p1, p2) * t + c(p1); }
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var t = x;
      for (var i = 0; i < 6; i++) { var s = slope(t, x1, x2); if (!s) break; t -= (calc(t, x1, x2) - x) / s; }
      return calc(clamp(t, 0, 1), y1, y2);
    };
  }
  var cutEase = bezier(0.7, 0, 0.2, 1);

  /* ---------- Geometría: siempre se corta el lado más largo ---------- */
  function halving(W, H, cuts) {
    var r = { x: 0, y: 0, w: W, h: H }, cells = [], lines = [], rems = [r];
    for (var i = 0; i < cuts; i++) {
      if (r.w >= r.h) {
        var w = r.w / 2;
        cells.push({ x: r.x, y: r.y, w: w, h: r.h });
        lines.push({ v: true, x: r.x + w, y: r.y, len: r.h });
        r = { x: r.x + w, y: r.y, w: w, h: r.h };
      } else {
        var h = r.h / 2;
        cells.push({ x: r.x, y: r.y, w: r.w, h: h });
        lines.push({ v: false, x: r.x, y: r.y + h, len: r.w });
        r = { x: r.x, y: r.y + h, w: r.w, h: h };
      }
      rems.push(r);
    }
    cells.push(r);
    return { cells: cells, lines: lines, rems: rems };
  }

  /* ================= HERO ================= */
  var hero = $('#hero');
  var hcs = $$('.hc', hero);
  var hcuts = $$('.hcut', hero);
  var stacked = false;

  function layoutHero() {
    stacked = window.innerWidth < 900 || window.innerHeight < 620;
    hero.classList.toggle('is-stacked', stacked);
    var W = hero.clientWidth, H = hero.clientHeight;
    var g = halving(W, H, 6);
    g.lines.forEach(function (l, i) {
      var el = hcuts[i];
      el.classList.toggle('v', l.v);
      el.style.cssText = 'left:' + l.x + 'px;top:' + l.y + 'px;' + (l.v ? 'width:1px;height:' + l.len + 'px' : 'height:1px;width:' + l.len + 'px');
    });
    g.cells.forEach(function (c, i) {
      if (stacked && i < 6) { hcs[i].style.cssText = ''; return; }
      hcs[i].style.cssText = 'left:' + c.x + 'px;top:' + c.y + 'px;width:' + c.w + 'px;height:' + c.h + 'px';
    });
    var c5 = g.cells[5];
    hero.style.setProperty('--typer-size', clamp(c5.w / 9.5, 12, 22).toFixed(1) + 'px');
  }

  function playHero() {
    if (!MOTION) { startRotation(); typeFinal(); return; }
    hero.classList.add('is-pending');
    var STEP = 700, T0 = 600;
    if (stacked) { hcs[0].classList.add('is-on'); hcs[1].classList.add('is-on'); }
    for (var k = 0; k < 7; k++) {
      (function (k) {
        var t = T0 + k * STEP;
        if (k < 6) setTimeout(function () { hcuts[k].classList.add('is-on'); }, t);
        setTimeout(function () {
          hcs[k].classList.add('is-on');
          if (k === 1) startRotation();
          if (k === 5) typeIt();
        }, k < 6 ? t + Math.round(STEP * 0.45) : t);
      })(k);
    }
  }

  /* ---- Rotador de servicios ---- */
  var rotGroups = $$('.rot-g'), rotBtns = $$('.stepper button'), rotN = $('#rotN');
  var rotI = 0, rotTimer = null, heroVisible = true, rotStarted = false;
  function showRot(i) {
    if (i === rotI) return;
    var out = rotGroups[rotI], inn = rotGroups[i];
    rotI = i;
    rotBtns.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    rotN.textContent = i + 1;
    if (!MOTION) { out.hidden = true; inn.hidden = false; return; }
    out.classList.add('is-out');
    setTimeout(function () { out.hidden = true; out.classList.remove('is-out'); }, 450);
    inn.hidden = false; inn.classList.add('is-in');
    setTimeout(function () { inn.classList.remove('is-in'); }, 180);
  }
  function scheduleRot() {
    clearTimeout(rotTimer);
    if (!MOTION || !heroVisible || document.hidden) return;
    rotTimer = setTimeout(function () { showRot((rotI + 1) % rotGroups.length); scheduleRot(); }, 4500);
  }
  function startRotation() { rotStarted = true; scheduleRot(); }
  rotBtns.forEach(function (b, i) { b.addEventListener('click', function () { showRot(i); if (rotStarted) scheduleRot(); }); });
  document.addEventListener('visibilitychange', scheduleRot);
  new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; if (rotStarted) scheduleRot(); }).observe(hero);

  /* ---- Tipeo O(n²) → O(n log n) → O(log n) (BRAND §5.1) ---- */
  var typer = $('.typer-t');
  function typeFinal() { typer.innerHTML = 'O(log <span class="typer-n">n</span>)'; }
  function typeIt() {
    var seq = [], buf = 'O(';
    function add(fn, ms) { seq.push([fn, ms]); }
    function render(s, last) {
      var html = s.replace('²', '<sup>2</sup>');
      if (last) html = html.replace(/n\)$/, '<span class="typer-n" style="color:#F4EFE7">n</span>)');
      typer.innerHTML = html;
    }
    var planned = buf; // longitud prevista al planificar (buf cambia recién al ejecutar)
    function typeStr(str, last) { planned += str; str.split('').forEach(function (ch, i) { add(function () { buf += ch; render(buf, last && i >= str.length - 2); }, 120 + Math.random() * 30 - 10); }); }
    function erase(to) { var n = planned.length - to.length; planned = to; for (var i = 0; i < n; i++) add(function () { buf = buf.slice(0, -1); render(buf); }, 70); }
    render(buf);
    typeStr('n²)'); add(function () {}, 1300); erase('O(');
    typeStr('n log n)'); add(function () {}, 1300); erase('O(');
    typeStr('log n)', true);
    var i = 0;
    (function next() {
      if (i >= seq.length) return tintN();
      var s = seq[i++]; s[0](); setTimeout(next, s[1]);
    })();
  }
  function tintN() {
    var n = $('.typer-n', typer); if (!n) return;
    var a = [244, 239, 231], b = [226, 88, 42], t0 = performance.now();
    (function f(now) {
      var p = logCurve(clamp((now - t0) / 1400, 0, 1));
      n.style.color = 'rgb(' + a.map(function (v, j) { return Math.round(v + (b[j] - v) * p); }).join(',') + ')';
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ================= ESCENAS DE CORTE (scroll nativo + sticky) ================= */
  var narrowMQ = window.matchMedia('(max-width: 767px), (max-aspect-ratio: 1/1)');
  var stages = $$('.stage').map(function (st) {
    return {
      el: st, k: +st.dataset.k, sec: st.parentNode,
      cut: $('.cut:not(.cut-hot)', st), hot: $('.cut-hot', st), shade: $('.shade', st),
      frac: $('.frac', st), keep: $('.keep-in', st), metas: $$('.meta', st), found: $('.found-fill', st)
    };
  });
  function axisOf(s) { return narrowMQ.matches ? 'h' : s.el.dataset.axis; }
  function paintStage(s, p) {
    var v = axisOf(s) === 'v';
    var c = cutEase(seg(p, 0, 0.4));
    var scl = function (x) { return v ? 'scale(1,' + x + ')' : 'scale(' + x + ',1)'; };
    s.cut.style.transform = scl(c);
    s.hot.style.transform = scl(c);
    s.hot.style.opacity = 1 - seg(p, 0.72, 0.92);
    var f = seg(p, 0.12, 0.42);
    s.frac.style.opacity = f;
    s.frac.style.transform = 'translate3d(0,' + ((1 - outExpo(f)) * 28).toFixed(2) + 'px,0)';
    var sh = cutEase(seg(p, 0.45, 0.85));
    s.shade.style.transform = v ? 'scale(' + sh + ',1)' : 'scale(1,' + sh + ')';
    var kp = seg(p, 0.26, 0.6);
    s.keep.style.opacity = kp;
    s.keep.style.transform = 'translate3d(0,' + ((1 - outExpo(kp)) * 40).toFixed(2) + 'px,0)';
    var m = seg(p, 0.35, 0.6);
    s.metas.forEach(function (el) { el.style.opacity = m; });
    if (s.found) s.found.style.transform = 'scale(1,' + cutEase(seg(p, 0.5, 0.88)) + ')';
  }

  /* ---- Medidor de profundidad ---- */
  var bar = $('#bar'), meterSvg = $('.meter-map'), meterFrac = $('.meter-frac'), meterName = $('.meter-name');
  var NS = 'http://www.w3.org/2000/svg';
  var mg = halving(160, 100, 6), mRects = [], mHere;
  mg.cells.forEach(function (c) {
    var r = document.createElementNS(NS, 'rect');
    r.setAttribute('x', c.x); r.setAttribute('y', c.y); r.setAttribute('width', c.w); r.setAttribute('height', c.h);
    meterSvg.appendChild(r); mRects.push(r);
  });
  mHere = document.createElementNS(NS, 'rect'); mHere.setAttribute('class', 'is-here'); meterSvg.appendChild(mHere);
  var lastDepth = -1;
  function setDepth(d) {
    if (d === lastDepth) return; lastDepth = d;
    mRects.forEach(function (r, i) {
      r.classList.toggle('is-gone', i < d && i < 6);
      r.classList.toggle('is-found', d === 6 && i === 6);
    });
    var rem = mg.rems[d];
    mHere.setAttribute('x', rem.x); mHere.setAttribute('y', rem.y); mHere.setAttribute('width', rem.w); mHere.setAttribute('height', rem.h);
    mHere.style.opacity = d === 6 ? 0 : 1;
    meterFrac.textContent = d === 0 ? 'n' : d === 6 ? '1/64' : 'n/' + Math.pow(2, d);
    meterName.textContent = d === 0 ? 'inicio' : d === 6 ? 'contacto · encontrado' : stages[d - 1].sec.dataset.name;
  }

  /* ---- Gráfico O(n) vs O(log n) que se dibuja con el scroll ---- */
  var chart = $('#chart'), clipR = $('.chart-clip'), cx = $('.chart-x'), dLin = $('.dot-lin'), dLog = $('.dot-log');
  var logY = function (x) { return 260 - 48 * Math.log(1 + x / 12); };
  (function () {
    var pts = [];
    for (var x = 0; x <= 480; x += 8) pts.push((x ? 'L' : 'M') + x + ' ' + logY(x).toFixed(1));
    $('#logPath').setAttribute('d', pts.join(' '));
  })();
  function paintChart(p) {
    var x = 480 * p;
    clipR.setAttribute('transform', 'scale(' + Math.max(p, 0.0001) + ' 1)');
    cx.setAttribute('transform', 'translate(' + x + ' 0)');
    cx.style.opacity = p > 0 && p < 1 ? 1 : 0;
    dLin.setAttribute('cx', x); dLin.setAttribute('cy', 260 - 240 * p);
    dLog.setAttribute('cx', x); dLog.setAttribute('cy', logY(x));
    dLin.style.opacity = dLog.style.opacity = p > 0 ? 1 : 0;
  }

  /* ---- Visión: la frase se enciende palabra por palabra ---- */
  var statement = $('#statement'), words = [];
  if (MOTION) {
    statement.innerHTML = statement.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    words = $$('.w', statement);
  }

  /* ---- Bucle de scroll (rAF, solo lectura de rects) ---- */
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    var hr = hero.getBoundingClientRect();
    var showBar = hr.bottom < vh * 0.35;
    bar.classList.toggle('is-on', showBar);
    bar.inert = !showBar;
    var depth = 0;
    stages.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.top <= vh * 0.5) depth = s.k;
      if (!MOTION) return;
      if (r.bottom < -50 || r.top > vh + 50) return;
      var start = vh * 0.85, end = -(r.height - vh);
      paintStage(s, clamp((start - r.top) / (start - end), 0, 1));
    });
    setDepth(depth);
    if (MOTION && words.length) {
      var sr = statement.getBoundingClientRect();
      if (sr.bottom > 0 && sr.top < vh) {
        var lit = clamp((vh * 0.9 - sr.top) / (vh * 0.45), 0, 1) * words.length;
        words.forEach(function (w, i) { w.style.opacity = (0.2 + 0.8 * clamp(lit - i, 0, 1)).toFixed(3); });
      }
    }
    if (MOTION) {
      var cr = chart.getBoundingClientRect();
      if (cr.bottom > 0 && cr.top < vh) paintChart(outExpo(clamp((vh * 0.92 - cr.top) / (vh * 0.62), 0, 1)) );
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { layoutHero(); onScroll(); });
  if (MOTION) {
    stages.forEach(function (s) { paintStage(s, 0); });
    paintChart(0);
  } else {
    paintChart(1);
  }

  /* ================= Búsqueda binaria interactiva ================= */
  var ARR = [3, 8, 12, 17, 21, 26, 30, 35, 41, 47, 52, 58, 63, 71, 76, 84];
  var sBtns = $$('.search-grid button'), sStatus = $('#searchStatus'), sLog = $('#searchLog');
  var sTimers = [], touched = false;
  function plan(ti) {
    var t = ARR[ti], lo = 0, hi = 16, steps = [], k = 0;
    while (true) {
      if (hi - lo === 1) { steps.push({ lo: lo, hi: hi, mid: -1, found: lo, k: k }); break; }
      var mid = (lo + hi) >> 1; k++;
      if (ARR[mid] === t) { steps.push({ lo: lo, hi: hi, mid: mid, found: mid, k: k, eq: true }); break; }
      var right = t > ARR[mid];
      var nlo = right ? mid : lo, nhi = right ? hi : mid;
      steps.push({ lo: lo, hi: hi, mid: mid, k: k, txt: k + ' · ' + t + (right ? ' > ' : ' < ') + ARR[mid] + ' → descartamos la ' + (right ? 'izquierda' : 'derecha') + ' · ' + (nhi - nlo === 1 ? 'queda 1' : 'quedan ' + (nhi - nlo)), nlo: nlo, nhi: nhi });
      lo = nlo; hi = nhi;
    }
    return steps;
  }
  function paintSearch(st, ti) {
    sBtns.forEach(function (b, i) {
      var lo = st.nlo !== undefined ? st.nlo : st.lo, hi = st.nhi !== undefined ? st.nhi : st.hi;
      b.classList.toggle('is-out', st.found === undefined ? (i < lo || i >= hi) : i !== st.found);
      b.classList.toggle('is-mid', i === st.mid && st.found === undefined);
      b.classList.toggle('is-found', i === st.found);
      b.classList.toggle('is-target', i === ti);
    });
  }
  function logLine(txt) { var li = document.createElement('li'); li.textContent = txt; sLog.appendChild(li); }
  function runSearch(ti) {
    sTimers.forEach(clearTimeout); sTimers = [];
    sLog.textContent = '';
    var t = ARR[ti], steps = plan(ti), total = steps[steps.length - 1].k;
    var doneMsg = t + ' encontrado en ' + total + (total === 1 ? ' paso.' : ' pasos.');
    var finish = function (st) {
      if (st.eq) logLine(st.k + ' · ' + t + ' = ' + ARR[st.mid] + ' → encontrado');
      paintSearch(st, ti); sStatus.textContent = doneMsg;
    };
    if (!MOTION) {
      steps.forEach(function (st) { if (st.txt) logLine(st.txt); });
      finish(steps[steps.length - 1]); return;
    }
    sBtns.forEach(function (b) { b.classList.remove('is-out', 'is-mid', 'is-found'); b.classList.toggle('is-target', b.dataset.i == ti); });
    sStatus.textContent = 'Buscando ' + t + ' entre 16…';
    var STEP = 1000;
    steps.forEach(function (st, j) {
      sTimers.push(setTimeout(function () {
        if (st.found !== undefined) return finish(st);
        // primero marcamos el medio, después descartamos la mitad
        sBtns.forEach(function (b, i) { b.classList.toggle('is-mid', i === st.mid); });
        sTimers.push(setTimeout(function () { paintSearch(st, ti); logLine(st.txt); }, STEP * 0.45));
      }, 350 + j * STEP));
    });
  }
  sBtns.forEach(function (b) {
    b.setAttribute('aria-label', 'Buscar ' + b.textContent);
    b.addEventListener('click', function () { touched = true; runSearch(+b.dataset.i); });
  });
  if (MOTION) {
    var sio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { sio.disconnect(); if (!touched) setTimeout(function () { if (!touched) runSearch(13); }, 400); }
    }, { threshold: 0.6 });
    sio.observe($('.search-grid'));
  }

  /* ---- Barras 100/50/25 ---- */
  if (MOTION) {
    var bio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-on'); bio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    $$('.steps li').forEach(function (li) { bio.observe(li); });
  }

  /* ---- Equipo: pestañas que rotan cada 5 s hasta que el visitante interactúa ---- */
  var team = $('#team'), tabs = $$('[role="tab"]', team), panels = $$('[role="tabpanel"]', team);
  var teamI = 0, teamT = null, teamManual = false, teamVis = false;
  function showTeam(i, focus) {
    teamI = i;
    tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; });
    panels.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
    if (focus) tabs[i].focus();
    // reinicia la barra de progreso de la pestaña activa
    team.classList.remove('is-auto'); void team.offsetWidth;
    if (!teamManual && MOTION && teamVis) team.classList.add('is-auto');
  }
  function teamTick() {
    clearTimeout(teamT);
    if (teamManual || !MOTION || !teamVis || document.hidden) { team.classList.remove('is-auto'); return; }
    team.classList.add('is-auto');
    teamT = setTimeout(function () { showTeam((teamI + 1) % tabs.length); teamTick(); }, 5000);
  }
  function stopTeam() { teamManual = true; clearTimeout(teamT); team.classList.remove('is-auto'); }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { stopTeam(); showTeam(i); });
    t.addEventListener('keydown', function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === 'Home') d = -teamI;
      if (e.key === 'End') d = tabs.length - 1 - teamI;
      if (d === undefined) return;
      e.preventDefault(); stopTeam(); showTeam((teamI + d + tabs.length) % tabs.length, true);
    });
  });
  team.addEventListener('focusin', stopTeam);
  showTeam(0);
  new IntersectionObserver(function (es) {
    var was = teamVis; teamVis = es[0].isIntersecting;
    if (teamVis && !was && !teamManual) showTeam(teamI);
    teamTick();
  }, { threshold: 0.4 }).observe(team);
  document.addEventListener('visibilitychange', teamTick);

  /* ---- Reloj de Asunción ---- */
  var clocks = $$('.clock');
  function tickClock() {
    var t;
    try { t = new Intl.DateTimeFormat('es-PY', { timeZone: 'America/Asuncion', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()); } catch (e) { return; }
    clocks.forEach(function (c) { c.textContent = t; });
  }
  tickClock(); setInterval(tickClock, 20000);

  /* ---- Contacto: el mensaje se arma solo mientras se completa el formulario ---- */
  // Valores inyectados en el build desde config/.env (scripts/build-site.sh).
  var WHATSAPP_NUMBER = '%%WHATSAPP_NUMBER%%'; // sin + ni espacios
  var EMAIL = '%%CONTACT_EMAIL%%';
  var form = $('#form'), msg = form.mensaje, msgTouched = false, status = $('#fStatus');
  var needBtns = $$('.needs button', form);
  function joinEs(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]; }
  function buildMsg() {
    var name = form.nombre.value.trim() || '[Nombre]';
    var areas = needBtns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; }).map(function (b) { return b.dataset.area; });
    return 'Hola, soy ' + name + '.' + (areas.length ? ' Quisiera consultar sobre ' + joinEs(areas) + '.' : '');
  }
  function syncMsg() {
    if (!msgTouched) msg.value = buildMsg();
    var text = msg.value;
    $('#actWa').href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
    $('#actMail').href = 'mailto:' + EMAIL + '?subject=Consulta&body=' + encodeURIComponent(text);
  }
  needBtns.forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); syncMsg(); });
  });
  form.nombre.addEventListener('input', syncMsg);
  // si el visitante edita el mensaje, dejamos de completarlo; si lo vacía, vuelve a armarse
  msg.addEventListener('input', function () { msgTouched = msg.value.trim() !== ''; syncMsg(); });
  syncMsg();
  $('#actCopy').addEventListener('click', function () {
    var done = function () { status.textContent = 'Mensaje copiado.'; };
    var legacy = function () { msg.select(); try { document.execCommand('copy'); } catch (e) {} done(); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(msg.value).then(done, legacy);
    else legacy();
  });
  function setErr(input, errId, bad) {
    input.setAttribute('aria-invalid', bad ? 'true' : 'false');
    document.getElementById(errId).hidden = !bad;
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var n = form.nombre, c = form.contacto, v = c.value.trim();
    var okN = n.value.trim().length > 1;
    var okC = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || /^\+?[\d\s()-]{6,}$/.test(v);
    setErr(n, 'e-nombre', !okN); setErr(c, 'e-contacto', !okC);
    if (!okN || !okC) { (okN ? c : n).focus(); status.textContent = ''; return; }
    // TODO: conectar el envío (proveedor de correo o webhook) con este payload.
    void { nombre: n.value.trim(), contacto: v, mensaje: msg.value };
    status.textContent = 'Prototipo: la consulta todavía no se envía.';
  });

  /* ---- Arranque ---- */
  layoutHero();
  playHero();
  frame();
})();
