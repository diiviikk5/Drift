---
name: isometric-brutalism
description: Divik's "isometric brutalism" UI style (from the Drift site): warm paper, thick ink outlines, hard 45° extruded shadows that read as pressable blocks, one loud accent block fill + one hot signal colour, heavy sentence-case display type, light/dark. Use when the user asks for "isometric brutalism", "the Drift style", "my brutalist style", "that UI style from Drift", or wants a new landing page/app styled like Drift. Ships a drop-in CSS file (ib-* classes + tokens) and a living template page.
---

# Isometric Brutalism

A style, not a page. Re-use the *system* (materials, depth, type, motion rules); invent each project's own layout, copy and art. Never copy the Drift site's content or structure wholesale.

Files in this folder:
- `iso-brutal.css`: tokens + `ib-*` component classes (framework-free; works in plain HTML, Next, Vite, Astro).
- `template.html`: a living reference — foundations, every component, and example patterns for a dashboard, pricing, testimonials, blog/docs and an explainer — with an accent switcher and dark mode. Open it in a browser. It is a reference, not a page to copy.

## The five rules that make it this style

1. **Depth is extrusion, never blur.** Every raised thing has a hard 45° block shadow built from stacked 1px offsets (`--ib-ex4` … `--ib-ex14`), the colour of the ink. Deeper = more important (chips 3px, buttons 6px, cards 8px, hero media 14px). No soft drop shadows, no glows, no glassmorphism.
2. **Things press like keys.** Hover lifts (translate −2px, deeper extrusion); active sinks *into* the extrusion (translate +5px, shadow collapses to 1px). Buttons, keycaps, cards all behave physically.
3. **Paper + ink + one loud accent + one hot signal.** Warm off-white paper (`#f3eee2`, never pure white), near-black ink outlines at 3px. The accent (default lime `#d2ff2e`) is a *block fill only*: primary buttons, the highlighted headline word, the final CTA panel, active states. Never accent-coloured text on paper. The hot colour (default pink `#ff3d6e`) is a signal only: dots, kicker stickers, focus rings, one callout. Optional third colour for illustration tags.
4. **Heavy, tight, sentence-case display.** Geist/Inter 900, letter-spacing −0.05 to −0.06em, line-height ~0.92. Never uppercase headlines (uppercase is for chips, kickers and marquees only). The signature move: set **one word** of the H1 on a slightly rotated, extruded accent block (`.ib-block`).
5. **Deliberate imperfection, in small doses.** Kickers and blocks tilt −2°, a marquee band tilts −2°, hovered cards rotate −0.6°. One or two tilted things per viewport, never everything.

## Components (all in `iso-brutal.css`)

- **Core:** `ib-btn` (`--paper`, `--ink`, `--lg`, `--sm`, `--icon`) · `ib-chip` + `ib-dot` · `ib-badge` · `ib-tag` · `ib-kbd` · `ib-kicker` · `ib-h1/h2/h3`, `ib-lead`, `ib-body`, `ib-note`, `ib-mono` · `ib-block` (accent word) · `ib-card` (`--hover`, `--accent`) · `ib-nav`, `ib-brand`, `ib-navlink` · `ib-footer` · `ib-gridpaper`
- **Forms:** `ib-label`, `ib-input`, `ib-select`, `ib-textarea` (sunken: inset shadow, lifts on focus), `ib-help`, `ib-error` wrapper, `ib-check`, `ib-switch`
- **Data / app:** `ib-stat` + `ib-delta`, `ib-table-wrap` + `ib-table`, `ib-bar`, `ib-shell` + `ib-sidebar` + `ib-sidelink`, `ib-tabs` + `ib-tab`, `ib-alert` (`--hot`), `ib-avatar`
- **Marketing:** `ib-price` (`--featured`), `ib-quote`, `ib-faq` (native `<details>`), `ib-final`, `ib-marquee`, `ib-row` + `__num`
- **Editorial:** `ib-prose` (headings, links with an accent underline, code, pre, blockquote, images), `ib-mark`
- **Optional flourishes** (from the Drift launch; use only when they fit the product): `ib-keys` + `ib-keycap` (keyboard-shortcut products), `ib-slab` (window frame for a product screenshot/video), `ib-well` (dark art panel), `ib-iso-*` (click-to-explode isometric stack for anything with layers)

## Adapting it per kind of site

The style is the **materials** (paper, ink, extrusions, one accent, heavy type), not a page layout. Dial the intensity to the job:

| Site | Intensity | What carries the style | Leave out |
|---|---|---|---|
| Product / launch landing | loud | accent-block H1 word, ex10–14 hero media, tilted kicker, marquee or exploded stack, accent final panel | — |
| SaaS app / dashboard | medium | accent active nav + primary buttons, `ib-stat` tiles, outlined tables, sunken inputs; ex4–8 max | tilts, marquee, giant display type, accent-block words |
| Docs / blog / long-form | quiet | paper + `ib-prose`, accent link underlines, outlined code, one hot blockquote rule; cards only in lists | extrusions on text areas, tilts, more than one accent per screen |
| Portfolio / personal | loud-medium | big H1 with an accent word, project cards with `--hover` tilt, avatar/brand mark, sticker-like badges | dashboard pieces |
| E-commerce / store | medium | product cards (ex8, hover lift), accent "Add to cart", `ib-badge--hot` for sale, sunken quantity inputs | marquees over product grids, scroll animation |
| Event / community | loud | tilted kickers, marquee of speakers/dates, accent ticket button, `ib-price` tiers | dense tables |

Rules of thumb: deeper extrusion = more important (never put ex14 on more than one thing per screen); the busier the information, the flatter the depth; long reading surfaces stay on plain paper.

## Applying it to a project

1. Copy `iso-brutal.css` into the project (e.g. `src/styles/iso-brutal.css`), import it globally, and put `class="ib"` on `<body>` (or the app root).
2. Load fonts: Geist + Geist Mono (Google Fonts, or `next/font/google` → map to `--ib-font` / `--ib-mono`).
3. **Re-brand** by overriding only the brand tokens on `.ib`: `--ib-accent`, `--ib-accent-ink`, `--ib-hot`, `--ib-hot-ink`, `--ib-alt`. Pick an accent that is loud and high-luminance (lime, orange, cyan, lilac all work with ink text). Keep paper/ink as they are unless the brand demands otherwise.
4. Dark mode: set `data-theme="dark"` on `<html>` or the `.ib` element. Paper goes near-black and ink/extrusions flip to warm white, so blocks stay readable.
5. Tailwind projects: keep the CSS file for components; expose the tokens in the theme (`colors: { paper: 'var(--ib-paper)', ink: 'var(--ib-text)', accent: 'var(--ib-accent)', hot: 'var(--ib-hot)' }`, `boxShadow: { ex4: 'var(--ib-ex4)', ex8: 'var(--ib-ex8)', ex14: 'var(--ib-ex14)' }`) and use `border-[3px] border-ink shadow-ex8` utilities.

## Motion

- Entrances: words rise in one by one; the accent block drops in with a small springy settle (the one playful overshoot per page).
- Scroll is never hijacked: interactive 3D (exploding stacks) triggers on **click**, not scroll.
- Hover/press transitions ~120ms on `cubic-bezier(.3,.7,.4,1)`.
- Ambient motion is rare and purposeful (a marquee, a keycap that presses itself every few seconds). No floating stickers or bobbing decorations around product media; the user explicitly removed those on Drift.
- Always honour `prefers-reduced-motion`.

## Don'ts

- No gradients on UI surfaces (gradients only inside illustrations/media), no blur shadows, no rounded-pill everything (radius 8–18px; pills only for chips).
- No more than one accent block per section; no accent text on paper.
- No generic "AI" visuals (glow orbs, purple-blue gradients, sparkles).
- Don't recreate the Drift page; build the new product's own story with these materials.
