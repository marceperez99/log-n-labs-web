# SEO Action Plan — Log N Labs

Updated 2026-11-19, after the deployment fix. Ordered by impact; evidence is in `FULL-AUDIT-REPORT.md`.

## Done
- ~~Point `lognlabs.com.py` / `www` at Cloudflare Pages~~ (200; www and http 301 to the apex)
- ~~Set `SITE_URL`~~ (`og:url` / `og:image` now use `https://lognlabs.com.py`)

## P0 — Now
1. **Add `rel="canonical"`** (`%%SITE_URL%%`-based) to the 3 pages.
2. **Stop pages.dev competing with the real domain:**
   - Bulk Redirect `log-n-labs.pages.dev/*` → `https://lognlabs.com.py/$1` (301).
   - Add `src/_headers` with `X-Robots-Tag: noindex` for `https://:project.pages.dev/*` (this covers branch previews).
3. **Add `src/sitemap.xml` and `src/robots.txt`** (with a `Sitemap:` line).
4. **Google Search Console:** verify the domain, submit the sitemap and request indexing of `/`, `/software/` and `/marketing/`.

## P1 — This week
5. Enable HSTS and "Always Use HTTPS" in Cloudflare.
6. Add `ProfessionalService` + `WebSite` JSON-LD to `/`, and `Service` + `BreadcrumbList` to the subpages.
7. Create a Google Business Profile (Asunción) and link it and your social profiles through `sameAs`.

## P2 — This month
8. Let the hero H1 paint without `main.js`. Add `defer` to `analytics.js`. Trim the fonts. Measure in pagespeed.web.dev, targeting LCP < 2.5 s, INP < 200 ms and CLS < 0.1.
9. Trim the home meta description to about 150 chars.
10. E-E-A-T: named team members, 2–3 case studies and testimonials.
11. Add `/llms.txt`.

## P3 — Ongoing
12. Add vertical/service pages and a case-study index, plus one useful guide per quarter.
13. Review Search Console coverage and queries monthly.
