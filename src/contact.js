/* Log N Labs · shared on every page: contact links, Asunción clock, contact form (UI only) */
(function () {
  'use strict';
  // Values injected at build time from config/.env (scripts/build-site.sh).
  var WHATSAPP_NUMBER = '%%WHATSAPP_NUMBER%%'; // international format, digits only
  var CONTACT_EMAIL = '%%CONTACT_EMAIL%%';
  if (WHATSAPP_NUMBER) document.querySelectorAll('a.wa').forEach(function (a) { a.href = 'https://wa.me/' + WHATSAPP_NUMBER; });
  if (CONTACT_EMAIL) document.querySelectorAll('a.mail').forEach(function (a) { a.href = 'mailto:' + CONTACT_EMAIL; });

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

  /* ---------- contact form: live message builder + actions ---------- */
  var form = document.getElementById('form');
  if (!form) return;
  var status = document.getElementById('status');
  var msg = form.elements.mensaje;
  var chips = Array.prototype.slice.call(form.querySelectorAll('.chips button'));
  var userEdited = false;

  // A landing page preselects its own line of work: <form data-preset="software">
  var preset = form.getAttribute('data-preset');
  if (preset) chips.forEach(function (b) { if (b.getAttribute('data-area') === preset) b.setAttribute('aria-pressed', 'true'); });

  function joinEs(list) {
    if (list.length < 2) return list.join('');
    return list.slice(0, -1).join(', ') + ' y ' + list[list.length - 1];
  }
  function buildMessage() {
    var name = form.elements.nombre.value.trim() || '[Nombre]';
    var areas = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })
      .map(function (b) { return b.getAttribute('data-area'); });
    var text = 'Hola, soy ' + name + '.';
    if (areas.length) text += ' Quisiera consultar sobre ' + joinEs(areas) + '.';
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
    var okN = setErr(nombre, nombre.value.trim() ? '' : 'Escribe tu nombre o el de tu empresa.');
    var looksOk = /\S+@\S+\.\S+/.test(c) || c.replace(/\D/g, '').length >= 8;
    var okC = setErr(contacto, !c ? 'Deja un correo o un número para responderte.' : (looksOk ? '' : 'Revisa el correo o el número: parece que falta algo.'));
    if (!okN) { nombre.focus(); return; }
    if (!okC) { contacto.focus(); return; }
    if (window.lnlTrack) {
      var areas = chips.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })
        .map(function (b) { return b.getAttribute('data-area'); });
      window.lnlTrack('contact_form_submit', { form_areas: areas.join(',') });
    }
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
