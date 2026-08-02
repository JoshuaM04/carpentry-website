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

## The `@theme` block

v4 replaces the JS config object with a CSS-native `@theme` block. Every custom design token in this project lives here:

```css
@theme {
    --color-svgLeftHandle: #E15649;
    --color-svgLeftToolTip: #C3C7CB;
    --color-svgLeftToolBar: #E0E0E0;
    --color-svgLeftHandleTrim: #BC342E;
    --color-svgLeftToolCasing: #E15649;
    --color-svgRightHandle: #7F7C79;
    --color-svgRightToolBar: #855151;

    --color-espresso-500: #572a00;

    --breakpoint-xsm: 33.375rem;
    --breakpoint-2md: 56.25rem;
    --breakpoint-3xl: 2000px;

    --font-roboto: "Roboto Slab", serif;

    --animate-timer-message: timer-message 5s ease-out forwards;
    --animate-timer-forms-message: timer-forms-message 5s ease-out forwards;

    --gallery-item-sm: calc(50% - 20px);
    --gallery-item: calc(25% - 30px);
}
```

**The naming prefix is the API.** v4 derives utilities from the variable namespace:

| Prefix | Generates | Example |
|---|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` | `--color-espresso-500` → `bg-espresso-500` |
| `--breakpoint-*` | responsive variants, both directions | `--breakpoint-2md` → `2md:` and `max-2md:` |
| `--font-*` | `font-*` | `--font-roboto` → `font-roboto` |
| `--animate-*` | `animate-*` | `--animate-timer-message` → `animate-timer-message` |

Variables **not** matching a known prefix (`--gallery-item`, `--gallery-item-sm`) generate no utility. They're plain custom properties, consumed via v4's arbitrary-value shorthand — see below.

---

## Token groups

### Colours

`--color-espresso-500: #572a00` — a warm brown for the espresso wood stain, slotted into Tailwind's `-500` convention so it reads like a built-in. Used in [[05 - Catalog Data Model]] as `'bg-espresso-500'` / `'text-espresso-500'`.

The seven `--color-svg*` tokens are named for parts of a tool illustration (handle, tooltip, toolbar, handle trim, tool casing). **None are referenced anywhere in `src/`** — leftovers from an SVG graphic that is no longer in the codebase.

> **Missing token:** the catalog also uses `bg-olive-500`, `text-olive-500`, and `to-olive-300`, but there is **no `--color-olive-*` in `@theme`** and Tailwind has no built-in `olive` palette. Those classes generate nothing — the olive swatch renders transparent and the card gradient has no end colour. Details in [[15 - Known Gotchas and Tech Debt]].

### Breakpoints

| Token | Value | Purpose |
|---|---|---|
| `xsm` | `33.375rem` (534px) | below Tailwind's `sm` — small phones |
| `2md` | `56.25rem` (900px) | between `md` (768px) and `lg` (1024px) — the **primary** layout switch |
| `3xl` | `2000px` | above `2xl` — very wide displays |

These slot *between* the defaults rather than replacing them, so `sm`/`md`/`lg`/`xl`/`2xl` all still work alongside.

`2md` is the most important breakpoint in the project — it's where `Navigation.tsx` swaps its desktop row for the mobile modal menu, and where `Furniture.tsx` collapses its two-column grid.

### Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&family=Share+Tech&display=swap');
```

`--font-roboto: "Roboto Slab", serif` — a slab serif, applied once at the root:

```tsx
<div className="root-container min-h-dvh font-roboto">
```

React Aria modals render in a **portal outside** that div, so both re-apply it explicitly:

```tsx
<Modal className="modal-display ... font-roboto">
```

`Share+Tech` is fetched by the `@import` but never assigned to a token or used — dead weight in the font request.

The variable-weight range `wght@100..900` is what makes `font-light` (300), `font-semibold` (600), and `font-bold` (700) all render distinctly.

### Animation tokens

```css
--animate-timer-message: timer-message 5s ease-out forwards;
--animate-timer-forms-message: timer-forms-message 5s ease-out forwards;
```

Paired with keyframes defined outside the block:

```css
@keyframes timer-message {
    0%   { width: 144.34px; }
    100% { width: 0%; }
}

@keyframes timer-forms-message {
    0%   { width: 91.77px; }
    100% { width: 0%; }
}
```

These drive the shrinking progress bar under the toast in [[04 - State Management Patterns]]. The 5s duration is hand-matched to the `setTimeout(..., 5000)` in JS — two places to change if the timing moves.

The start widths (`144.34px`, `91.77px`) are **measured pixel values** of the specific toast boxes ("Added to cart" and "Submitted"). Editing that text changes the box width and desynchronises the bar. `width: 100%` → `0%` would be self-maintaining.

---

## Hand-written CSS outside Tailwind

Everything below `@theme` in `App.css` is plain CSS — about 25 lines total, all of it doing something utilities can't.

### The gallery transform

```css
.animated-gallery {
    transition: transform var(--animation-duration, 0.5s) ease-in-out;
    transform: translateX(calc(var(--galleryPosition, 0) * -100% - (var(--galleryPosition, 0) * 40px)));
}
```

The class is static; the *values* come from React via inline custom properties:

```tsx
<img className="animated-gallery"
     style={{'--animation-duration': `2s`, '--galleryPosition': `${galleryPosition[activeButton]}`} as React.CSSProperties}
     src={item} alt={product.name} />
```

The `calc` moves each image by one full width **plus** the 40px flex gap (`gap-10`), which is why the arithmetic has two terms. Both variables carry fallbacks (`, 0.5s` and `, 0`) so the CSS is valid before React mounts.

The `as React.CSSProperties` cast is required — TypeScript's `CSSProperties` type doesn't permit arbitrary `--*` keys.

### Fluid sizing with `clamp()`

```css
h1 { font-size: clamp(2rem, 3vw, 3.75rem); }

.explore-text { font-size: clamp(.8rem, 3vw, 1rem); }

.explore-arrow-container {
    width:  clamp(1.8rem, 3vw, 2.5rem);
    height: clamp(1.8rem, 3vw, 2.5rem);
    padding: clamp(.2rem, 3vw, .5rem);
}

form { width: clamp(1rem, 50vw, 87.5rem); }

.about-img-element { width: clamp(10rem, 40vw, 25rem); }
```

`clamp()` scales continuously with the viewport instead of stepping at breakpoints — a genuinely better fit for headings and form widths than a chain of `sm:`/`md:`/`lg:` overrides.

Two of these are **bare element selectors**, which makes them global rules:

- `h1 { ... }` — every `<h1>` on the site
- `form { ... }` — **every** `<form>`, meaning the contact form and the review form share one width rule with no opt-out

`.about-img-element` is declared but never applied in `About.tsx` — that gallery uses the `--gallery-item` variables instead.

### The gallery-item variables

```css
--gallery-item-sm: calc(50% - 20px);   /* 2 columns */
--gallery-item:    calc(25% - 30px);   /* 4 columns */
```

Consumed with v4's `(--var)` shorthand for arbitrary values:

```tsx
<img className="max-lg:w-full max-2xl:w-(--gallery-item-sm) w-(--gallery-item)" src={item} alt="Workstation" />
```

Reading widest-first: 4-up by default → 2-up below `2xl` → full width below `lg`. The `- 20px` / `- 30px` subtractions account for the `gap-10` between items so the rows don't overflow.

`w-(--gallery-item)` is v4 syntax; the v3 equivalent would have been `w-[var(--gallery-item)]`.

---

## Where design decisions live

| Decision | Location |
|---|---|
| Custom colours, breakpoints, fonts, animations | `@theme` in `App.css` |
| Keyframes | `App.css`, below `@theme` |
| Fluid type and widths | `clamp()` rules in `App.css` |
| Per-product colour swatches | `colorStyles` / `colorTextStyles` in `catalog.ts` |
| Everything else | inline `className` on the element |

No component CSS files, no CSS modules, no `styled-components`, no `@apply`. See [[11 - Styling Conventions]] for how the inline utilities are actually written.
