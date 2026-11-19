# SEO Audit — Log N Labs

Round 3: 2026-11-19, after the SEO changes on branch `seo-improvements`, verified on the preview at `https://seo-improvements.log-n-labs.pages.dev`. Production gets the same score once the branch is merged to `main`.
History: 38 (domain down) → 56 (domain fixed) → 80 (SEO foundations) → 83 (self-hosted fonts, security headers) → 85 (factura electrónica expertise on /software/) → **86** (Instagram linked via `sameAs` and a visible `rel="me"` footer link on all pages).

## Overall score: 86 / 100 — Good

| Category | Weight | Before | Now | Note |
|---|---|---|---|---|
| Technical SEO | 25% | 55 | 95 | Canonicals, sitemap, robots, pages.dev noindex, 301s; HSTS, CSP frame-ancestors, X-Frame-Options, Permissions-Policy, COOP |
| Content quality / E-E-A-T | 20% | 50 | 66 | Placeholders removed; Paraguay-specific expertise (WhatsApp, QR, factura electrónica / DNIT) on /software/; Instagram linked (schema + footer); still no named people or proof |
| On-page SEO | 15% | 80 | 82 | Titles/H1 fine; /software/ now covers "factura electrónica" queries; home description 59 chars (owner's choice, short) |
| Schema | 15% | 25 | 93 | sameAs → Instagram; ProfessionalService, WebSite, Service, BreadcrumbList, FAQPage |
| Performance (CWV) | 10% | 55 | 90 (Likely) | LCP = H1 at first paint, CLS 0; fonts self-hosted + preloaded (84 KB, immutable cache), only styles.css render-blocking; preview warm FCP 156 ms |
| Images | 10% | 85 | 95 | Explicit width/height; logo links named via aria-label; OG PNG 100 KB |
| AI search readiness (GEO) | 5% | 40 | 88 | llms.txt, entity schema, crawlers allowed |

Weighted: 23.75 + 13.2 + 12.3 + 13.95 + 9 + 9.5 + 4.4 = **86.1 ≈ 86** (Schema 93 and GEO 88 with `sameAs`)

## What changed (verified on the preview)
| Item | Evidence |
|---|---|
| Canonical | `<link rel="canonical" href="https://lognlabs.com.py/">`, plus `/software/` and `/marketing/` |
| robots.txt | `User-agent: * / Allow: / / Sitemap: https://lognlabs.com.py/sitemap.xml` |
| sitemap.xml | 200 `application/xml`, 3 URLs |
| llms.txt | 200 |
| HSTS | `strict-transport-security: max-age=31536000` (from `src/_headers`) |
| pages.dev duplicates | `x-robots-tag: noindex` on `*.log-n-labs.pages.dev` |
| Schema | Home: `ProfessionalService` + `WebSite` (`@graph`). Subpages: `Service` + `BreadcrumbList`, and `FAQPage` now covers all visible questions (was 3/4 and 4/5). All blocks parse as JSON. |
| LCP | The hero `.c1` no longer waits for `main.js`. The H1 is one text block. Local Chrome: LCP = H1 at 108 ms desktop / 152 ms mobile, with no later candidates (before: the rotator text replaced it at 11.6 s on mobile). CLS 0. |
| `analytics.js` | `defer` (`lnlTrack` is only used on submit) |
| Contrast | `#857A70` → `#75695F` (3.66 → 4.65:1 on `#F4EFE7`) |
| Placeholders | `[plazo de respuesta]` and `[confirmar declaración de propiedad del código]` removed |
| Meta description | Home: "Software, marketing y consultoría para empresas paraguayas" |

## Remaining gap to 90+
Everything left needs content or actions only the owner can provide:

1. **E-E-A-T (content quality 62 → 85, +4.6 pts):**
   - Name the team members (one-line background, LinkedIn) and add `Person` schema.
   - Add 2–3 results or testimonials, which can be anonymized.
   - Add `sameAs` links to social profiles and a Google Business Profile.
2. **Meta description (on-page 80 → 90, +1.5 pts):** 59 chars is below the ~120–155 sweet spot, so Google may rewrite the snippet. Consider adding a second clause.
3. ~~Fonts~~: done, self-hosted.
4. **Off-page (not scored, high impact):**
   - Verify Search Console and submit the sitemap.
   - Create a Google Business Profile (Asunción).
   - Optionally add a Bulk Redirect pages.dev → apex.

## Environment limitations
- **PageSpeed Insights API:** daily quota exhausted (shared no-key quota).
- **Local Lighthouse via npx:** blocked by the session permission policy.
- **Measurement method:** LCP and CLS were measured with PerformanceObserver in local Chrome against a local build. That's lab data with no network throttling, so the performance confidence is "Likely".
- **Off-site data:** none from Search Console or backlinks.
