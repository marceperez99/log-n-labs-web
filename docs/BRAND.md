# Log N Labs — Brand Guide

Version 1.0 · November 2026 · Asunción, Paraguay

---

## 1. Concept

**Log N Labs** is an engineering-led digital agency for small and medium businesses: software, websites, visual identity, marketing strategy and campaigns, tooling and process engineering.

The name comes from **O(log n)**, the complexity class of the most efficient algorithms: they stay fast as the problem grows.

- **Brand promise:** results that scale without the cost scaling with them.
- **Visual idea, "Halving Cuts":** log n means repeatedly cutting the problem in half, as in a binary search. The wordmark shows that search: each letter of "Log N" gets one more halving cut than the last, until the N is found.
- **Attitude:** a tech lab, not a traditional ad agency. Smart, confident, modern, precise. Warm rather than cold.

---

## 2. Logo

### 2.1 The wordmark

**Log N Labs**, in title case, set in **Unbounded**:

| Part | Weight | Role |
|---|---|---|
| "Log N" | Light 300 | The method: thin strokes that carry the cuts |
| "Labs" | SemiBold 600 | The place: solid, uncut, anchors the mark |
| **N** | Light 300, in the accent colour | The result the search lands on |

The letters are outlined vectors. Never retype the logo in a font; always use the SVG files.

### 2.2 Construction: the halving cuts

Each cut is a straight, horizontal gap of negative space. Every cut is placed as a fraction of **that letter's own height**, measured from the top of the letter to the baseline:

| Letter | Cuts | Positions (from the top of the letter) |
|---|---|---|
| L | 0 | — whole |
| o | 1 | ½ |
| g | 2 | ½, ¼ (the descender is untouched) |
| N | 3 | ½, ¼, ⅛ |
| Labs | 0 | — solid: the search is over |

- **Gap thickness:** 5% of the N's cap height. In the master artwork the cap height is 150 units and the gap is 7.5 units.
- **The g's opening** sits on the same horizontal line as its ½ cut, so no stray fragments are left behind.
- The three cuts on the N converge on its top edge. The ⅛ sliver at the top is the "found" piece.

**Master artwork** (SVG viewBox `0 0 1329 190`, set at a 200 px font size):

- Cap height: 150 (from y 4 to y 154)
- x-height top: y 38.8
- Baseline: y 154
- g descender: down to y 189.6
- Cut centres:
  - o: y 96.4
  - g: y 96.4 and y 67.6
  - N: y 79, y 41.5 and y 22.75

### 2.3 Colourways

All four files are transparent SVGs, sized 1329 × 190.

| File | Use on | "Log" + "Labs" | N |
|---|---|---|---|
| `log-n-labs_on-ink.svg` | Ink and other dark backgrounds | White `#F4EFE7` | Rust bright `#E2582A` |
| `log-n-labs_on-white.svg` | White, Paper and other light backgrounds | Ink `#17120F` | Rust `#B83A0E` |
| `log-n-labs_on-rust.svg` | Rust `#B83A0E` blocks | White `#F4EFE7` | White `#F4EFE7` |
| `log-n-labs_mono-ink.svg` | One-colour print: stamps, engraving, fax | Ink `#17120F` | Ink `#17120F` |

**Rule:** the N carries the accent, and nothing else in the logo does. On a Rust background, the accent *is* the background, so the whole mark goes White.

### 2.4 Clear space and minimum size

- **Clear space:** keep at least the height of the N (the cap height) empty on every side of the wordmark.
- **Minimum size:**
  - Digital: 120 px wide.
  - Print: 30 mm wide.
  - Below these sizes the Light strokes thin out and the cuts start to fill in. Use a dedicated icon instead (see open items).

### 2.5 Don'ts

- Don't retype the logo in a live font, or change its weights.
- Don't add, remove, move or re-angle the cuts. They are always horizontal, and always ½ · ¼ · ⅛.
- Don't put the accent colour anywhere in the logo except the N.
- Don't use Rust `#B83A0E` for the N on dark backgrounds; use Rust bright `#E2582A`.
- Don't stretch the logo, outline it, add shadows or gradients, or rotate it.
- Don't place the logo on busy photos without a solid panel behind it.

---

## 3. Colour

### 3.1 Rust scale (brand colour)

| Name | Hex | Role |
|---|---|---|
| Ember | `#4A1906` | Deep accent surfaces, footers, dark cards |
| Rust deep | `#8C2C0A` | Links and hover states on light backgrounds |
| **Rust (core)** | **`#B83A0E`** | The brand colour: buttons, the logo N on light, key highlights |
| Rust bright | `#E2582A` | The accent on dark backgrounds; dark-mode buttons |
| Rust light | `#F07A4E` | Highlights and illustration, on dark only |
| Blush | `#F6D3C3` | Tinted backgrounds, tags, selection |

### 3.2 Neutrals

The neutrals are warm, tinted slightly toward the rust rather than plain grey.

| Name | Hex | Role |
|---|---|---|
| Ink | `#17120F` | Main dark background; body text on light |
| Surface | `#241C17` | Cards and panels on dark |
| Line | `#3A2F28` | Borders and dividers on dark (decorative only) |
| Stone | `#9A8F85` | Muted text on dark |
| Stone dark | `#6B625A` | Muted text on light |
| Paper | `#E9E1D4` | Secondary light surface: sections, chips, loader track |
| **White** | **`#F4EFE7`** | The brand white. Warm; never pure `#FFFFFF` |

### 3.3 Support colours

Use them sparingly, for states and charts. They should never compete with Rust.

| Name | Hex | Role |
|---|---|---|
| Pine | `#2E4A3B` | Success and positive data on light |
| Pine light | `#8FB59C` | Success on dark |
| Ochre deep | `#7A5410` | Warnings and highlights on light |
| Ochre | `#D9A13B` | Warnings and highlights on dark |

### 3.4 Light theme (website default)

| Element | Colour |
|---|---|
| Background | White `#F4EFE7` |
| Service chips | Paper `#E9E1D4` fill |
| Text | Ink `#17120F` |
| Muted text | Stone dark `#6B625A` (5.2:1 on White) |
| Accent | Rust `#B83A0E` (5.0:1 on White), for the "Hablemos" button, the final cell, the active services step, and "O(log n)" |

### 3.5 Dark theme

| Element | Colour |
|---|---|
| Background | Ink `#17120F` |
| Cards | Surface `#241C17` |
| Borders | Line `#3A2F28` |
| Text | White `#F4EFE7` |
| Muted text | Stone `#9A8F85` (5.9:1 on Ink) |
| Accent | Rust bright `#E2582A` (5.0:1 on Ink). Buttons are Rust bright with Ink text. |

### 3.6 Contrast (WCAG 2.2)

AA requires at least 4.5:1 for normal text, and at least 3:1 for large text and graphics.

| Pair | Ratio | Verdict |
|---|---|---|
| White on Ink | 16.2:1 | AAA |
| Ink on White | 16.2:1 | AAA |
| Rust deep on White | 7.4:1 | AAA |
| Stone on Ink | 5.9:1 | AA |
| Stone dark on White | 5.2:1 | AA |
| Rust on White | 5.0:1 | AA |
| White text on Rust (buttons) | 5.0:1 | AA |
| Rust bright on Ink | 5.0:1 | AA |
| Ink text on Rust bright | 5.0:1 | AA |
| Stone dark on Paper | 4.6:1 | AA |
| Paper on Rust | 4.4:1 | Large text only |
| Rust on Ink | 3.2:1 | Large text and graphics only; use Rust bright instead |
| Stone on White | 2.8:1 | **Avoid** |

### 3.7 Colours deliberately avoided

These are avoided because they read as "generic AI product":
- purple and violet
- blue-to-purple gradients
- neon cyan or teal
- iridescent "holo" effects

Soft clay or terracotta oranges are also avoided, because they sit too close to other AI brands. Lime is avoided too, as it is the default accent for developer tools.

---

## 4. Typography

| Use | Typeface | Notes |
|---|---|---|
| Logo | Unbounded Light 300 + SemiBold 600 | Outlined in the SVG files; never set live |
| Display and headlines | Unbounded | Regular 400 is used in the motion pieces |
| Notation and code accents | JetBrains Mono | For labels, specs and "O(log n)" details |
| Body and UI text | *Not finalised* | The brief suggested Satoshi or General Sans; the mockups used Manrope |

Unbounded and JetBrains Mono are free on Google Fonts.

---

## 5. Motion

### 5.1 Typing animation: "O(log n)"

This is a square 1080 × 1080 piece on the light theme: a White background, Ink text, and a Rust cursor. The text is Unbounded Regular 400 and stays centred on every step.

1. Types **O(n²)**, with a true superscript 2, then holds for 1.3 s.
2. Erases back to **O(**.
3. Types **n log n)**, then holds for 1.3 s.
4. Erases back to **O(**.
5. Types **log n)**. The final **n** turns from Ink to Rust; nothing else changes colour.

Details:

- **Typing speed:** about 120–130 ms per character, with slight jitter so it feels hand-typed. Erasing runs at 70 ms per character.
- **Cursor:** a Rust bar, about 0.075 em wide, that blinks the whole time (1.06 s cycle, hard on/off).
- **Colour change of the n:** follows a logarithmic curve over 1.4 s:

  `p(t) = log(1 + 99·t) / log(100)`, where `t` runs from 0 to 1.

  The n jumps most of the way to Rust almost immediately, then settles slowly. The motion itself is O(log n).
- **Reduced motion:** shows the final frame, without animation.

### 5.2 Intro: typing to logo and loader

1. Plays the typing animation above, exactly as described.
2. Once the n has finished turning Rust, holds for **1 second**.
3. **O(log n)** fades out over 500 ms (ease-in-out).
4. The **logo** (the `on-white` colourway) fades in over 700 ms, rising 16 px into place (`cubic-bezier(0.16, 1, 0.3, 1)`).
5. **Loading bar:**
   - Placement: 72 px under the logo, and as wide as the logo.
   - Size and colour: 6 px tall, with a Paper `#E9E1D4` track and a Rust `#B83A0E` fill.
   - Fill: over 2.8 s, following the same log curve, so it races to about 70% and then creeps to 100%.
6. Holds for 1.4 s, fades out, and loops.

One full cycle lasts about 16 s.

---

## 6. Files and sources

| Asset | File |
|---|---|
| Logo, dark backgrounds | `log-n-labs_on-ink.svg` |
| Logo, light backgrounds | `log-n-labs_on-white.svg` |
| Logo, Rust backgrounds | `log-n-labs_on-rust.svg` |
| Logo, one colour | `log-n-labs_mono-ink.svg` |
| Intro video | `log-n-labs-intro_1080.mp4` (1080 × 1080, 30 fps) |
| Intro GIF | `log-n-labs-intro_600.gif` (600 × 600, loops) |
| Intro, web | `log-n-labs-intro.html` (self-contained, no font needed) |
| Figma master | "Log N Labs — Logo" in your Figma drafts. It holds the four colourways as components, plus background previews. |
| Design canvas | "Log N Labs Logo Explorations". It holds the explorations, palette board and animation boards. |

---

## 7. Open items

- **Icon / favicon** for sizes below 120 px. Candidates:
  - the N alone with its three cuts, in Rust, on a White or Ink tile;
  - the "square cut in half, then in half again" icon from the Halving Cuts exploration.
- **Body typeface** for the website and documents.
- **Vertical (1080 × 1920) and dark versions** of the intro, for Stories, Reels and dark-mode contexts.
