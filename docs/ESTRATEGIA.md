# Log N Labs: market gap, positioning and roadmap

Version 1.0 · 15 November 2026 · prepared with the ceo-advisor framework (Bottom line → What → Why → How to act → Your decision).

Confidence tags: 🟢 verified in a public source · 🟡 reasonable inference from sources · 🔴 assumption to validate with real clients.

---

## 1. Bottom line

Position Log N Labs as **the team that connects the ad with the sale and the invoice** for Paraguayan small businesses that sell through WhatsApp, Instagram and a physical store.

- Marketing agencies in the local SMB segment sell posts and reach, not sales.
- Software shops build systems but don't bring customers in.
- Invoicing and payments are being commoditized by DNIT and Bancard.

Nobody small owns the path in between: *ad → WhatsApp conversation → order → QR payment → electronic invoice → report of what each sale cost*. Log N Labs already has both halves of the skill set.

Do it in this order:
1. Sell services now (marketing with measurement, plus integration software).
2. Use the repeated work from those clients to build one small SaaS product.
3. Charge for the product once 5 to 10 pilot clients use it every week.

---

## 2. What the research says

### 2.1 The market

| Finding | Source | Tag |
|---|---|---|
| 420,109 MIPYMES operating in 2024 | DIRGE data via the Viceministerio de MIPYMES ([InfoNegocios](https://infonegocios.com.py/nota-principal/gustavo-gimenez-para-el-segundo-semestre-trabajamos-en-el-lanzamiento-de-una-tc-mipyme-para-acompanar-los-procesos-de-formalizacion)) | 🟢 |
| MIPYMES are 98% of firms and about 73% of employment | [UNDP Paraguay](https://www.undp.org/es/node/515751) | 🟢 |
| About 1 in 10 firms has taken concrete steps toward digital transformation | UNDP, citing a 2024 study | 🟢 |
| 10% of MIPYMES have no internet; 31% have more than 100 Mbps | [UNDP](https://www.undp.org/es/node/535911), citing Pereira (2025) | 🟢 |
| E-commerce passed USD 2,000 M in 2025, is projected near USD 3,000 M, and doubled transactions in H1 2026 | [ABC Color, Aug 2026](https://www.abc.com.py/economia/2026/08/03/comercio-electronico-en-paraguay-se-acerca-a-us-3000-millones-y-el-qr-concentra-el-85-de-los-pagos/) | 🟢 |
| 92% of digital buyers buy from local stores; the average ticket is Gs. 82,600 | same | 🟢 |
| SMBs sell mostly through Instagram, fan pages and WhatsApp, not full online stores | [InfoNegocios](https://infonegocios.com.py/nota-principal/hay-que-aprovechar-mipymes-tienen-potencial-de-negocios-por-us-1-700-millones-en-comercio-electronico) | 🟢 |
| QR is 68.1% of digital payments; 181,000+ merchants accept it; 75+ apps share the PY-QR standard | [ABC Color, Aug 2026](https://www.abc.com.py/negocios/2026/08/06/paraguay-ultimo-en-facturar-bueno-en-pagar-con-qr-y-ya-prueba-el-qr-hub/) | 🟢 |
| Bancard: about 85,000 of its 160,000 merchants are SMBs; TPago payment links are sent over WhatsApp | Bancard coverage via [yo-facturo](https://yo-facturo.com/blog/bancard-pago-movil-qr/) and press | 🟡 |

### 2.2 The deadline that forces the decision: electronic invoicing (SIFEN)

| Finding | Source | Tag |
|---|---|---|
| RG DNIT 52/2026 sets mandatory e-invoicing for groups 19 to 24 | [impuestospy.com](https://impuestospy.com/impuestos/resolucion-general-dnit-n-52-2026/) | 🟢 |
| Start dates: 1 Jun 2026, 1 Sep 2026, **1 Dec 2026, 2 Mar 2027, 1 Jun 2027, 1 Sep 2027** | same | 🟢 |
| The groups explicitly include small taxpayers; they are notified through the Marandu mailbox | same | 🟢 |
| 50,000+ taxpayers already issue e-invoices; DNIT projects 90% of invoices electronic by the end of 2026 | [DNIT](https://www.dnit.gov.py/web/portal-institucional/w/paraguay-supera-los-50.000-facturadores-electr%C3%B3nicos-y-avanza-en-la-digitalizaci%C3%B3n-tributaria), [La Nación](https://www.lanacion.com.py/negocios/2026/06/06/digitalizacion-proyectan-que-el-90-de-las-facturas-seran-electronicas-este-2026/) | 🟢 |
| Free option: e-Kuatia'i (DNIT). Paid option: Bancard POS/web invoicing at Gs. 89,900/month | [Última Hora (sponsored)](https://www.ultimahora.com/comercios-ya-pueden-emitir-factura-electronica-desde-el-pos) | 🟢 |
| Local SMB management systems with SIFEN exist (YoFacturo, Zeus/Netsystem) | search results | 🟡 |

**What this means.** A plain invoicing tool is not a gap. It is free from the state, Gs. 89,900 from the largest processor, and already offered by local software. The gap is the work around it:
- connecting the invoice to where the sale happens (WhatsApp, the store, the website);
- connecting the sale to the ad that brought it.

Every business in groups 21 to 24 has a dated reason to reorganize how it sells in the next 10 months. 🟡

### 2.3 The marketing side

| Finding | Source | Tag |
|---|---|---|
| "We manage your social media" packages are advertised from 100,000 to 300,000 per month | [InfoNegocios, "Agencias de paquete"](https://infonegocios.com.py/default/agencias-de-paquete-cuando-lo-barato-sale-caro) | 🟢 |
| Those packages put 10+ clients on one designer, offer no strategy and don't measure sales | same | 🟢 |
| Established agencies sit at about USD 100–149 per hour with USD 5,000 minimums (Clutch listing) | [Clutch](https://clutch.co/py/agencies.md) | 🟡 |
| No public data on how many SMBs measure cost per sale from ads | none found | 🔴 |

**What this means.** There is a cheap tier that doesn't measure anything and an expensive tier built for large companies. In between there is room for a mid-priced service that reports in guaraníes per sale, not in likes. 🟡

---

## 3. Gaps identified

1. **Ads are measured in reach, sales are recorded in a notebook.** Conversations start in WhatsApp from a Meta ad. Then the order, the payment and the invoice happen in three different places. Nobody can say what a sale cost. 🟡
2. **E-invoicing is solved as an isolated obligation.** Businesses adopt e-Kuatia'i or a POS to comply, and keep typing the same data twice. 🟡
3. **Visual identity is often missing or inconsistent**, which raises ad costs and lowers trust in a WhatsApp chat with a stranger. 🔴
4. **No mid-priced provider covers both marketing and software**, so the owner has to coordinate two or three vendors. 🟡

---

## 4. Strategic options (Tree of Thought)

Scored 1–5 on each criterion. Weights follow the skill's capital-allocation logic: speed to cash and fit with current skills matter most at this stage.

| Criterion (weight) | A. Generalist agency | B. Invoicing SaaS | C. Ad-to-invoice for WhatsApp sellers |
|---|---|---|---|
| Time to first revenue (0.25) | 4 | 2 | 4 |
| Fit with current team skills (0.20) | 4 | 3 | 5 |
| Differentiation vs local competitors (0.20) | 1 | 1 | 4 |
| Recurring revenue potential (0.15) | 2 | 4 | 4 |
| Reversibility if it fails (0.10) | 5 | 2 | 4 |
| Size of reachable market (0.10) | 4 | 4 | 3 |
| **Weighted score** | **3.20** | **2.50** | **4.10** |

- **A. Generalist agency (today's site).** "Marketing and technology for growing businesses" describes what half the agencies in Asunción say. Low risk, but price becomes the only lever.
- **B. Build an invoicing SaaS.** The obligation is real but the product is already free or cheap from DNIT and Bancard. It needs DNIT certification work and support at scale before it earns anything. Rejected.
- **C. Ad-to-invoice for SMBs that sell over WhatsApp.** It uses both skill sets, sells today as services, and the product grows out of repeated client work instead of a guess. **Recommended.**

Second-order effects of C:
- We integrate *with* e-Kuatia'i, Bancard and other providers instead of competing with them. That keeps the product small and gives us referral partners. 🟡
- Main risk: Meta changes WhatsApp Business API pricing or rules. Mitigation: the product must also work with manual entry, without depending on the API. 🟡

---

## 5. The business

**One sentence (for the whole team):** Log N Labs helps small businesses in Paraguay know which ad brought each sale, by building the brand, running the campaigns and connecting WhatsApp, payment and invoice in one record.

### 5.1 Lines of work

| Line | What it is | How it's billed |
|---|---|---|
| **Marketing** | Strategy, visual identity, Meta and Google campaigns with conversion tracking into WhatsApp and sales | Identity: one-time project. Campaigns: monthly fee; ad spend paid by the client directly to the platform |
| **Software** | Websites, custom systems, integrations (SIFEN providers, Bancard/QR, WhatsApp Business, spreadsheets, existing ERPs), QA and audits of existing software | Fixed-scope project + optional monthly maintenance |
| **Product (SaaS)** | A small tool where each WhatsApp conversation becomes an order, then a payment and an invoice, with the source ad attached. Working name: **Cuaderno** | Monthly subscription in guaraníes, after the pilot |

**Why "Cuaderno":** the product replaces the notebook where many shops write orders and *fiado*. It is a working name only; check trademark availability before using it publicly. 🔴

### 5.2 Ideal client (first 12 months)

- Sells through Instagram/Facebook + WhatsApp, with or without a store, in Gran Asunción or Central. 🔴
- Already spends or wants to spend on Meta ads.
- Is in SIFEN groups 21–24, or has just been incorporated and is unhappy with double data entry.
- Has 1 to 20 employees. The owner makes the decisions.
- Example sectors: clothing and accessories, cosmetics, food and pastry by order, hardware and spare parts, clinics and workshops that book appointments over WhatsApp.

### 5.3 What we don't do (to protect focus)

- Monthly social media "packages" with a fixed number of posts and no measurement.
- Our own invoicing engine or DNIT certification.
- Large corporate ERP implementations.

---

## 6. Roadmap (seed stage: 3 / 6 / 12 months)

### Months 0–3 · Dec 2026 – Feb 2027 · "Sell what we already know"

- Publish the new site (this content). Drop the generic positioning.
- Launch two fixed-scope entry offers:
  - **Diagnóstico de ventas:** one week. We map how a sale moves from ad to invoice and deliver a written plan with costs.
  - **Puesta en marcha:** we set up conversion tracking, a WhatsApp catalog and quick replies, the connection to the client's invoicing provider, and a first campaign.
- Use the 1 Dec 2026 and 2 Mar 2027 SIFEN dates in outreach. Inform, don't scare.
- Sign 6 to 8 paying clients. Document 3 cases with real figures and the client's written permission.
- Find 2 partners: an accounting firm and an invoicing provider who refer clients that already invoice electronically but sell disorganized.

### Months 3–6 · Mar – May 2027 · "Turn the repeated work into a product"

- From the 6–8 clients, list which steps we repeat by hand. Build them as the first version of Cuaderno:
  - order record from WhatsApp;
  - order status;
  - payment link or QR;
  - sending to the invoicing provider;
  - weekly report of cost per sale by campaign.
- Run a free pilot with 5–10 of our own clients. The pilot is a success when **at least 5 businesses use it every week for 6 consecutive weeks**. Below that, don't charge yet. Fix the product or drop it.
- Publish the case studies on the site (the "Casos" section replaces the "Para quién" examples).

### Months 6–12 · Jun – Nov 2027 · "Charge and repeat"

- Open paid Cuaderno plans. Target: 30–50 paying businesses by November 2027. 🔴
- Services stay the main revenue line. Target: monthly fees cover the team's fixed costs. 🔴
- First hire, depending on which is the bottleneck: account manager for campaigns, or a support/onboarding person for the product.
- Decide on expansion to Alto Paraná or Itapúa only if Gran Asunción churn is under 5% per month.

### Capital allocation (from the skill)

1. Keep the lights on: services revenue pays salaries first.
2. Protect the core: QA and support for existing clients before new features.
3. Grow the core: the two entry offers and partners.
4. New bets: Cuaderno gets at most 30% of team hours until the pilot target is met.

---

## 7. Metrics to review every month

| Metric | Target at month 6 | Target at month 12 |
|---|---|---|
| Paying service clients | 8 | 15 |
| Share of revenue that is monthly recurring | 40% | 60% |
| Clients whose cost per sale we can report | 100% of campaign clients | 100% |
| Cuaderno weekly active businesses | 5 (pilot) | 30 |
| Monthly client churn | < 8% | < 5% |
| Months of runway | > 6 | > 12 |

All targets are 🔴 assumptions. Replace them after the first quarter with real numbers.

---

## 8. Decisions for the owners

1. **Approve positioning C** ("del anuncio a la factura"), or keep the generalist message.
2. **Product name:** keep "Cuaderno" as a working name, or choose another, and check the trademark at DINAPI.
3. **Prices** for the two entry offers and the monthly plans. The site shows `[desde Gs. —]` until then.
4. **Ad spend:** confirm that the client pays Meta/Google directly (recommended: transparent, and no float risk for us).
5. **Pilot clients:** name the first 5 businesses to invite.
6. **Voice:** the copy uses neutral Spanish addressed as *tú*, with no *voseo*. The main message is loss-based ("que no se te escape ninguna venta"), and "del anuncio a la factura" remains the description of the method. This replaces the HANDOFF rule (the "vos" voice), which should be updated.
