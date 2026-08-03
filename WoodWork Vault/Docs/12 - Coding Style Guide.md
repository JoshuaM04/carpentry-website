# 12 — Coding Style Guide

The observable conventions in this codebase — what's consistent, and where it drifts.

Related: [[03 - Component Network]] · [[04 - State Management Patterns]] · [[11 - Styling Conventions]]

---

## Components

### Function declarations, default-exported

Every single component uses the same form. No arrow-function components, no `React.FC`, no named exports:

```tsx
export default function Furniture({ product, addToCart }: FurnitureProps) { ... }
```

Function declarations hoist and show a proper name in React DevTools and stack traces. Consistent across all 17 component and page files.

### Props destructured in the signature

```tsx
export default function Cart({ cart, setCart }: CartProps) {
export default function FurnitureCard({ product }: FurnitureCardProps) {
export default function EarthWood({ addToCart }: EarthWoodProps) {
```

Never `props.product`. The signature doubles as a summary of what the component consumes.

### One local interface per component

Props types are declared immediately above the component, in the same file, named `<Component>Props`:

```tsx
interface FurnitureProps {
    product: Product;
    addToCart: (product: Product, selectedColor: string) => void;
}
```

Not exported, not shared, not in a `types/` directory. The only cross-file type is `Product` in `utility/catalog.ts`. For a codebase this size the locality wins; the cost shows up when a shape needs to match across files (see the two hand-mirrored review interfaces in [[07 - MongoDB and Mongoose]]).

`interface` is used throughout, with one deliberate exception. `Navigation` exists only to pass `cart` and `setCart` to `Cart`, so it derives the shape instead of restating it:

```tsx
type NavigationProps = React.ComponentProps<typeof Cart>;
```

That requires a `type` alias — `interface` cannot alias a mapped type. It also means the two components can never drift apart, which is the point: a hand-copied `{ cart: any[]; setCart: ... }` in `Navigation.tsx` would be a third place to edit when the cart is finally typed.

## File and directory organisation

```
components/   → PascalCase.tsx, prop-driven, reusable
pages/        → PascalCase.tsx, route targets, own their data lookup
utility/      → camelCase.ts, no JSX
```

Product pages nest by category: `pages/Catalog/Tables/EarthWood.tsx`, `pages/Reviews/Nightstands/HazyNightReview.tsx`. The folder mirrors `product.type`, so the file tree stays browsable as the catalog grows.

**One component per file**, filename matching the component. Imports are relative — no path aliases configured, hence the `'../../../components/Furniture'` depth on product pages.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Components / files | PascalCase | `FurnitureCard.tsx` |
| Props interfaces | `<Component>Props` | `FurnitureCardProps` |
| Constants | SCREAMING_SNAKE | `FURNITURE_CATALOG` |
| State | camelCase, `set` + capitalised | `activeColor` / `setActiveColor` |
| Handlers | `handle` + noun | `handleSubmit`, `handleImage`, `handleVideo`, `handleCheckout` |
| Actions | verb phrase | `addToCart`, `updateQuantity`, `showMessage` |
| Product ids / DB keys | kebab-case | `'earth-wood'`, `'hazy-night'` |
| Routes | PascalCase | `/EarthWood` |
| Backend params | full words | `request`, `response` (not `req`, `res`) |

## TypeScript usage

`tsconfig.app.json` runs a strict-ish bundler setup:

```jsonc
"noUnusedLocals": true,
"noUnusedParameters": true,
"erasableSyntaxOnly": true,       // no enums, no parameter properties
"verbatimModuleSyntax": true,     // type imports must be explicit
"noFallthroughCasesInSwitch": true,
"moduleResolution": "bundler",
"jsx": "react-jsx"                // no `import React` needed
```

`verbatimModuleSyntax` is why type-only imports are marked. Both spellings appear:

```tsx
import type { Product } from '../utility/catalog';    // Furniture.tsx, Reviews.tsx, pages
import { type Product } from '../utility/catalog'     // FurnitureCard.tsx
```

Equivalent; the top-level form is the majority.

Event types are annotated explicitly where inference can't reach:

```tsx
const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => { ... }
const handleSubmit = async (e: React.FormEvent) => { ... }
```

Generics on state where the initial value is under-informative:

```tsx
const [reviews, setReviews] = useState<ReviewType[]>([]);
const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
const [imageUpload, setImageUpload] = useState<string>('No file chosen');
```

### The `any` escape hatch

The cart is deliberately untyped:

```tsx
const [cart, setCart] = useState<any[]>([]);
const addToCart = (product: any, selectedColor: string) => { ... }

interface CartProps {
    cart: any[];
    setCart: React.Dispatch<React.SetStateAction<any[]>>;
}
```

Cart items are `Product` **plus** three runtime fields (`activeColor`, `cartItemId`, `quantity`). Rather than declare that shape, `any` sidesteps it — which also removes type safety from the entire checkout path, where `item.imageUrl` is added in a third place. A `CartItem extends Product` interface would cover it in four lines. See [[15 - Known Gotchas and Tech Debt]].

`tsc -b` runs as part of `npm run build`, so type errors block deploys.

## Async style

`async/await` inside `try`/`catch` is the dominant form:

```tsx
try {
    const response = await fetch(`/api/reviews/${product.reviewDB}`, { method: 'POST', body: formData });
    if (response.ok) { /* reset */ } else {
        const errorData = await response.json();
        console.error("Backend validation error:", errorData.error);
    }
} catch (error) {
    console.error("Failed to submit review:", error);
}
```

`.then()` chains appear once, in `FurnitureCard.tsx` — the outlier.

Note the two-tier error handling: `response.ok` catches HTTP errors, `catch` catches network failures. Both terminate in `console.error` with a descriptive prefix. No user-visible error UI anywhere in the app.

## Formatting

| Aspect | Convention |
|---|---|
| Quotes | single for imports and JSX-adjacent strings; double for message strings |
| Semicolons | mostly present, inconsistently on import lines |
| Indentation | **4 spaces** in `components/`, `pages/`, `utility/`, `backend/`; **2 spaces** in `App.tsx` and `main.tsx` |
| JSX | multi-line with blank lines separating logical blocks |
| `.map()` in JSX | wrapped in `{ }` on its own lines, body indented |

The map formatting is distinctive and consistent:

```tsx
{
    colors.map((item, index) => (
        <div className="flex flex-col gap-1">
            ...
        </div>
    ))
}
```

No Prettier config and no formatter in `package.json`, which explains the indentation split — `App.tsx` and `main.tsx` retain the Vite scaffold's 2-space default while everything hand-written since uses 4.

## Recurring idioms

**Immutable updates, always.** Spread for objects, `map`/`filter` for arrays:

```tsx
{ ...item, quantity: item.quantity + 1 }
[...prevCart, { ...product, ... }]
const colors = [...product.colors];
```

**Functional state updaters** when the new value depends on the old:

```tsx
setCart((prevCart) => { ... });
setCount((prevIndex) => prevIndex + 1);
```

**Early return as a guard:**

```tsx
if (!item) return <p>Product not found</p>;
if (!product?.reviewDB) return;
if (mongoose.connection.readyState === 1) return next();
```

**Optional chaining** on props that could be undefined: `product?.reviewDB`.

**Both `.find()` and `.filter().map()`** for single-item lookup — the latter avoids a null check by rendering nothing on a miss. Two idioms for one job; see [[05 - Catalog Data Model]].

## Backend style

```js
app.post('/api/reviews/:productKey', connectDB, upload.fields([...]), async (request, response) => {
    try {
        const { productKey } = request.params;
        const { title, rating, comment, username, email } = request.body;
        ...
        response.status(201).json(newReview);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});
```

- ESM throughout (`"type": "module"`), never `require`
- Destructure `params` and `body` at the top of the handler
- Every handler is `async` and fully wrapped in `try`/`catch`
- Explicit `.status(n).json(...)` on every path — never a bare `res.json()`
- Uniform error envelope `{ success: false, error: message }`
- Middleware composed positionally in the route signature

## Inconsistencies worth knowing about

These aren't errors — they're drift from copy-paste evolution, and knowing them prevents confusion:

**Lowercase component function names.** Two components still declare a lowercase function while the file and every import site use PascalCase:

```tsx
export default function cart({ cart, setCart }: CartProps)   // Cart.tsx
export default function footer()                              // Footer.tsx
```

Default exports rename freely at the import site, so this works — but React DevTools shows `cart`, and `Cart.tsx` has a function named `cart` whose first parameter is also named `cart`. `Navigation.tsx` was the third; it is now `Navigation`, because adding hooks to a lowercase function makes `react-hooks/rules-of-hooks` fail — ESLint identifies components by capitalisation.

**The `messageVisbility` typo** (missing `i`) is replicated identically in `Furniture.tsx`, `Reviews.tsx`, and `Contact.tsx` — evidence the toast block was copied wholesale rather than extracted.

**Stale semantic names**, mostly corrected: the nightstand page now says `nightstand-one-container` and the review pages carry their own product names. `table-one-container` remains on the Earth Wood page, where it is accurate.

**Section id `#video-showcase`** on the home hero, which has held a still image rather than a video for some time. The anchor is referenced only by itself, so renaming it is free.

Fixed during the visual overhaul, and worth knowing were once wrong:

- **`console.log` in production paths** — `Furniture.tsx` logged the image gallery and every fetched review on mount, `Navigation.tsx` logged a hover flag on every mouse enter *and* leave across four links, and the toast effect logged `count`. All removed.
- **Missing `key` props** on the gallery `<img>` and colour swatches in `Furniture.tsx`, the studio images in `About.tsx`, and the cart line `<div>` in `Cart.tsx` — the last now keyed by `item.cartItemId`, which is the correct identity rather than an index.
- **A duplicate `key`** in `Furniture.tsx`'s colour map, set on two nested `<div>`s of the same iteration while the list root had none.

Remaining items are catalogued in [[15 - Known Gotchas and Tech Debt]].

## Linting

`eslint.config.js` — flat config, `dist` ignored:

```js
extends: [
  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
]
```

`react-hooks` enforces the rules of hooks and flags incomplete dependency arrays. `react-refresh` keeps HMR working by warning when a module exports something other than components.

Run with:

```bash
npm run lint
```

Linting is **not** wired into `npm run build`, so warnings don't block a deploy — and the repo does not currently pass. `npm run lint` reports seven problems, all of them long-standing:

| Count | Rule | Where |
|---|---|---|
| 4 | `@typescript-eslint/no-explicit-any` | the `any[]` cart in `App.tsx` and `Cart.tsx` |
| 2 | `no-useless-assignment` | `finalColor` in `addToCart`, `absoluteImageUrl` in `handleCheckout` |
| 1 | `react-hooks/exhaustive-deps` | `Furniture.tsx`'s `[]` dependency array |

Every one of them is a symptom of something in [[15 - Known Gotchas and Tech Debt]] rather than a style nit, which is why they are worth reading rather than silencing.
