# 10 — Tailwind Design System

Tailwind CSS **v4**, configured entirely in CSS. There is no `tailwind.config.js` in this project.

Related: [[11 - Styling Conventions]] · [[05 - Catalog Data Model]] · [[13 - Deployment and Configuration]]

---

## How Tailwind is wired in

Two lines, in two files:

```ts
// vite.config.ts
plugins: [ react(), tailwindcss() ]
```

```css
/* src/App.css */
@import "tailwindcss";
```

`@tailwindcss/vite` is the first-party v4 plugin — no PostCSS config, no `content` globs to maintain (v4 discovers source files automatically). `App.css` is imported once in `main.tsx`, which pulls the whole framework into the bundle.

## The design language

The visual system is a warm, near-monochrome editorial layout: **bone** paper, **bark** ink, condensed uppercase display type, squared corners everywhere, hairline rules instead of borders, and full-bleed photography carrying all the colour. Nothing is rounded and nothing is a mid-tone — surfaces are either bone or bark, and the type sits at high contrast on both.

Three rules explain most of the CSS below:

1. **Surfaces come in pairs.** A section is either bone-on-bark or bark-on-bone; components that appear on both (`.btn-ghost`, the swatches) carry an explicit variant rather than relying on `currentColor`.
2. **Weight comes from type, not chrome.** No shadows, no gradients except the hero scrim, no rounded corners. Hierarchy is display size and letterspacing.
3. **Hairlines are `border-*/15`, not a token.** Dividers are written inline as `border-bark-900/15` or `border-bone-50/15` so they inherit the surface they sit on.

## The `@theme` block

v4 replaces the JS config object with a CSS-native `@theme` block. Every custom design token in this project lives here:

```css
@theme {
    /* Surfaces — warm dark browns */
    --color-bark-950: #16110E;
    --color-bark-900: #221B16;
    --color-bark-800: #2C241E;
    --color-bark-700: #3A302A;
    --color-bark-600: #4C4139;

    /* Surfaces — bone / cream */
    --color-bone-50:  #F7F4EE;
    --color-bone-100: #F0ECE3;
    --color-bone-200: #E6E0D5;
    --color-bone-300: #D7CFC0;

    /* Neutrals for secondary type and hairlines */
    --color-clay-400:  #B9AA96;
    --color-stone-500: #8C8175;
    --color-stone-600: #6E645A;

    /* Wood stain swatches — real finish colours, referenced from catalog.ts */
    --color-raw-500:      #E7CFA6;
    --color-espresso-500: #572a00;
    --color-olive-500:    #5C5B33;
    --color-olive-300:    #A9A778;

    --breakpoint-xsm: 33.375rem;
    --breakpoint-2md: 56.25rem;
    --breakpoint-3xl: 2000px;

    --font-display: "Archivo", "Arial Narrow", sans-serif;
    --font-sans:    "Inter", system-ui, sans-serif;

    --animate-timer-message:       timer-message 5s linear forwards;
    --animate-timer-forms-message: timer-forms-message 5s linear forwards;
}
```

**The naming prefix is the API.** v4 derives utilities from the variable namespace:

| Prefix | Generates | Example |
|---|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` | `--color-bark-900` → `bg-bark-900` |
| `--breakpoint-*` | responsive variants, both directions | `--breakpoint-2md` → `2md:` and `max-2md:` |
| `--font-*` | `font-*` | `--font-display` → `font-display` |
| `--animate-*` | `animate-*` | `--animate-timer-message` → `animate-timer-message` |

Because `--color-*` tokens generate the full utility family, opacity modifiers come free — `bg-bark-950/75`, `border-bone-50/15`, and `text-bone-100/80` all work without extra tokens, which is why the hairline convention needs no variables of its own.

---

## Token groups

### Colours

Two ramps and one neutral set, plus four literal wood stains.

| Group | Used for |
|---|---|
| `bark-950` → `bark-600` | dark sections, the header, the footer, the cart drawer, solid buttons |
| `bone-50` → `bone-300` | page background, light type on dark, image placeholders |
| `clay-400`, `stone-500`, `stone-600` | secondary and tertiary type |
| `raw-500`, `espresso-500`, `olive-500` | finish swatches |

`bone-50` is the page background, set once on `body` rather than on a wrapper.

The four stain tokens are the only colours in the system chosen to *depict* something rather than to compose: they approximate the real finishes and are referenced from [[05 - Catalog Data Model]] as `'bg-espresso-500'` / `'text-espresso-500'`. `--color-olive-*` exists because the catalog referenced `bg-olive-500` for a long time with no token behind it — a swatch that silently rendered transparent. The fourth stain, gray, still uses Tailwind's built-in `gray-500`.

### Breakpoints

| Token | Value | Purpose |
|---|---|---|
| `xsm` | `33.375rem` (534px) | below Tailwind's `sm` — small phones |
| `2md` | `56.25rem` (900px) | between `md` (768px) and `lg` (1024px) — the **primary** layout switch |
| `3xl` | `2000px` | above `2xl` — very wide displays |

These slot *between* the defaults rather than replacing them, so `sm`/`md`/`lg`/`xl`/`2xl` all still work alongside.

`2md` remains the most important breakpoint in the project — it's where `Navigation.tsx` swaps its desktop row for the mobile modal menu, where the product detail grid collapses to a stack, and where section padding drops from `py-24` to `py-16`.

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..112,300..900&family=Inter:wght@300..600&display=swap');
```

Two faces, two jobs:

- **Archivo** (`--font-display`) — a grotesque with a **width axis**, used for every heading, button, label, and price. Loaded across `wdth 75..112` and `wght 300..900` so the `.display` class can request a semi-condensed cut.
- **Inter** (`--font-sans`) — body copy only. Applied on `body`, so it is the default and nothing has to opt in.

Neither is applied through a Tailwind `font-*` utility in the markup; `body` sets `--font-sans` and the `.display` class sets `--font-display`. React Aria modals render in a **portal outside** the root div, so both re-apply `font-sans` explicitly:

```tsx
<Modal className="modal-display ... font-sans">
```

### Animation tokens

```css
--animate-timer-message:       timer-message 5s linear forwards;
--animate-timer-forms-message: timer-forms-message 5s linear forwards;
```

Paired with keyframes defined outside the block:

```css
@keyframes timer-message       { 0% { width: 100%; } 100% { width: 0%; } }
@keyframes timer-forms-message { 0% { width: 100%; } 100% { width: 0%; } }
```

These drive the shrinking progress bar under the toast in [[04 - State Management Patterns]]. Both now run `100% → 0%` against a `w-fit` parent, so the bar always matches its toast box regardless of the text inside it. The 5s duration is still hand-matched to the `setTimeout(..., 5000)` in JS — two places to change if the timing moves.

---

## Component classes

Below `@theme` sits roughly 150 lines of hand-written CSS. Unlike the old stylesheet — which only held things utilities *couldn't* express — this is a small component layer, written as plain classes with **no `@apply`**.

The reason is repetition, not preference: a button in this system is eight utilities long (`inline-flex items-center gap-2.5 px-5 py-3 text-[0.6875rem] font-semibold tracking-[0.16em] uppercase`) and appears fourteen times. The type scale is worse, because it needs `font-variation-settings`, which has no utility at all.

### Display type

```css
.display {
    font-family: var(--font-display);
    font-variation-settings: "wdth" 92;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.015em;
    line-height: 0.95;
}
```

`.display` sets the *voice*; a second class sets the *size*. They are always used together:

| Class | Size | Used for |
|---|---|---|
| `.display-hero` | `clamp(2.5rem, 8.7vw, 8.5rem)` | the home and gallery `h1` |
| `.display-xl` | `clamp(1.75rem, 4.4vw, 3.5rem)` | section headings, product name |
| `.display-lg` | `clamp(1.5rem, 3vw, 2.5rem)` | footer statement, mobile menu links |
| `.display-md` | `clamp(1.125rem, 2vw, 1.625rem)` | card titles, category labels, prices |

`font-variation-settings: "wdth" 92` is the whole reason Archivo was chosen — it condenses the face slightly without a separate font file, which is what makes long headings like `Frequently — Asked questions.` fit on one line.

Two label scales carry everything that isn't display type or body copy:

```css
.eyebrow { font-size: 0.625rem;  letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500; }
.micro   { font-size: 0.6875rem; letter-spacing: 0.08em; }
```

`.eyebrow` is the most-used class in the codebase (66 occurrences) — every section kicker, form label, nav link, and metadata line. `.micro` is its non-uppercase sibling for values rather than labels.

### Buttons

```css
.btn        { /* inline-flex, uppercase, 0.16em tracking, squared, 0.3s transitions */ }
.btn-solid  { background: bark-900; color: bone-50; }
.btn-light  { background: bone-50;  color: bark-900; }
.btn-ghost  { border-color: currentColor; background: transparent; }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
```

`.btn-solid` carries the small filled square that precedes its label, as a pseudo-element rather than markup:

```css
.btn-solid::before {
    content: "";
    width: 0.375rem;
    height: 0.375rem;
    background-color: currentColor;
}
```

**The ghost variants are surface-specific, and this is deliberate.** The first version set `background-color: currentColor` on hover so one class could work anywhere. It cannot: `color` is set in the same rule, so `currentColor` resolves to the *new* colour and the fill always matches the label exactly, rendering it invisible. The fix is two explicit pairs:

```css
.btn-ghost:hover       { background: bark-900; border-color: bark-900; color: bone-50;   }  /* on bone */
.btn-ghost-light:hover { background: bone-50;  border-color: bone-50;  color: bark-950;  }  /* on bark */
```

`.btn-ghost-light` also sets the resting `color`, so a ghost button on a dark section is `btn btn-ghost btn-ghost-light` and nothing else.

### The link underline

```css
.link-underline {
    padding-bottom: 0.3rem;
    background-image: linear-gradient(currentColor, currentColor);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 0% 1px;
    transition: background-size 0.35s ease;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
}

.link-underline:hover,
.link-underline:focus-visible { background-size: 100% 1px; }
```

A wipe-in rule drawn as a **background**, not an absolutely positioned `::after`. The distinction matters: an inline link that wraps is split into two line fragments, and an absolutely positioned pseudo-element can only anchor to one of them — so the prose links inside the FAQ answers animated nothing at all. `box-decoration-break: clone` gives each fragment its own background box, so a wrapped link underlines both lines.

### Frames and fields

```css
.img-frame { overflow: hidden; background-color: var(--color-bone-200); }
.img-frame img { transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.img-frame:hover img,
a:hover .img-frame img { transform: scale(1.05); }
```

Every photograph on the site is wrapped in `.img-frame` — it supplies the crop, the placeholder colour while the image loads, and a slow scale on hover. The `a:hover` selector is what makes a whole product card animate its image, not just the image itself.

```css
.field { width: 100%; padding: 0.8125rem 0.9375rem; background: transparent;
         border: 1px solid rgb(34 27 22 / 0.18); font-size: 0.9375rem; }
.field:focus { outline: none; border-color: var(--color-bark-900); }
```

One class for every text input, textarea, and select in both forms. The border darkens rather than growing a ring, which keeps the field from shifting on focus.

---

## Motion

### Scroll-driven reveals

```css
@supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
        .reveal {
            animation: reveal-in linear both;
            animation-timeline: view();
            animation-range: entry 0% entry 70%;
        }
    }
}
```

Seven sections carry `.reveal` and fade up as they enter the viewport, with **no JavaScript and no IntersectionObserver**. The double guard is the important part: browsers without scroll timelines never match the `@supports` block and render the content in its final state, and anyone who has asked for reduced motion gets the same. There is no "animate in" JS to fail, so the content can never be stuck invisible.

`animation-range: entry 0% entry 70%` completes the fade by the time the element is 70% into the viewport. An earlier draft used `cover 20%`, which is measured against the element's *whole* traversal — on a tall section that left the heading half-faded for hundreds of pixels of scrolling.

### The product gallery transform

```css
.animated-gallery {
    transition: transform var(--animation-duration, 0.5s) ease-in-out;
    transform: translateX(calc(var(--galleryPosition, 0) * -100% - (var(--galleryPosition, 0) * 40px)));
}
```

Unchanged from the original design. The class is static; the *values* come from React via inline custom properties:

```tsx
<img className="animated-gallery aspect-[4/3] w-full object-cover shrink-0"
     style={{'--animation-duration': `0.7s`, '--galleryPosition': `${activeButton}`} as React.CSSProperties}
     src={item} alt={`${product.name} — view ${index + 1}`} />
```

The `calc` moves each slide by one full width **plus** the 40px flex gap (`gap-10`), which is why the arithmetic has two terms. Both variables carry fallbacks (`, 0.5s` and `, 0`) so the CSS is valid before React mounts, and the `as React.CSSProperties` cast is required because TypeScript's `CSSProperties` type doesn't permit arbitrary `--*` keys.

What *did* change is the slide sizing. Each image is now `w-full shrink-0`, so one slide is exactly one container width and the `-100% - 40px` arithmetic lands correctly. Previously the images were unconstrained flex children that shrank to share the row, and the translate distance never matched the slide width.

---

## Layout tokens outside `@theme`

```css
@layer base {
    :root { --header-h: 5.5rem; }

    @media (width < 56.25rem) {
        :root { --header-h: 4.75rem; }
    }
}
```

`--header-h` is the height of the fixed header, and it is the one number that ties the chrome to every page. It is declared in `@layer base` rather than `@theme` because it is not a utility namespace — it is consumed directly:

```tsx
<nav className="... fixed top-0 h-(--header-h) z-30">   {/* Navigation.tsx */}
<section className="... pt-(--header-h)">                {/* every page's first section */}
```

`h-(--header-h)` is v4 shorthand for `h-[var(--header-h)]`. This single variable replaced the four hand-tuned `mt-30` / `mt-40` / `mt-60` / `mt-80` values that every page previously used to clear the absolutely positioned nav — see [[11 - Styling Conventions]].

## Base layer

```css
@layer base {
    html { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }

    body {
        background-color: var(--color-bone-50);
        color: var(--color-bark-900);
        font-family: var(--font-sans);
        font-weight: 350;
    }

    ::selection { background-color: var(--color-bark-900); color: var(--color-bone-50); }
}
```

`font-weight: 350` is a variable-font weight between Light and Regular — body copy sits slightly lighter than default, which is what keeps the heavy display type dominant.

Note what is **not** here any more: the old stylesheet styled bare `h1` and `form` elements globally, so every heading on the site shared one `clamp()` and every form on the site shared one width. Both are gone; sizing is a class you opt into.

---

## Where design decisions live

| Decision | Location |
|---|---|
| Colours, breakpoints, fonts, animation tokens | `@theme` in `App.css` |
| Header height | `--header-h` in `@layer base` |
| Type scale, buttons, fields, frames, links | component classes in `App.css` |
| Keyframes and scroll-driven reveals | `App.css`, below the component classes |
| Per-product colour swatches | `colorStyles` / `colorTextStyles` in `catalog.ts` |
| Everything else | inline `className` on the element |

No component CSS files, no CSS modules, no `styled-components`, no `@apply`. See [[11 - Styling Conventions]] for how the inline utilities are actually written.
