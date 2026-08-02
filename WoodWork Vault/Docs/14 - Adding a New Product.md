# 14 — Adding a New Product

A worked walkthrough. Following the existing architecture, adding one product touches **five files** and creates **three**.

Related: [[05 - Catalog Data Model]] · [[02 - Frontend Routing]] · [[03 - Component Network]]

Example: a chair called **Oak Rest**, $290.

---

## Step 1 — Assets

Follow the path convention from [[05 - Catalog Data Model]]:

```
public/furniture/catalog/chairs/oak-rest/
├── oak-rest-front.png
├── oak-rest-side.png
└── oak-rest-top.png
```

Three views, in that order — `Furniture.tsx` hardcodes `galleryButton = [0, 1, 2]`, so exactly three images are navigable.

## Step 2 — Catalog entry

Append to `FURNITURE_CATALOG` in `src/utility/catalog.ts`:

```ts
{
    id: 'oak-rest',
    type: 'chair',
    route: '/OakRest',
    review: '/OakRestReview',
    reviewDB: 'oak-rest',
    name: 'Oak Rest',
    price: 290,
    activeColor: '',
    colors:          ['raw wood',        'stain - espresso',  'stain - olive',  'stain - gray'],
    colorTextStyles: ['text-orange-200', 'text-espresso-500', 'text-olive-500', 'text-gray-500'],
    colorStyles:     ['bg-orange-200',   'bg-espresso-500',   'bg-olive-500',   'bg-gray-500'],
    stripePriceId: 'N/A',
    image: '/furniture/catalog/chairs/oak-rest/oak-rest-front.png',
    imageGallery: [
        '/furniture/catalog/chairs/oak-rest/oak-rest-front.png',
        '/furniture/catalog/chairs/oak-rest/oak-rest-side.png',
        '/furniture/catalog/chairs/oak-rest/oak-rest-top.png'
    ],
    wood: 'White Oak',
    width: '20"',
    height: '34"',
    diameter: '18"'
}
```

Reminders:
- `price` is **dollars**, not cents — the backend multiplies by 100
- The three colour arrays are **index-aligned**; edit them together
- Colour class strings must be complete literals so Tailwind's scanner sees them
- `reviewDB` is the MongoDB `productIdentifier`. Once a review exists against it, changing the value orphans that review.

## Step 3 — Detail page

Create `src/pages/Catalog/Chairs/OakRest.tsx` — copy `EarthWood.tsx` and change one string:

```tsx
import Furniture from '../../../components/Furniture';
import Footer from '../../../components/Footer';
import type { Product } from '../../../utility/catalog';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

interface OakRestProps {
    addToCart: (product: Product, selectedColor: string) => void;
}

export default function OakRest({ addToCart }: OakRestProps) {
    const item = FURNITURE_CATALOG.find((product) => product.id === 'oak-rest')

    if (!item) return <p>Product not found</p>;

    return (
        <div className="flex flex-col justify-between items-center gap-20 min-h-dvh w-full">
            <main className="table-one-container flex flex-col w-fit max-2md:max-w-full gap-10 p-10">
                <Furniture product={item} addToCart={addToCart} />
            </main>
            <Footer />
        </div>
    );
}
```

## Step 4 — Review page

Create `src/pages/Reviews/Chairs/OakRestReview.tsx`:

```tsx
import Reviews from '../../../components/Reviews';
import Footer from '../../../components/Footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function OakRestReview() {
    return (
        <div className="flex flex-col justify-between gap-20 min-h-dvh">
            <main>
                {
                    FURNITURE_CATALOG.filter((item) => item.id === 'oak-rest').map((item) => (
                        <Reviews key={item.id} product={item} />
                    ))
                }
            </main>
            <Footer />
        </div>
    );
}
```

## Step 5 — Register the routes

In `src/App.tsx`, add two imports and two routes:

```tsx
import OakRest from './pages/Catalog/Chairs/OakRest';
import OakRestReview from './pages/Reviews/Chairs/OakRestReview';
```

```tsx
<Route path="/OakRest" element={<OakRest addToCart={addToCart} />} />
<Route path="/OakRestReview" element={<OakRestReview />} />
```

The detail route needs `addToCart`; the review route doesn't.

## Step 6 — Surface it on the home page

`Home.tsx` has a hardcoded "Chairs" section currently showing a **Coming Soon** tile. Replace the placeholder with the same filter/map used by the other categories:

```tsx
<p className="text-2xl font-bold max-xsm:text-center">Chairs</p>

<div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
    {
        FURNITURE_CATALOG.filter((item) => item.type === "chair").map((item) => (
            <FurnitureCard key={item.id} product={item} />
        ))
    }
</div>
```

Note the filter string `"chair"` must match `type` in the catalog exactly — it's an untyped string on both sides.

---

## Checklist

- [ ] Three images in `public/furniture/catalog/chairs/oak-rest/`
- [ ] Entry appended to `FURNITURE_CATALOG`
- [ ] `pages/Catalog/Chairs/OakRest.tsx`
- [ ] `pages/Reviews/Chairs/OakRestReview.tsx`
- [ ] Two imports + two `<Route>`s in `App.tsx`
- [ ] Category section in `Home.tsx` renders from the catalog
- [ ] `npm run build` passes (`tsc -b` will catch a missing `Product` field)
- [ ] Click through: home tile → detail → colour select → add to cart → cart badge → review link

## Verifying

```bash
npm run dev
```

Then check, in order:

1. `/` — the tile appears in its category, image loads, price is right
2. `/OakRest` — gallery dots move all three images; colour swatches render
3. Add to cart with **no colour selected** — button should be inert (`pointer-events-none`)
4. Select a colour, add twice — badge shows `2`, one line item with quantity 2
5. Add a *different* colour — a **second** line item (composite `cartItemId`, see [[04 - State Management Patterns]])
6. `/OakRestReview` — submit a review, then reload `/OakRest` and confirm it appears

Step 6 requires the API. `npm run dev` alone won't reach it — see the local-dev note in [[13 - Deployment and Configuration]].

---

## What this reveals about the architecture

Steps 3–5 are **pure boilerplate**: two 26-line files and two route lines that contain no logic, only a product `id`. The information content of the whole change is the catalog entry from step 2.

A single parameterised route would collapse it:

```tsx
<Route path="/product/:productId" element={<ProductPage addToCart={addToCart} />} />
<Route path="/product/:productId/review" element={<ReviewPage />} />
```

```tsx
const { productId } = useParams();
const item = FURNITURE_CATALOG.find((p) => p.id === productId);
if (!item) return <NotFound />;
```

Adding a product would then be **step 1 and step 2 only** — assets plus one catalog object — with `route` and `review` becoming derived values (`/product/${id}`) rather than stored fields. `Home.tsx`'s hardcoded category sections could likewise derive from `[...new Set(FURNITURE_CATALOG.map(p => p.type))]`.

At two products the current approach costs little and stays completely explicit, which is a defensible trade. The cost curve steepens around five or six. Tracked in [[15 - Known Gotchas and Tech Debt]].
