# 11 — Styling Conventions

How Tailwind utilities are actually written in this codebase — the observable house style.

Related: [[10 - Tailwind Design System]] · [[12 - Coding Style Guide]]

---

## Utility ordering

Classes follow a consistent, if informal, order:

```
[semantic name] → layout → flex/grid props → spacing → sizing → typography → colour → state → responsive
```

Examples straight from the source:

```tsx
className="furniture-component flex flex-col gap-10 max-2md:gap-5"
className="flex justify-between items-center gap-5 text-gray-400 bg-black p-10 w-full relative"
className="text-sm font-semibold text-white bg-black pt-2 pb-2 pl-5 pr-6 w-fit h-10 hover:cursor-pointer"
```

Responsive variants are almost always **last**, which makes the base style readable in one pass.

## Semantic class names as labels

Many elements lead with a kebab-case class that has **no CSS attached**:

```tsx
<div className="root-container min-h-dvh font-roboto">
<nav className="navigation-component absolute ...">
<div className="desktop-layout flex justify-center ...">
<div className="product-information-container flex flex-col gap-2 ...">
<div className="cart-items-container flex flex-col gap-10 ...">
<div className="img-submission-container flex flex-wrap items-center gap-5">
```

`root-container`, `navigation-component`, `desktop-layout`, `mobile-layout`, `img-container`, `modal-display`, `modal-pop-up`, `reviews-container`, `media-upload-container`, `home-container`, `gallery-container`, `about-container`, `contact-container`, `table-one-container`, `table-one-review-container`, `furniture-component` — none are defined in `App.css`.

They serve as **inline documentation and devtools handles**: a way to find an element in the inspector, and a name for what a long utility string is *for*. A deliberate and useful habit given how long some class strings get.

(One caveat: `table-one-container` is used on the *nightstand* page too, and `table-one-review-container` on all review pages — the names outlived the copy-paste.)

## Conditional classes via template literals

No `clsx`, no `classnames`, no `tailwind-merge`. Every conditional class is a template literal with a ternary, and the conditional part is placed **first**:

```tsx
className={`${activeButton === item ? 'bg-black text-black' : 'bg-slate-300 text-slate-300'} w-4 h-4 rounded-[50%] text-[1px]`}

className={`${activeColor === '' ? 'pointer-events-none select-none' : ''} font-semibold text-white bg-black p-2 hover:cursor-pointer`}

className={`${messageVisbility === 'hidden' ? 'hidden' : 'block animate-timer-message'} bg-black h-1`}

className={`${data.length === 0 ? 'hidden' : 'block'}`}
```

Consistent enough to read as a convention: *variable part up front, static part after*.

The critical constraint is that **both branches contain complete, literal class names**. Tailwind scans source text; it cannot evaluate expressions. Ternaries preserve full class names, so they work. String interpolation into a class name does not — see the `bg-${item.activeColor}-500` bug in [[15 - Known Gotchas and Tech Debt]].

## Mobile handling: `max-*` variants, not `min-*`

This codebase is written **desktop-first**. The base classes describe the large layout, and `max-*` variants override downward:

```tsx
className="grid grid-cols-[29vw_1fr] gap-10 2md:w-full max-2md:flex max-2md:flex-col"
className="flex flex-wrap items-center gap-10 max-xsm:justify-center"
className="text-white top-[45%] left-[50%] translate-x-[-50%] absolute max-2md:w-56.25 max-2md:top-[50%]"
```

The pivotal example is the grid → stack switch: `grid grid-cols-[29vw_1fr]` on desktop, `max-2md:flex max-2md:flex-col` below 900px.

This runs opposite to Tailwind's documented mobile-first default, but it's applied consistently, so the mental model holds: **read the base as desktop, read `max-*` as "and on smaller screens…"**.

### Dual-tree toggling

`Navigation.tsx` doesn't restyle one tree — it renders two and hides one:

```tsx
<div className="desktop-layout ... max-2md:hidden max-2md:aria-hidden">
<div className="mobile-layout  ... 2md:hidden  2md:aria-hidden">
```

Simpler than making one markup tree serve both, at the cost of duplicated links. Note `aria-hidden` is used here as a **Tailwind variant prefix**, not the HTML attribute — `max-2md:aria-hidden` is a no-op class rather than an accessibility feature. The visual hiding via `hidden` (`display: none`) does correctly remove the tree from the accessibility tree anyway.

## Arbitrary values

Used freely where the design needs a specific number:

```tsx
top-[110%]        left-[50%]        translate-[-50%]
grid-cols-[29vw_1fr]                rounded-[50%]
text-[1px]        h-[70%]           lg:w-200
max-2md:mt-[10rem]                  mt-[8rem]
```

`text-[1px]` is a recurring trick: colour swatches render their label text at 1px so the string stays in the DOM (readable by assistive tech, findable by search) while being visually invisible:

```tsx
<div className={`text-[1px] ${colorTextStyles[index]} ${colorStyles[index]} w-25 h-8 ...`}>{item}</div>
```

`rounded-[50%]` appears throughout instead of `rounded-full`. Same visual result for a square element.

## v4 dynamic spacing

Tailwind v4 generates arbitrary numeric spacing on demand, and this codebase leans on it hard:

```tsx
mt-80  mt-60  mt-40  mt-30      w-56.25   h-18.75   w-189.25
size-100  size-60  size-50      w-25  w-100  w-50    top-118  left-33
```

Fractional values like `w-56.25` and `h-18.75` are v4-only — v3 would have needed `w-[56.25rem]`. They resolve against the `0.25rem` spacing scale (`w-56.25` = 225px).

### The `mt-*` compensation pattern

The navigation bar is absolutely positioned, so it doesn't occupy layout space. Every page therefore pushes its own content down manually:

| Page | Top offset |
|---|---|
| `Home` (hero) | `mt-30` |
| `Gallery` | `mt-40` |
| `About`, `Contact` | `mt-60` |
| `Furniture`, `Reviews` | `mt-80` |

Four different magic numbers for the same problem. A shared layout wrapper — or a non-absolute nav — would replace all of them with one rule. See [[15 - Known Gotchas and Tech Debt]].

## Negative margins to escape padding

A recurring trick for making a child span past its parent's padding:

```tsx
<Heading className="... border-b pb-5 -ml-10 -mr-10">Order Summary</Heading>
<div className="... -ml-10 -mr-10 -mb-10 border-t p-5 bottom-5">
<div className="flex justify-between items-center bg-slate-100 p-2 -mt-2">
```

The parent has `p-10`; `-ml-10 -mr-10` pulls the divider back out to the full modal width. Effective, and the paired values make the intent legible.

## Spacing: `gap` over margins

Layout spacing is almost always a flex/grid `gap` on the parent rather than margins on children:

```tsx
className="flex flex-col gap-20"    // page sections
className="flex flex-col gap-10"    // section blocks
className="flex flex-col gap-5"     // groups
className="flex flex-col gap-2"     // label + input
```

An informal scale of `gap-20 / 10 / 5 / 2` maps to page → section → group → field. Consistent enough across files to be predictable.

## Colour palette in practice

Nearly monochrome — black, white, and greys, letting the wood photography carry the colour:

| Usage | Classes |
|---|---|
| Primary buttons | `text-white bg-black` |
| Footer | `text-gray-400 bg-black` |
| Borders / dividers | `border`, `<hr />`, `border-slate-400` |
| Success toast | `bg-green-100` |
| Required-field marker | `text-red-500` |
| Clear/remove icons | `stroke-red-500 fill-red-500` |
| Links in prose | `text-blue-500 underline` / `text-blue-700 underline` |
| Star rating (active) | `fill-yellow-200` |
| Accent gradient | `bg-linear-to-br from-white to-olive-300` |

`bg-linear-to-br` is v4 syntax (v3 was `bg-gradient-to-br`).

Note the two link colours — `text-blue-500` in `About.tsx`, `text-blue-700` in `Reviews.tsx`.

## Inline SVG convention

Every icon is pasted inline from SVGRepo, wrapper groups intact:

```tsx
<svg className="fill-black w-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
  <g id="SVGRepo_iconCarrier"> <path d="..."></path> </g>
</svg>
```

The first two `<g>` elements are empty artifacts of SVGRepo's export and could be deleted. Colour and size come from Tailwind (`fill-black`, `stroke-white`, `w-10`, `size-5`) rather than SVG attributes — which is what lets `fill-yellow-200` be applied conditionally for the star rating.

The trade-off: identical icons (the X-close SVG appears in `Cart`, `Navigation`, `Reviews`, and `Contact`) are duplicated in full, adding meaningful noise to the JSX. An `Icon` component or an SVG sprite would collapse them.

## Modal styling

Both modals use the same two-layer structure — a full-screen backdrop and an inner panel:

```tsx
<Modal className="modal-display z-2 text-white fixed left-[50%] top-[50%] translate-[-50%] backdrop-blur-sm w-full h-full font-roboto max-lg:bg-black lg:flex lg:justify-center lg:items-center">
  <Dialog className="modal-pop-up flex flex-col gap-10 justify-between drop-shadow-xl/50 max-lg:h-full lg:h-[90%] lg:w-200 p-10 relative lg:bg-black">
```

The `max-lg:` / `lg:` split is a **full-screen sheet on mobile, centred panel on desktop** — mobile fills the viewport with a solid black backdrop, desktop centres a 800px panel over a blurred page.

`drop-shadow-xl/50` and `shadow-xl/30` use v4's opacity-modifier syntax on shadows.

Z-index is deliberately shallow: `z-1` for the nav, `z-2` for modals. No z-index scale beyond that.
