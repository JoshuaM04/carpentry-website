# 05 — Catalog Data Model

`src/utility/catalog.ts` — 62 lines that every product surface in the app depends on.

Related: [[03 - Component Network]] · [[07 - MongoDB and Mongoose]] · [[14 - Adding a New Product]]

---

## The `Product` interface

```ts
export interface Product {
    id: string;                      // 'earth-wood' — internal key
    type: string;                    // 'table' | 'nightstand' — grouping on Home
    route: string;                   // '/EarthWood' — detail page path
    review: string;                  // '/EarthWoodReview' — review form path
    reviewDB: string;                // 'earth-wood' — MongoDB join key
    name: string;                    // 'Earth Wood' — display name
    price: number;                   // 400 — dollars, not cents
    activeColor: string;             // '' — placeholder, overwritten in cart
    colors: Array<string>;           // display labels
    colorTextStyles: Array<string>;  // Tailwind text-* classes, index-aligned — no longer read
    colorStyles: Array<string>;      // Tailwind bg-* classes, index-aligned
    stripePriceId: string;           // 'N/A' — unused
    image: string;                   // primary/thumbnail path
    imageGallery: Array<string>;     // front / side / top
    wood: string;                    // 'Poplar'
    width: string;                   // '36"' — strings, include the unit
    height: string;
    diameter: string;
}
```

## The data

```ts
export const FURNITURE_CATALOG: Product[] = [
    {
        id: 'earth-wood', type: 'table',
        route: '/EarthWood', review: '/EarthWoodReview', reviewDB: 'earth-wood',
        name: 'Earth Wood', price: 400, activeColor: '',
        colors:          ['raw wood',      'stain - espresso',  'stain - olive',  'stain - gray'],
        colorTextStyles: ['text-raw-500',  'text-espresso-500', 'text-olive-500', 'text-gray-500'],
        colorStyles:     ['bg-raw-500',    'bg-espresso-500',   'bg-olive-500',   'bg-gray-500'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/tables/earth-wood/earth-wood-front.png',
        imageGallery: [ /* front, side, top */ ],
        wood: 'Poplar', width: '36"', height: '25"', diameter: '14"'
    },
    { /* hazy-night — nightstand, $535, Poplar & Pine */ }
];
```

Two products today: **Earth Wood** ($400 table) and **Hazy Night** ($535 nightstand).

---

## Why this file is the hub

```mermaid
flowchart LR
    CAT[catalog.ts<br/>FURNITURE_CATALOG]

    CAT -->|filter by type| Home
    CAT -->|find by id| EW[EarthWood page]
    CAT -->|find by id| HN[HazyNight page]
    CAT -->|filter by id| EWR[EarthWoodReview]
    CAT -->|filter by id| HNR[HazyNightReview]

    Home -->|product prop| FC[FurnitureCard]
    EW -->|product prop| F[Furniture]
    HN -->|product prop| F
    EWR -->|product prop| R[Reviews]
    HNR -->|product prop| R

    F -->|reviewDB| API[GET /api/reviews/:key]
    FC -->|reviewDB| API
    R -->|reviewDB| API2[POST /api/reviews/:key]
    F -->|product object| ATC[addToCart]
    ATC --> Cart --> CO[POST /api/checkout]

    style CAT fill:#572a00,color:#fff
```

Five files read it, and the values flow outward into three different systems — the DOM, MongoDB, and Stripe.

## Access idioms

Three different lookup styles are used across the codebase for the same job:

```ts
// Home.tsx — group by category
FURNITURE_CATALOG.filter((item) => item.type === "table").map(...)

// EarthWood.tsx / HazyNight.tsx — single lookup with a guard
const item = FURNITURE_CATALOG.find((product) => product.id === 'earth-wood')
if (!item) return <p>Product not found</p>;

// EarthWoodReview.tsx — filter-then-map over one element
FURNITURE_CATALOG.filter((item) => item.id === 'earth-wood').map((item) => <Reviews ... />)
```

The `.filter().map()` form avoids the null check by rendering nothing on a miss. See [[12 - Coding Style Guide]].

---

## Design decisions worth understanding

### Parallel arrays for colours

`colors`, `colorTextStyles`, and `colorStyles` are three separate arrays joined only by array index:

```tsx
colors.map((item, index) => (
    <button ...>
        <span className={`${colorStyles[index]} block border border-bark-900/15 w-full h-10`}></span>
        <span className="micro text-stone-500 capitalize">{item}</span>
    </button>
))
```

Adding a colour means editing the arrays in lockstep, in both products. An array of objects (`{ label, textClass, bgClass }`) would make the grouping structural rather than positional. The trade taken was keeping the literal Tailwind class strings visible in the data file — which matters, because Tailwind must see complete class names in source to generate them.

**`colorTextStyles` is now vestigial.** It existed for the `text-[1px]` trick, where the swatch's label was rendered inside the swatch at one pixel and tinted to match. Both surfaces that used it — `FurnitureCard` and `Furniture` — now show the label properly (as `sr-only` text and as a visible caption respectively), so nothing reads the array. It is still populated and still index-aligned, so it can be deleted whenever the `Product` interface is next touched.

### Tailwind classes stored as data

Storing `'bg-espresso-500'` in a data file couples the catalog to the styling layer, but it does keep the class scannable by Tailwind's compiler.

The pattern used to break in `Cart.tsx`, which *constructed* one:

```tsx
className={`... ${item.activeColor === 'raw wood' ? 'bg-orange-200' : `bg-${item.activeColor}-500`}`}
```

`bg-${item.activeColor}-500` was never generated, because Tailwind scans text and cannot evaluate a template literal — so every non-raw-wood swatch in the cart rendered transparent. It is now a lookup with literal values on both sides:

```tsx
const SWATCH_STYLES: Record<string, string> = {
    'raw wood': 'bg-raw-500', 'espresso': 'bg-espresso-500',
    'olive': 'bg-olive-500',  'gray': 'bg-gray-500'
};
```

Note the shape of the keys: this map is indexed by `activeColor`, which is the **post-`substring(8)`** value (`'espresso'`, not `'stain - espresso'`), so it is coupled to that string surgery — see [[04 - State Management Patterns]]. Carrying the chosen `colorStyles[index]` onto the cart item inside `addToCart` would remove both the map and the coupling.

The `--color-raw-500` token was added alongside this: the raw-wood swatch used Tailwind's built-in `orange-200`, which read as apricot rather than pale timber. `--color-olive-*` was added at the same time, having been referenced by this file with no token behind it since the catalog was written. See [[10 - Tailwind Design System]].

### `reviewDB` is the foreign key

`reviewDB: 'earth-wood'` matches `productIdentifier` in the Mongo `reviews` collection. Today it's identical to `id`, but the separate field means the database key can change without touching route or identity logic — the only piece of deliberate decoupling in the model.

### `price` is in dollars

Stored as `400`, converted at the boundary:

```js
unit_amount: Math.round(item.price * 100)   // backend/src/server.js
```

The `Math.round` guards against float artifacts (`4.35 * 100 === 434.99999...`). Correct, but the app is one decimal price away from needing care — see [[08 - Stripe Checkout Flow]].

### Vestigial fields

- **`stripePriceId: 'N/A'`** — the backend builds `price_data` inline and never reads this. It's a placeholder for a future migration to real Stripe Price objects.
- **`activeColor: ''`** — always empty in the catalog. It exists so the `Product` shape matches the cart-item shape produced by spreading `{ ...product, activeColor: finalColor }`. The catalog value is never read.

### Dimensions as strings

`width: '36"'` bundles value and unit. Fine for display (`<p>{product.width} - Width</p>`), but unusable for sorting or filtering without parsing.

## Asset path convention

```
public/furniture/catalog/<type-plural>/<product-id>/<product-id>-<view>.png
                         tables/       earth-wood/  earth-wood-front.png
```

Paths in the catalog are **absolute from `public/`** (leading `/`), so Vite serves them unhashed and the browser resolves them against the site root. This is what lets `Cart.tsx` turn them into absolute URLs for Stripe with `new URL(cleanPath, productionUrl)`.

Gallery order is **front → side → top**. `Furniture.tsx` used to index it through two hardcoded `[0, 1, 2]` arrays, so a fourth image would render but be unreachable by the controls. Both slides and controls now map over `imageGallery` itself:

```tsx
imageGallery.map((_, index) => (
    <button onClick={() => setActiveButton(index)} aria-label={`Show image ${index + 1}`} ... />
))
```

Any number of views works, and the `01 / 03` counter beside the controls reads its total from `imageGallery.length`. Three remains the convention for new products — see [[14 - Adding a New Product]] — but it is now a convention rather than a constraint.
