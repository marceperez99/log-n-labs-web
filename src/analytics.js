/* Log N Labs · Google tag (Tag Manager or GA4) + contact events. Loaded in <head> on every page.
 *
 * The ID is injected at build time (GOOGLE_TAG_ID, scripts/build-site.sh):
 *   GTM-XXXXXXX  → loads the Tag Manager container; events are pushed to the dataLayer as
 *                  { event: '<name>', ... } and GA4 is configured inside GTM.
 *   G-XXXXXXXXXX → loads GA4 directly with gtag.js and sends the events itself.
 *   empty        → nothing loads.
 * On hosts other than the production domain (Pages previews, localhost) nothing loads and
 * events are only logged to the console; add ?ga_debug=1 to the URL to load the tag anyway
 * (with GTM, use Tag Assistant preview to see the events).
 *
 * Events (mark whatsapp_click and email_click as key events in GA4):
 *   whatsapp_click         any wa.me link             { link_location, form_areas }
 *   email_click            any mailto: link           { link_location, form_areas }
 *   contact_form_submit    form passed validation     { form_areas }   (sent from contact.js)
 *   contact_form_start     first focus inside the form
 *   contact_message_copy   "Copiar mensaje"           { form_areas }
 *   contact_cta_click      any link to #contacto      { link_location, link_text }
 * link_location: header | dock | form | footer | <section id> | main
 */
(function () {
  'use strict';
  var TAG_ID = '%%GOOGLE_TAG_ID%%';
  var PROD_HOSTS = ['lognlabs.com.py', 'www.lognlabs.com.py'];

  var debug = /[?&]ga_debug=1\b/.test(location.search);
  var live = !!TAG_ID && (PROD_HOSTS.indexOf(location.hostname) !== -1 || debug);
  var gtm = /^GTM-/.test(TAG_ID);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  if (live) {
    var s = document.createElement('script');
    s.async = true;
    if (gtm) {
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(TAG_ID);
    } else {
      window.gtag = gtag;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(TAG_ID);
      gtag('js', new Date());
      gtag('config', TAG_ID, debug ? { debug_mode: true } : {});
    }
    document.head.appendChild(s);
  }

  // Every event carries the same keys so a GTM dataLayer value never leaks from one event into the next.
  var KEYS = ['link_location', 'form_areas', 'link_text'];
  function track(name, params) {
    params = params || {};
    if (!live) { if (window.console) console.debug('[analytics]', name, params); return; }
    if (gtm) {
      var push = { event: name };
      KEYS.forEach(function (k) { push[k] = params[k]; });
      window.dataLayer.push(push);
    } else {
      gtag('event', name, params);
    }
  }
  window.lnlTrack = track;

  function locationOf(el) {
    if (el.closest('.dock')) return 'dock';
    if (el.closest('#form')) return 'form';
    if (el.closest('footer')) return 'footer';
    if (el.closest('header')) return 'header';
    var sec = el.closest('section[id]');
    return sec ? sec.id : 'main';
  }
  function formAreas() {
    var on = document.querySelectorAll('#form .chips [aria-pressed="true"]');
    return Array.prototype.map.call(on, function (b) { return b.getAttribute('data-area'); }).join(',');
  }

  // Capture phase so the event is queued before the browser leaves for wa.me / the mail app.
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('a, button');
    if (!el) return;
    var where = locationOf(el);
    var href = el.getAttribute('href') || '';
    var params = { link_location: where };
    if (where === 'form') params.form_areas = formAreas();

    if (/^https:\/\/wa\.me\//.test(href)) track('whatsapp_click', params);
    else if (/^mailto:/.test(href)) track('email_click', params);
    else if (/#contacto$/.test(href)) {
      track('contact_cta_click', { link_location: where, link_text: el.textContent.replace(/\s+/g, ' ').replace(/→/g, '').trim() });
    } else if (el.id === 'copy') track('contact_message_copy', { form_areas: formAreas() });
  }, true);

  var started = false;
  document.addEventListener('focusin', function (e) {
    if (started || !e.target.closest || !e.target.closest('#form')) return;
    started = true;
    track('contact_form_start', {});
  });
})();
