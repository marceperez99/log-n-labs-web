# SEO Action Plan — Log N Labs

Updated 2026-11-19 (round 3, score 80). Evidence is in `FULL-AUDIT-REPORT.md`.

## Done
- ~~Domain → Cloudflare Pages; www/http 301; `SITE_URL`~~
- ~~Canonicals, robots.txt, sitemap.xml, llms.txt~~ (branch `seo-improvements`)
- ~~HSTS + noindex on pages.dev hosts (`src/_headers`)~~
- ~~ProfessionalService / WebSite / Service / BreadcrumbList schema; FAQPage synced~~
- ~~Hero H1 paints at first paint; analytics deferred; contrast fix; placeholders removed~~

## P0 — Owner
1. Review the preview at https://seo-improvements.log-n-labs.pages.dev and merge `seo-improvements` into `main`.
2. Google Search Console: verify `lognlabs.com.py` (DNS TXT), submit `https://lognlabs.com.py/sitemap.xml`, and request indexing of the 3 URLs.
3. Create a Google Business Profile for Asunción.

## P1 — Needs owner content (the gap to 90)
4. Team: names, one-line backgrounds, LinkedIn. Then add `Person` schema and `sameAs`.
5. Proof: 2–3 results or testimonials (anonymized is fine).
6. Optional: extend the home meta description toward ~150 chars.

## P2 — Technical polish
7. Self-host or preload the display fonts.
8. Optional: Bulk Redirect `log-n-labs.pages.dev/*` → `https://lognlabs.com.py/$1`.
9. Re-run pagespeed.web.dev on production after the merge.

## P3 — Ongoing
10. Add case-study and vertical pages from real projects, and one guide per quarter.
11. Review Search Console monthly.
