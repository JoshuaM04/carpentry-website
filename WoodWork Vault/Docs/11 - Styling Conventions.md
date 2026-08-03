# 11 — Styling Conventions

How Tailwind utilities are actually written in this codebase — the observable house style.

Related: [[10 - Tailwind Design System]] · [[12 - Coding Style Guide]]

---

## Class or utilities?

The one decision that isn't inherited from Tailwind. The split is by **repetition and reach**:

- **A component class** (`.btn`, `.field`, `.display-md`, `.eyebrow`, `.img-frame`) when the same 6–10 utilities appear on many elements across many files, or when the rule needs something utilities can't express — `font-variation-settings`, `box-decoration-break`, `animation-timeline`, a pseudo-element.
- **Inline utilities** for everything positional: layout, spacing, sizing, one-off colour.

In practice almost every element mixes both, class first:

```tsx
<p className="eyebrow text-stone-500">Collections</p>
<h2 className="display display-xl">Signature</h2>
<Link className="btn btn-ghost w-fit" to={product.review}>Write a review</Link>
<input className="field" type="email" />
```

The component class carries the *identity* of the element; the utilities place it. Nothing uses `@apply` — see [[10 - Tailwind Design System]].

## Utility ordering

Classes follow a consistent, if informal, order:

```
[component class] → [semantic name] → layout → flex/grid props → spacing → sizing → typography → colour → state → responsive
```

Examples straight from the source:

```tsx
className="furniture-card flex flex-col gap-4 w-full"
className="flex flex-wrap justify-between items-center gap-4 border-t border-bone-50/15 px-8 py-6 max-2md:px-6"
className="eyebrow text-bone-50 bg-bark-900/80 px-2 py-1 top-3 left-3 absolute capitalize"
```

Responsive variants are almost always **last**, which makes the base style readable in one pass. Note that `absolute` trails its own offsets (`top-3 left-3 absolute`) — a quirk of the house order, applied consistently.

## Semantic class names as labels

Many elements lead with a kebab-case class that has **no CSS attached**:

```tsx
<div className="root-container flex flex-col min-h-dvh ...">
<nav className="navigation-component fixed top-0 ...">
<div className="desktop-layout flex justify-between ...">
<div className="product-information-container flex flex-col gap-8">
<div className="cart-items-container scroll-slim flex flex-col ...">
```

`root-container`, `navigation-component`, `desktop-layout`, `mobile-layout`, `img-container`, `modal-display`, `modal-pop-up`, `reviews-container`, `media-upload-container`, `home-container`, `gallery-container`, `about-container`, `contact-container`, `furniture-component`, `furniture-card`, `section-heading`, `footer-component`, `review-form-container`, `img-submission-container`, `video-submission-container` — none are defined in `App.css`.

They serve as **inline documentation and devtools handles**: a way to find an element in the inspector, and a name for what a long utility string is *for*. A deliberate and useful habit given how long some class strings get.

Two of the stale ones were corrected during the visual overhaul — the nightstand page now says `nightstand-one-container`, and the review pages say `earth-wood-review-container` / `hazy-night-review-container` instead of `table-one-review-container`. `table-one-container` survives on the Earth Wood page, where it is accurate.

## Conditional classes via template literals

No `clsx`, no `classnames`, no `tailwind-merge`. Every conditional class is a template literal with a ternary, and the conditional part is placed **first**:

```tsx
className={`${isTransparent ? 'bg-transparent border-transparent' : 'bg-bark-900/95 border-bone-50/10 backdrop-blur-sm'} navigation-component fixed top-0 ...`}

className={`${activeColor === item ? 'border-bark-900' : 'border-transparent'} flex flex-col gap-2 border-b-2 pb-2`}

className={`${activeButton === index ? 'bg-bark-900' : 'bg-bark-900/25'} w-10 h-0.5`}

className={`${messageVisbility === 'hidden' ? 'hidden' : 'block'} w-fit`}
```

Consistent enough to read as a convention: *variable part up front, static part after*.

The critical constraint is that **both branches contain complete, literal class names**. Tailwind scans source text; it cannot evaluate expressions. Ternaries preserve full class names, so they work — string interpolation does not. Where a class genuinely has to be picked at runtime, the codebase now uses a lookup object with literal values rather than building the string:

```tsx
// Cart.tsx — stain name → swatch class
const SWATCH_STYLES: Record<string, string> = {
    'raw wood': 'bg-raw-500',
    'espresso': 'bg-espresso-500',
    'olive':    'bg-olive-500',
    'gray':     'bg-gray-500'
};

className={`${SWATCH_STYLES[item.activeColor] ?? 'bg-bone-300'} border border-bone-50/25 w-6 h-3`}
```

This replaced `` `bg-${item.activeColor}-500` ``, which Tailwind never generated — the cart swatch rendered with no colour at all. The `??` fallback means an unknown stain shows a neutral chip instead of nothing.

## Mobile handling: `max-*` variants, not `min-*`

This codebase is written **desktop-first**. The base classes describe the large layout, and `max-*` variants override downward:

```tsx
className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1"
className="grid grid-cols-[1.15fr_1fr] gap-16 w-full max-2md:grid-cols-1 max-2md:gap-10"
className="flex flex-col gap-12 px-6 py-24 max-2md:py-16"
```

This runs opposite to Tailwind's documented mobile-first default, but it's applied consistently, so the mental model holds: **read the base as desktop, read `max-*` as "and on smaller screens…"**.

The one `min-*` exception is `2md:sticky 2md:top-32` on the contact page's info column — sticky positioning is an enhancement for wide screens, so it reads more naturally as an opt-in.

### Grid over flex-wrap for collections

Anything that forms a row of equal cells is a `grid` with an explicit column count, not `flex flex-wrap`:

```tsx
<div className="grid grid-cols-6 gap-3 max-2md:grid-cols-3 max-xsm:grid-cols-2">   {/* image strip */}
<div className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1">  {/* product cards */}
<div className="grid grid-cols-4 gap-px bg-bone-50/20 max-2md:grid-cols-2">        {/* process band */}
```

`flex flex-wrap` survives where items are genuinely different sizes and should sit next to each other — button rows, the footer's link columns, the hero's bottom row.

The `gap-px` on a coloured parent in the third example is a hairline-grid trick: the gap *is* the divider, so four cards separated by 1px rules need no borders of their own.

### Dual-tree toggling

`Navigation.tsx` doesn't restyle one tree — it renders two and hides one:

```tsx
<div className="desktop-layout ... max-2md:hidden">
<div className="mobile-layout  ... 2md:hidden">
```

Simpler than making one markup tree serve both, at the cost of duplicated links — though the duplication is now only structural: both trees map over the same `LINKS` array and share a `brand` element defined once as a local variable. The no-op `max-2md:aria-hidden` variants that used to sit alongside these have been removed.

## Arbitrary values

Used freely where the design needs a specific number:

```tsx
text-[0.8125rem]     tracking-[0.3em]      tracking-[0.16em]
aspect-[4/3]         aspect-[4/5]          grid-cols-[1.15fr_1fr]
left-[50%]           translate-x-[-50%]    translate-[-50%]
h-(--header-h)       pt-(--header-h)       lg:w-[34rem]
```

`h-(--header-h)` is v4 shorthand for `h-[var(--header-h)]` — the parenthesis form is reserved for custom properties.

`rounded-*` appears nowhere. Every corner in the system is square, which is a design rule rather than an oversight.

## v4 dynamic spacing

Tailwind v4 generates arbitrary numeric spacing on demand, and this codebase still leans on it — though far less than before, since the layout now derives from `--header-h` and grid tracks rather than measured offsets:

```tsx
min-h-160     size-9     w-10 h-0.5     w-16 h-16     max-w-xs     max-w-3xl
```

### The `--header-h` pattern

The header is `fixed`, so it occupies no layout space. Every page's first section clears it with the same expression:

```tsx
<section className="... pt-(--header-h)">
```

```tsx
// Navigation.tsx — the other half of the contract
<nav className="... fixed top-0 left-0 w-full h-(--header-h) z-30">
```

One variable, declared once in `@layer base` and redeclared at `max-2md` for the shorter mobile bar. This replaced four hand-tuned magic numbers — `mt-30` on Home, `mt-40` on Gallery, `mt-60` on About and Contact, `mt-80` on the product and review pages — none of which agreed with each other or with the actual height of the nav.

The hero is the one section that does *not* pad: it sits under a transparent header by design and uses `pt-(--header-h)` only to keep its own content clear of the bar.

## Section rhythm

Page sections are near-identical:

```tsx
<section className="reveal flex flex-col gap-12 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
```

| Part | Value | Meaning |
|---|---|---|
| `reveal` | — | scroll-driven fade-up, see [[10 - Tailwind Design System]] |
| `px-6` | 24px | the page gutter, same on every section and both breakpoints |
| `py-24` / `max-2md:py-16` | 96 / 64px | vertical rhythm between sections |
| `border-t border-bark-900/15` | hairline | section divider, omitted on the first section after a dark band |
| `gap-12` / `gap-16` | 48 / 64px | heading-to-content |

Dark bands (`bg-bark-950`) break the rhythm deliberately: they run edge to edge with no top border, because the colour change already reads as a division.

## Negative margins to escape padding

Retired entirely — there is not one negative margin left in `src/`.

The pattern existed to make a child span past its parent's padding: the cart's dividers were pulled out past a shared `p-10` with `-ml-10 -mr-10`, and the product page's price bar sat on `-mt-2`. The drawer now pads each block independently, so a border is simply the edge of its own block:

```tsx
<div className="flex flex-col gap-6 border-b border-bone-50/15 p-8">     {/* header */}
<div className="cart-items-container ... flex-1 p-8 overflow-y-auto">    {/* scroll area */}
<div className="flex flex-col gap-5 border-t border-bone-50/15 p-8">     {/* totals */}
```

Three padded siblings in a `flex flex-col` replace a padded parent and four compensating offsets.

## Spacing: `gap` over margins

Layout spacing is almost always a flex/grid `gap` on the parent rather than margins on children. The scale is coarser than the old one:

```tsx
className="flex flex-col gap-16"   // page-level blocks
className="flex flex-col gap-12"   // section heading → content
className="flex flex-col gap-8"    // groups within a block
className="flex flex-col gap-4"    // label + control, card metadata
className="flex flex-col gap-2"    // tightly bound pairs
```

## Colour palette in practice

Near-monochrome by design — bone and bark, with the photography carrying every other colour:

| Usage | Classes |
|---|---|
| Page surface | `bg-bone-50` on `body` |
| Dark bands, header, footer, cart | `bg-bark-950`, `bg-bark-900/95` |
| Primary button | `.btn .btn-solid` (bark-900 / bone-50) |
| Inverted button on dark | `.btn .btn-solid bg-bone-50 text-bark-950` |
| Outline button | `.btn .btn-ghost` (+ `.btn-ghost-light` on dark) |
| Hairlines | `border-bark-900/15` on bone, `border-bone-50/15` on bark |
| Secondary type | `text-stone-500`, `text-stone-600` on bone; `text-clay-400`, `text-bone-100/80` on bark |
| Required-field marker | `text-espresso-500` |
| Toast | `bg-bark-900 text-bone-50` with an `bg-espresso-500` timer bar |
| Image placeholder | `bg-bone-200` via `.img-frame` |
| Hero scrim | `bg-linear-to-b from-bark-950/75 via-bark-950/25 to-bark-950/85` |

`bg-linear-to-b` is v4 syntax (v3 was `bg-gradient-to-b`). The success green, the blue prose links, the red clear icons, and the yellow stars from the previous design are all gone — every one of them was the only instance of its hue in the app.

## Hiding text accessibly

The old design used `text-[1px]` to keep a swatch's colour name in the DOM while making it visually vanish. That has been replaced by Tailwind's built-in:

```tsx
<span className={`${colorStyles[index]} border border-bark-900/15 w-5 h-2.5`}>
    <span className="sr-only">{item}</span>
</span>
```

`sr-only` clips the element to a 1px box and removes it from flow — the standard technique, and unlike a 1px font it can't be seen as a smudge on a zoomed display. On the product detail page the same label is simply shown, as a caption under the swatch.

## Sizing a set of elements to their widest member

The finish selector on the product page needs every swatch to be the same width, matching the longest label ("Stain - Espresso"):

```tsx
<div className="grid grid-cols-4 gap-3 w-max max-xsm:grid-cols-2">
    <button ...>
        <span className={`${colorStyles[index]} block border border-bark-900/15 w-full h-10`}></span>
        <span className="micro text-stone-500 capitalize">{item}</span>
    </button>
</div>
```

`w-max` on a grid with `1fr` columns is the mechanism: sizing the container to `max-content` makes every `1fr` track resolve to the **widest** column's content, so all four swatches match and none can be narrower than the name beneath it. Adding a longer finish name later resizes the whole row rather than one cell.

## Inline SVG convention

Every icon is still pasted inline, but the SVGRepo export wrappers have been stripped:

```tsx
<svg className="stroke-bone-50 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 7L4 7" strokeWidth="1.5" strokeLinecap="round"></path>
    ...
</svg>
```

The three empty `<g id="SVGRepo_*">` elements that used to surround every path are gone. Colour and size still come from Tailwind (`fill-bone-50`, `stroke-bone-50`, `w-8`, `size-4`) rather than SVG attributes — which is what lets the star rating flip `fill-bark-900` / `fill-transparent` conditionally. Where an SVG shipped with a hardcoded `stroke="#000000"`, it is now `stroke="currentColor"` so the same rule applies.

The trade-off is unchanged: identical icons — the X-close appears in `Cart`, `Navigation`, `Reviews`, and `Contact` — are duplicated in full. An `Icon` component or a sprite would collapse them.

## Modal styling

Both modals use the same two-layer structure — a full-screen backdrop and an inner panel — but they now resolve to different shapes.

**Cart — a right-hand drawer on desktop, a full sheet on mobile:**

```tsx
<Modal className="modal-display fixed left-[50%] top-[50%] translate-[-50%] text-bone-50 backdrop-blur-sm w-full h-full font-sans z-40 max-lg:bg-bark-950 lg:flex lg:justify-end">
    <Dialog className="modal-pop-up flex flex-col justify-between bg-bark-950 h-full max-lg:w-full lg:w-[34rem] lg:drop-shadow-2xl">
```

`lg:justify-end` is what makes it a drawer: the panel is full-height and pinned right, with the blurred page visible beside it.

**Navigation menu — a full-screen sheet at every size**, since it only exists below `2md`:

```tsx
<Modal className="modal-display fixed left-[50%] top-[50%] translate-[-50%] text-bone-50 bg-bark-950 w-full h-full p-6 font-sans z-40">
```

Both re-apply `font-sans` because React Aria renders them in a portal outside the root div.

Z-index is deliberately shallow and now has a rule to it: **`z-30` for the fixed header, `z-40` for modals**, so an open dialog always covers the bar. Below those, only `z-10` on the badge inside a card.
