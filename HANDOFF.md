# Log N Labs website: implementation brief

This folder is the design handoff for the Log N Labs website (a digital agency in Asunción, Paraguay: software, consulting and marketing for SMBs). Build it as a production website. The design files are a **reference for layout, copy, colors and behavior**, not code to copy as-is.

## What's in here

| Path | What it is |
|---|---|
| `design/Main.dc.html` | Home hero (dark): the animated "recursive halving" hero. **Main reference for the hero.** |
| `design/Light.dc.html` | Same hero, light theme (it embeds Main with light colors). |
| `design/Home.dc.html` | Full home page: hero + all sections below it. `tema` prop switches dark/light. |
| `design/HomeClaro.dc.html` | Home page, light theme (wrapper). |
| `design/LandingSoftware.dc.html` | Landing page for software services. |
| `design/LandingMarketing.dc.html` | Landing page for marketing services. |
| `logos/*.svg` | The four official logo variants. Use these SVGs, do not redraw. |

### How to read the `.dc.html` files

They come from a design tool. Each file is a template plus a small JS class:
- `{{name}}` holes are values computed in `renderVals()` at the bottom of the file.
- `<sc-for list="{{items}}" as="x">` is a loop and `<sc-if value="{{cond}}">` is a conditional.
- `<dc-import name="Main" ...>` embeds another file with props.
- `data-props` on the script tag lists the design-time controls and their **default values. Those defaults are the intended design.**
- Inline `style` attributes carry the exact spacing, sizes and fonts.

Take **all copy verbatim** from these files (Spanish, Paraguayan/rioplatense "vos" voice). Text in `[brackets]` is a placeholder the owner still has to provide. Keep it as a clearly marked TODO, never invent it.

## Stack

- Next.js (App Router) + TypeScript + React. Static where possible.
- Styling: Tailwind CSS with the tokens below as theme colors, or CSS variables + CSS modules. Pick one and be consistent.
- Fonts via `next/font/google`: **JetBrains Mono** (400, 500), **Space Grotesk** (400, 500, 600) and **Unbounded** (600, 700).
- No animation library needed: CSS transitions + small React hooks.

## Routes

- `/`: home (`Home.dc.html`)
- `/software`: software landing
- `/marketing`: marketing landing

Shared header, footer and contact block across pages.

## Design tokens

Dark is the default theme. Implement both themes with CSS variables; a light theme toggle is optional (the light version is a validated alternative).

| Token | Dark | Light | Use |
|---|---|---|---|
| `bg` | `#17120F` (Ink) | `#F4EFE7` (White) | page background |
| `surface` | `#241C17` | `#E9E1D4` (Paper) | cards, chips, panels |
| `line` | `#3A2F28` | `#D6CBBB` | borders, dividers, hero cut lines |
| `fg` | `#F4EFE7` | `#17120F` | main text |
| `muted` | `#9A8F85` (Stone) | `#6B625A` (Stone dark) | secondary text |
| `accent` | `#B83A0E` (rust) | `#B83A0E` | CTA buttons, final hero cell, CTA band background |
| `detail` | `#E2582A` | `#B83A0E` | small accent text and marks (step numbers, active stepper, "O(log n)") |
| `onAccent` | `#F4EFE7` | `#F4EFE7` | text on rust |

Contrast rule: never put `accent` #B83A0E as small text on the dark background (only about 3.2:1). Use `detail` for that.

Typography: headings (h1/h2) are JetBrains Mono 400 with tight letter-spacing (-0.02 to -0.03em). Card titles and service names are Unbounded 600/700. Body is Space Grotesk. Small section labels are lowercase JetBrains Mono 12px in `muted` (e.g. "servicios").

Logo: dark background uses `on-ink`, light background uses `on-white`, and on a rust background use `on-rust`. Header logo height is 22 to 26px.

## The hero (most important piece)

The screen starts empty. Then it is cut in half, the remaining part is cut in half again, and so on: **6 cuts**, always across the **longer side** of the remaining rectangle. On landscape this forms a spiral that closes into the bottom-right corner; on portrait the first cut is horizontal. The same rule handles both.

Geometry (port `geom()` from `Main.dc.html`):

```ts
type Rect = { x: number; y: number; w: number; h: number };
function halvingCells(W: number, H: number, cuts = 6) {
  let r: Rect = { x: 0, y: 0, w: W, h: H };
  const cells: Rect[] = [];
  const lines: { vertical: boolean; x: number; y: number; len: number }[] = [];
  for (let i = 0; i < cuts; i++) {
    if (r.w >= r.h) {
      const w = r.w / 2;
      cells.push({ x: r.x, y: r.y, w, h: r.h });
      lines.push({ vertical: true, x: r.x + w, y: r.y, len: r.h });
      r = { x: r.x + w, y: r.y, w, h: r.h };
    } else {
      const h = r.h / 2;
      cells.push({ x: r.x, y: r.y, w: r.w, h });
      lines.push({ vertical: false, x: r.x, y: r.y + h, len: r.w });
      r = { x: r.x, y: r.y + h, w: r.w, h };
    }
  }
  cells.push(r); // final small cell
  return { cells, lines };
}
```

- Compute from the **viewport size** (full-screen hero, `100svh`). Recompute on resize.
- Sequence: about 600ms delay, then one step every ~700ms. At each step, the cut line draws (scaleX or scaleY from 0 to 1, about 560ms, `cubic-bezier(.7,0,.2,1)`), then that cell's content fades in and rises 12px (opacity 500ms, transform 700ms, delay about 45% of the step). After the 6th cut, the final cell fills with `accent` (scaleY from the top, 600ms). It shows the `on-rust` logo plus a "SCROLL" arrow and scrolls to the next section.
- Play once on load. Do **not** loop in production (the loop in the design file is only for preview).
- `prefers-reduced-motion`: show the final state immediately.

Content per cell (largest to smallest):
1. Logo, h1, paragraph, "Hablemos" CTA
2. Nav (Servicios, Trabajo, Nosotros, Contacto) + services rotator
3. Contact (¿Tenés un proyecto?, email, WhatsApp)
4. "Cómo trabajamos" (3 steps)
5. Asunción, Paraguay, GMT−3
6. "O(log n)" in `detail` color
7. Final cell: accent fill, on-rust logo, scroll arrow

**Services rotator** (cell 2): it cycles **Software → Consultoría → Marketing** every 4.5s in the same space. The outgoing item fades out and moves up 16px, then the incoming one fades in from 16px below (450ms/650ms, 180ms delay). Below it is a **static stepper**: three equal 2px segments, with the active one filled with `detail`, plus a "1/3" counter. Clicking a segment jumps to that category and restarts the timer. The rotation starts when cell 2 appears. Pause it while the hero is off-screen.

**Small screens:** the cells get too small for content below roughly 768px width. On mobile, keep the cut animation as background lines only and stack the content (logo, h1, paragraph, CTA, rotator) normally over it. The final accent cell can stay as the scroll button.

## Home page sections (below the hero)

Take them from `Home.dc.html` in order: **por qué log n** (text + O(n) vs O(log n) SVG chart, computed path), **servicios** (halving grid: Software takes the left half, Consultoría and Marketing are quarters on the right, labeled 1/2 and 1/4), **cómo trabajamos** (3 steps with bars at 100/50/25% width), **para quién** (2×2 problem → solution), **preguntas** (accordion, first item open), **contacto** (heading + contact rows + form), footer.

Grids with 1px dividers are built as a container with `background: line; gap: 1px` and cells with `background: bg`. Keep that technique; it produces the "cut" lines.

## Landing pages

- `/software`: hero with an animated **binary search** over 16 sorted values (target 71; one step per ~1.3s, dim the discarded half, outline the midpoint, fill the found cell with accent, hold 3.2s, restart; pause when off-screen), then señales, qué construimos (halving grid), stack + principles, 5-step process, 3 engagement plans, FAQ, rust CTA band, footer.
- `/marketing`: hero with the **halving square** (600×600, 5 cuts, labels "Todo el mercado → Tu rubro → Tu zona → Buscan lo que vendés → Listos para comprar → Tu cliente", last cell in accent), then problema, 3 services with deliverable chips, 4-step cycle, sample monthly report (values shown as "—"), 3 plans, FAQ, CTA band, footer.

## Contact form

The design has: Nombre, Empresa, Email o WhatsApp, a multi-select of buttons ("¿Qué necesitás?": Software / Consultoría / Marketing / Todavía no sé), and Mensaje. Implement it with validation and a Next.js server action. **The delivery method is not decided yet**: leave a clearly marked TODO with a pluggable sender (email provider or webhook). The "Escribinos por WhatsApp" buttons should use a `https://wa.me/<number>` link from an env/config value.

## Quality bar

- Semantic HTML, a single h1 per page, real `<button>`/`<a>`/`<label>`, visible focus states, and `aria-expanded` on the accordion.
- Text contrast at least 4.5:1, using the token pairs above.
- Lighthouse performance and accessibility of 90 or more. Animations use only transform and opacity.
- Responsive from 360px to 1920px. Desktop design width is 1440 with 56px side padding.
- SEO: title and description per page in Spanish, Open Graph using the logo, `lang="es"`.

## Open items (ask the owner, don't invent)

Email, WhatsApp number, social links, prices ("[desde Gs. —]"), response time, support/maintenance terms, code ownership statement, delivery cycle length "[N] semanas", whether ad spend is billed separately, and the "Trabajo" nav link (no case studies yet: hide it or point it to a "próximamente").
