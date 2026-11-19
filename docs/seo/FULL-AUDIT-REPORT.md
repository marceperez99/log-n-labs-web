# SEO Audit — Log N Labs

Re-audit: 2026-11-19, after the deployment fix (first audit: 2026-11-18, scored 38).
Scope: `https://lognlabs.com.py`, source in `src/`. Pages: `/`, `/software/`, `/marketing/`, `404.html`.

## Overall score: 56 / 100 — Needs Improvement (up from 38)

The domain now serves the site, and the www/http redirects and share URLs are correct. What's left is mostly signals that tell Google which host is canonical, plus structured data and trust content.

| Category | Weight | Score | Note |
|---|---|---|---|
| Technical SEO | 25% | 55 | Domain fixed; no canonical, no sitemap, pages.dev still indexable, no HSTS |
| Content quality / E-E-A-T | 20% | 50 | Clear copy; no people, proof or case studies |
| On-page SEO | 15% | 80 | Titles, descriptions and headings are solid |
| Schema | 15% | 25 | Only FAQPage; no Organization/LocalBusiness |
| Performance (CWV) | 10% | 55 (Hypothesis) | Not measured; the H1 is hidden until JS runs |
| Images | 10% | 85 | Alt text present; OG image 100 KB PNG |
| AI search readiness (GEO) | 5% | 40 | No llms.txt, no entity schema |

## Fixed since the last audit
| Element | Now | |
|---|---|---|
| `https://lognlabs.com.py` | 200, `server: cloudflare` | ✅ |
| DNS | Cloudflare IPs (`104.21.12.223`, `172.67.196.128`) | ✅ |
| `www.lognlabs.com.py` | 301 → `https://lognlabs.com.py/` | ✅ |
| `http://` | 301 → `https://` | ✅ |
| `og:url` / `og:image` | `https://lognlabs.com.py/...` on all 3 pages | ✅ |

## Still open

| Element | Value | Severity |
|---|---|---|
| `<link rel="canonical">` | Missing on every page | 🔴 Critical |
| `log-n-labs.pages.dev` + branch previews | 200, no `X-Robots-Tag`, no redirect: duplicate hosts | 🔴 Critical |
| `sitemap.xml` | 404 | ⚠️ Warning |
| `robots.txt` | Cloudflare content-signals comments only; no `Sitemap:` | ⚠️ Warning |
| HSTS | No `Strict-Transport-Security` header on the apex | ⚠️ Warning |
| Organization / LocalBusiness schema | Missing | ⚠️ Warning |
| H1 hidden until `main.js` runs | Likely LCP delay | ⚠️ Warning |
| E-E-A-T (team, clients, cases) | No names, testimonials or cases | ⚠️ Warning |
| Home meta description | 169 chars | ⚠️ Warning |
| FAQPage schema | Valid, but no rich result for commercial sites | ℹ️ Info |
| `llms.txt` | 404 | ℹ️ Info |
| Titles / H1 / alt / lang / 404 noindex / trailing-slash 308 | OK | ✅ Pass |

## Detailed findings

### 1. 🔴 No canonical, and pages.dev is still a live duplicate — Confirmed
- **Evidence:** No `rel="canonical"` in any served page. `curl -I https://log-n-labs.pages.dev` → `200` with no `X-Robots-Tag` and no redirect. Every push to a branch also creates `<branch>.log-n-labs.pages.dev`.
- **Impact:** Google was crawling pages.dev while the apex was down, so it may already treat pages.dev as canonical. Without a canonical or redirect, ranking signals can stay split between hosts or stick to pages.dev.
- **Fix:**
  - Add `<link rel="canonical" href="%%SITE_URL%%/">` to `src/index.html`, and the `/software/` and `/marketing/` equivalents to the other two pages.
  - Add `src/_headers`:
    ```
    https://:project.pages.dev/*
      X-Robots-Tag: noindex
    ```
    Or, better, add a Cloudflare Bulk Redirect `log-n-labs.pages.dev/*` → `https://lognlabs.com.py/$1` (301). That doesn't affect branch previews, which stay noindex via `_headers`.

### 2. ⚠️ No sitemap, and robots.txt has no directives — Confirmed
- **Evidence:** `/sitemap.xml` → 404. `/robots.txt` is Cloudflare's managed content-signals text with no `User-agent`/`Sitemap` lines.
- **Fix:**
  - Add `src/sitemap.xml` with the 3 URLs on `https://lognlabs.com.py` and `lastmod`.
  - Add `src/robots.txt` with `User-agent: *`, `Allow: /` and `Sitemap: https://lognlabs.com.py/sitemap.xml`. If Cloudflare's "managed robots.txt" setting is on, it will prepend its signals. Decide `ai-input`/`search` there; allowing them helps AI citations for a lead-gen site.
  - Then verify the domain in Search Console (DNS TXT via Cloudflare), submit the sitemap and request indexing of the 3 URLs.

### 3. ⚠️ HSTS missing — Confirmed
- **Evidence:** No `strict-transport-security` header on `https://lognlabs.com.py` (Vercel used to send one).
- **Fix:** Cloudflare → SSL/TLS → Edge Certificates → enable HSTS (max-age 6 months+, include subdomains once `www` is confirmed HTTPS-only). Also turn on "Always Use HTTPS" if it isn't already. `http` already 301s, so that may be a Page Rule.

### 4. ⚠️ No entity schema — Confirmed
- **Evidence:** The only JSON-LD is `FAQPage` on `/software/` and `/marketing/`. There's none on `/`.
- **Fix:**
  - On `/`, add a `ProfessionalService` block: name, url, logo, image, description, address (Asunción, PY), areaServed Paraguay, telephone, email, contactPoint (WhatsApp), sameAs (social / Google Business Profile once they exist). Also add a `WebSite` block.
  - On the subpages, add `Service` (provider → the organization) and `BreadcrumbList`.
  - Keep the FAQPage blocks if you want them for AI answers, but keep their text identical to the visible FAQ.

### 5. ⚠️ The hero H1 is invisible until JavaScript runs — Likely
- **Evidence:** `styles.css`: `.js .hero:not(.laid) .cell{visibility:hidden}`. The H1 is inside `.cell.c1` (`src/index.html:45-50`). `.laid` is set by `main.js` at the end of `<body>`. The head also loads three Google Font families, a render-blocking stylesheet and a synchronous `analytics.js`.
- **Impact:** LCP waits for `main.js`, which hurts mobile LCP.
- **Fix:** Give `.c1` its final position in CSS and exclude it from the hidden rule. Add `defer` to `analytics.js`. Trim font weights or preload the heading font. Measure once a PageSpeed run is possible.

### 6. ⚠️ E-E-A-T is thin — Confirmed
- **Evidence:** The team section names roles but no people. There are no client logos, testimonials, case studies or social profiles.
- **Fix:** Add named team members (photo, one-line background, LinkedIn), 2–3 case studies with results in guaraníes, testimonials and a Google Business Profile.

### 7. ⚠️ On-page refinements — Confirmed
- Trim the home meta description from 169 to about 150 chars.
- Make sure "software y marketing para pymes en Paraguay" appears in plain text near the top of `/`.
- Optional: per-page OG images.

### 8. ℹ️ GEO and content
- Add a short `/llms.txt` (who, services, city, contact, the 3 URLs).
- Grow with vertical/service pages and real case studies. Don't add city pages beyond the areas you actually serve.

## Environment limitations
- **PageSpeed Insights API:** "Quota exceeded … Queries per day" again. The no-key quota is shared globally, so it's often exhausted.
- **Local Lighthouse via npx:** blocked by the session's permission policy.
- **Playwright browser:** locked by another session.
- **Result:** Core Web Vitals are unmeasured, and the performance score is a code-review hypothesis. Run https://pagespeed.web.dev/ on `https://lognlabs.com.py/` in a browser to fill this in.
- **Off-site factors:** no Search Console or backlink data.
