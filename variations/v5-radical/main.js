/* Log N Labs · V5 Radical
   Display words are cut by the logo's rule: horizontal gaps of negative space,
   gap = 5% of the cap height. Words take cuts high in the letter (⅛, ¼) so they
   never read as a strikethrough; only numerals take the ½ cut. */
(() => {
  'use strict';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const P = t => Math.log(1 + 99 * Math.min(1, Math.max(0, t))) / Math.log(100); // brand log curve
  const GAP = 0.05;
  const EIGHTHS = ['', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];
  const now = () => performance.now();
  const WA = '595000000000';           // TODO: número real de WhatsApp (config)
  const MAIL = '';                      // TODO: correo real (config)

  /* ───────── Sliced display type (CSS mask over one real text node) ───────── */
  const cv = document.createElement('canvas').getContext('2d');
  const slices = [];
  class Slice {
    constructor(el) {
      this.el = el;
      this.fracs = (el.dataset.cuts || '').split(',').filter(Boolean).map(Number);
      this.gap = GAP; this.from = GAP; this.to = GAP; this.t0 = 0; this.dur = 0;
      this.extra = 0; this.cursor = null; this.entered = false;
    }
    measure() {
      const cs = getComputedStyle(this.el);
      const fs = parseFloat(cs.fontSize);
      let lh = parseFloat(cs.lineHeight); if (isNaN(lh)) lh = fs * 1.2;
      cv.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      const sample = 'H';
      const m = cv.measureText(sample);
      const fA = m.fontBoundingBoxAscent ?? fs * 0.95, fD = m.fontBoundingBoxDescent ?? fs * 0.25;
      this.capH = m.actualBoundingBoxAscent;
      this.base = (lh - (fA + fD)) / 2 + fA;
      this.lh = lh;
      this.lines = Math.max(1, Math.round(this.el.clientHeight / lh));
      this.render();
    }
    render() {
      if (!this.capH || this.el.offsetParent === null) return;
      const H = this.capH, iv = [];
      const g = Math.max(1.5, (this.gap + this.extra) * H);
      for (let i = 0; i < this.lines; i++) {
        const capTop = i * this.lh + this.base - H;
        for (const f of this.fracs) iv.push(capTop + f * H);
        if (this.cursor && this.cursor.line === i) iv.push(capTop + this.cursor.k / 8 * H);
      }
      if (!iv.length) { this.el.style.maskImage = this.el.style.webkitMaskImage = ''; return; }
      iv.sort((a, b) => a - b);
      const stops = []; let y = 0;
      for (const c of iv) {
        const a = Math.max(y, c - g / 2), b = c + g / 2;
        stops.push(`#000 ${y.toFixed(2)}px ${a.toFixed(2)}px`, `transparent ${a.toFixed(2)}px ${b.toFixed(2)}px`);
        y = b;
      }
      stops.push(`#000 ${y.toFixed(2)}px 100%`);
      const img = `linear-gradient(${stops.join(',')})`;
      this.el.style.webkitMaskImage = img; this.el.style.maskImage = img;
    }
    animateTo(to, dur, from) {
      this.from = from ?? this.gap; this.to = to; this.t0 = now(); this.dur = RM ? 0 : dur;
      if (RM) this.gap = to;
      dirty.add(this); wake();
    }
    tick(t) {
      if (this.dur <= 0) { this.gap = this.to; return false; }
      const p = (t - this.t0) / this.dur;
      this.gap = this.from + (this.to - this.from) * P(p);
      if (p >= 1) { this.gap = this.to; this.dur = 0; }
      return p < 1;
    }
  }
  let raf = 0;
  const dirty = new Set();
  function wake() { if (!raf) raf = requestAnimationFrame(loop); }
  function loop(t) {
    raf = 0; let again = false;
    for (const s of slices) if (s.dur > 0) { again = s.tick(t) || again; dirty.add(s); }
    dirty.forEach(s => s.render()); dirty.clear();
    if (again) wake();
  }
  document.querySelectorAll('.cut').forEach(el => slices.push(new Slice(el)));
  const sliceOf = el => slices.find(x => x.el === el);

  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      const s = sliceOf(e.target);
      if (s && e.isIntersecting && !s.entered) {
        s.entered = true;
        if (!RM) s.animateTo(GAP, 1400, 0.24); // hard cut open, settles on 5% along p(t)
      }
    }
  }, { threshold: 0.2 });
  const measureAll = () => slices.forEach(s => s.measure());
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
    measureAll(); slices.forEach(s => io.observe(s.el));
  });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(measureAll, 120); });

  /* Hero words open as you leave the hero (scroll-linked, never scroll-jacked) */
  const hero = document.querySelector('.hero');
  const heroSlices = slices.filter(s => hero.contains(s.el));
  function onScroll() {
    if (RM) return;
    const p = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
    heroSlices.forEach(s => { s.extra = 0.3 * p * p; dirty.add(s); });
    wake();
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* Solution cells: inspecting a cell opens its cuts */
  document.querySelectorAll('.cell').forEach(cell => {
    const s = slices.find(x => cell.contains(x.el)); if (!s) return;
    const open = () => s.animateTo(0.14, 700), close = () => s.animateTo(GAP, 1400);
    cell.addEventListener('pointerenter', open); cell.addEventListener('pointerleave', close);
    cell.addEventListener('focusin', open); cell.addEventListener('focusout', close);
  });

  /* ───────── Cursor as a cutting line: snaps to eighths of the cap height ───────── */
  if (FINE) {
    const line = document.querySelector('.cutline'), key = line.querySelector('.cutline-k');
    let cur = null;
    const fieldOf = el => el.closest('.f-rust') ? ['#F4EFE7', '#B83A0E'] : el.closest('.f-white,.f-paper') ? ['#B83A0E', '#F4EFE7'] : ['#E2582A', '#17120F'];
    const drop = () => { if (cur) { cur.cursor = null; dirty.add(cur); wake(); cur = null; } line.classList.remove('is-on'); };
    document.addEventListener('pointermove', e => {
      const el = e.target.closest && e.target.closest('.cut');
      const s = el && sliceOf(el);
      if (!s || !s.capH) return drop();
      const r = el.getBoundingClientRect();
      const yIn = e.clientY - r.top, i = Math.floor(yIn / s.lh);
      const capTop = i * s.lh + s.base - s.capH;
      const f = (yIn - capTop) / s.capH;
      if (f < 0.0625 || f > 0.9375) return drop();
      const k = Math.min(7, Math.max(1, Math.round(f * 8)));
      if (cur && cur !== s) { cur.cursor = null; dirty.add(cur); }
      cur = s; s.cursor = { line: i, k }; dirty.add(s); wake();
      const [c, bg] = fieldOf(el);
      const range = document.createRange(); range.selectNodeContents(el);
      const tr = range.getBoundingClientRect();
      line.style.color = c; line.style.setProperty('--bgk', bg);
      line.style.setProperty('--a', (tr.left - 16) + 'px');
      line.style.setProperty('--b', (tr.right + 16) + 'px');
      line.style.transform = `translateY(${r.top + capTop + k / 8 * s.capH}px)`;
      key.dataset.k = EIGHTHS[k];
      line.classList.add('is-on');
    }, { passive: true });
    addEventListener('scroll', drop, { passive: true });
    document.addEventListener('pointerleave', drop);
  }

  /* ───────── Typing piece: O(n²) → O(n log n) → O(log n) ───────── */
  const typer = document.querySelector('.typer-text');
  const legend = [...document.querySelectorAll('.legend li')];
  const stage = n => legend.forEach((li, i) => li.classList.toggle('is-on', i === n));
  if (!RM && typer) {
    const toks = [];
    const draw = nColor => {
      typer.innerHTML = toks.map((t, i) => t === '²' ? '<sup>2</sup>'
        : (nColor && i === toks.length - 2) ? `<span class="n-final" style="color:${nColor}">n</span>` : (t === ' ' ? '&nbsp;' : t)).join('');
    };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const type = async str => { for (const ch of str) { toks.push(ch); draw(); await wait(118 + Math.random() * 14); } };
    const erase = async keep => { while (toks.length > keep) { toks.pop(); draw(); await wait(70); } };
    const mix = (a, b, p) => '#' + [0, 2, 4].map(i => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return Math.round(x + (y - x) * p).toString(16).padStart(2, '0'); }).join('');
    (async () => {
      draw(); stage(-1);
      await wait(450);
      await type('O(n²)'); stage(0); await wait(1300);
      await erase(2);
      await type('n log n)'); stage(1); await wait(1300);
      await erase(2);
      await type('log n)'); stage(2);
      const t0 = now();
      const step = () => { const p = Math.min(1, (now() - t0) / 1400); draw('#' + mix('F4EFE7', 'E2582A', P(p))); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    })();
  }

  /* ───────── Visión: the statement lights word by word as you read down ───────── */
  const st = document.querySelector('[data-light]');
  if (st) {
    st.innerHTML = st.textContent.split(/(\s+)/).map(w => /\s/.test(w) ? w : `<span class="sw">${w}</span>`).join('');
    const words = [...st.querySelectorAll('.sw')];
    const light = () => {
      const r = st.getBoundingClientRect(), vh = innerHeight;
      const p = RM ? 1 : Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    addEventListener('scroll', light, { passive: true }); light();
  }

  /* ───────── Chart: computed log path; reveals in halving steps ───────── */
  const pts = [];
  for (let x = 0; x <= 480; x += 8) pts.push((x ? 'L' : 'M') + x + ' ' + (260 - 48 * Math.log(1 + x / 12)).toFixed(1));
  document.getElementById('logPath').setAttribute('d', pts.join(' '));
  const halving = el => {
    if (RM) return;
    const seq = [0, 0.5, 0.75, 0.875, 0.9375, 1];
    el.style.setProperty('--s', 0);
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; o.disconnect();
      seq.forEach((v, i) => setTimeout(() => el.style.setProperty('--s', v), i * 130));
    }, { threshold: 0.25 });
    o.observe(el.parentElement); // its own clip-path would hide it from the observer
  };
  document.querySelectorAll('.halve-reveal, .step').forEach(el => halving(el));

  /* ───────── Equipo: tabs rotate every 5 s until the visitor takes over ───────── */
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  let ti = 0, rot = !RM, tStart = now(), teamVisible = false;
  const select = (i, focus) => {
    ti = (i + tabs.length) % tabs.length;
    tabs.forEach((t, j) => {
      const on = j === ti;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    const panel = document.getElementById(tabs[ti].getAttribute('aria-controls'));
    panel.querySelectorAll('.cut').forEach(el => { const s = sliceOf(el); if (s) { s.measure(); if (!RM) s.animateTo(GAP, 1200, 0.24); } });
    if (focus) tabs[ti].focus();
    tStart = now();
  };
  const stopRot = () => { rot = false; tabs.forEach(t => t.style.removeProperty('--p')); };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { stopRot(); select(i); });
    t.addEventListener('keydown', e => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); stopRot(); select(ti + k, true); }
      if (e.key === 'Home') { e.preventDefault(); stopRot(); select(0, true); }
      if (e.key === 'End') { e.preventDefault(); stopRot(); select(tabs.length - 1, true); }
    });
  });
  document.querySelector('.team').addEventListener('focusin', stopRot);
  new IntersectionObserver(([e]) => { teamVisible = e.isIntersecting; tStart = now(); }, { threshold: 0.3 }).observe(document.querySelector('.team'));
  const rotTick = () => {
    if (rot && teamVisible) {
      const p = (now() - tStart) / 5000;
      tabs[ti].style.setProperty('--p', Math.min(1, p).toFixed(3));
      if (p >= 1) { tabs[ti].style.removeProperty('--p'); select(ti + 1); }
    }
    if (rot) requestAnimationFrame(rotTick);
  };
  if (rot) requestAnimationFrame(rotTick);

  /* ───────── Menu + current section in nav ───────── */
  const mb = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  mb.addEventListener('click', () => {
    const open = mb.getAttribute('aria-expanded') !== 'true';
    mb.setAttribute('aria-expanded', open); nav.classList.toggle('is-open', open);
    mb.textContent = open ? 'Cerrar' : 'Menú';
  });
  nav.addEventListener('click', e => { if (e.target.closest('a') && mb.getAttribute('aria-expanded') === 'true') mb.click(); });
  const navLinks = [...nav.querySelectorAll('a:not(.btn)')];
  const navObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    navLinks.forEach(a => {
      if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'vision', 'soluciones', 'trabajos', 'proceso', 'equipo', 'contacto']
    .forEach(id => navObs.observe(document.getElementById(id)));

  /* ───────── Contact: live message builder ───────── */
  const form = document.querySelector('.form');
  const status = document.getElementById('form-status');
  const msg = form.mensaje;
  const chips = [...form.querySelectorAll('.chip')];
  let edited = false;
  const join = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1];
  const build = () => {
    const name = form.nombre.value.trim() || '[Nombre]';
    const areas = chips.filter(c => c.getAttribute('aria-pressed') === 'true').map(c => c.dataset.area);
    return `Hola, soy ${name}.` + (areas.length ? ` Quisiéramos hablar de ${join(areas)}.` : '');
  };
  const sync = () => {
    if (!edited) msg.value = build();
    const text = msg.value;
    form.querySelector('.act-wa').href = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
    form.querySelector('.act-mail').href = `mailto:${MAIL}?subject=Consulta&body=${encodeURIComponent(text)}`;
  };
  msg.addEventListener('input', () => { edited = msg.value.trim() !== ''; sync(); });
  form.nombre.addEventListener('input', sync);
  chips.forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') !== 'true'); sync(); }));
  sync();
  form.querySelector('.act-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(msg.value); status.textContent = 'Mensaje copiado.'; }
    catch { msg.select(); status.textContent = 'Seleccionamos el mensaje: copialo con Ctrl+C o Cmd+C.'; }
  });
  const setErr = (input, text) => {
    input.setAttribute('aria-invalid', text ? 'true' : 'false');
    document.getElementById(input.getAttribute('aria-describedby')).textContent = text;
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    const n = form.nombre, c = form.contacto; let first = null;
    if (!n.value.trim()) { setErr(n, 'Contanos tu nombre o el de tu empresa.'); first = n; } else setErr(n, '');
    const v = c.value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || v.replace(/\D/g, '').length >= 8;
    if (!ok) { setErr(c, v ? 'Revisá el correo o el número: falta algo.' : 'Dejanos un correo o un número para responderte.'); first = first || c; } else setErr(c, '');
    if (first) { status.textContent = ''; first.focus(); return; }
    // TODO: conectar el envío (proveedor de correo o webhook). Este prototipo no envía datos.
    status.textContent = 'Prototipo: la consulta todavía no se envía.';
  });

  /* ───────── Footer clock (America/Asuncion) ───────── */
  const clock = document.querySelector('.clock');
  const fmt = new Intl.DateTimeFormat('es-PY', { timeZone: 'America/Asuncion', hour: '2-digit', minute: '2-digit', hour12: false });
  const tickClock = () => { const d = new Date(); clock.textContent = fmt.format(d); clock.dateTime = d.toISOString(); };
  tickClock(); setInterval(tickClock, 15000);
})();
