# 15 — Known Gotchas and Tech Debt

Observations from reading the code, ordered by consequence. Each links back to the note explaining the surrounding design.

Nothing here is a crisis — the app works. These are the sharp edges to know about before changing something near them.

A round of these were closed out during the visual overhaul; they are listed at the bottom under [Recently fixed](#recently-fixed) rather than deleted, because knowing a thing *used* to be broken is how you avoid reintroducing it.

---

## Correctness — things that are currently wrong

### 1. `localCart` can contain `undefined`
```tsx
const localCart = cart.map(item => {
    if (item.image && !item.image.includes('...')) {
        ...
        return { ...item, imageUrl: absoluteImageUrl };
    };          // no else — returns undefined
});
```
The `return` is inside the `if`. Any item failing the guard becomes `undefined`, serialises to `null`, and crashes the server's `.map()` on `item.activeColor`. Unreachable with today's catalog, but load-bearing on an invariant nothing enforces.

Also: `!item.image.includes('...')` tests for a literal three-dot substring — apparently a leftover of the filename-truncation convention from the upload UI, which has nothing to do with catalog image paths. See [[08 - Stripe Checkout Flow]].

### 2. `substring(8)` depends on an exact prefix
```tsx
finalColor = selectedColor.substring(8);   // 'stain - espresso' → 'espresso'
```
Works only because `"stain - "` is exactly 8 characters. A colour labelled `'oil - teak'` or `'Stain - Walnut'` silently produces garbage that then flows into the `cartItemId`, the Stripe line-item name, **and now the cart's swatch lookup** — `SWATCH_STYLES` is keyed by the post-`substring` value, so a mis-sliced string also loses its colour chip.

Fix: `selectedColor.replace(/^stain - /, '')`, or store a separate `colorValue` in the catalog. Better still, carry `colorStyles[index]` onto the cart item in `addToCart` and delete the lookup table entirely. See [[04 - State Management Patterns]] and [[05 - Catalog Data Model]].

### 3. CORS origins have trailing slashes
```js
origin: ['https://woodwork-creations.com/', 'http://localhost:5173/']
```
A browser's `Origin` header never has a trailing slash, so neither entry can match. Invisible in production — Vercel rewrites make the API same-origin, so CORS never engages — but it means the config is not doing what it appears to. Remove the slashes. See [[06 - Backend API]].

---

## Security and privacy

### 4. Prices come from the client
`POST /api/checkout` builds `unit_amount: Math.round(item.price * 100)` from the request body. A crafted POST can set any price and Stripe honours the session.

Fix: look up price server-side by `item.id`, or use real Stripe Price objects via the (currently unused) `stripePriceId`. See [[08 - Stripe Checkout Flow]].

### 5. Reviewer emails are served publicly
`GET /api/reviews/:productKey` returns whole documents including `email`. Nothing renders it, but it's in the JSON every visitor downloads on a product page — and the home page now issues one such request per product tile.

Fix: `.find({...}).select('-email')`. See [[07 - MongoDB and Mongoose]].

### 6. The review endpoint is unauthenticated and unthrottled
No auth, no rate limit, no CAPTCHA, no moderation — and it accepts 50 MB public file uploads to Vercel Blob. That's the shape of a storage-cost and spam problem the moment it's discovered.

Minimum viable mitigations: rate limit by IP, cap uploads far below 50 MB, and require review approval before display. See [[09 - Media Uploads]].

### 7. No server-side validation beyond `required`, and an out-of-range rating crashes the page
`rating` has no `min`/`max`, so `{ rating: 9999 }` persists — and the renderer cannot survive it:

```tsx
<p>{'★'.repeat(review.rating)}<span className="text-bark-900/25">{'★'.repeat(5 - review.rating)}</span></p>
```

`String.prototype.repeat` **throws a `RangeError` on a negative count**. Any stored rating above 5 makes `5 - rating` negative, the exception is thrown during render, and React unmounts the whole tree — a blank product page, not a malformed one. A rating below 1 is merely ugly; a rating of 6 is fatal.

This is reachable by anyone who can POST to the unauthenticated review endpoint (#6), which makes it the sharpest edge in this file.

Fix, at both ends:
```js
rating: { type: Number, required: true, min: 1, max: 5 }   // reviewSchema
```
```tsx
const stars = Math.max(0, Math.min(5, review.rating));      // Furniture.tsx
```
`comment` and `title` are stored unsanitised too, with no length caps.

---

## Robustness

### 8. Orphaned blobs on failed writes
If `ReviewCollection.create` throws after a successful upload, the blob persists with no document referencing it and no cleanup path.

### 9. The toast lies
`setMessageVisibility('block')` runs at the **top** of `handleSubmit`, before the network call. "Submitted" appears even when the POST fails — the failure only reaches `console.error`. Same in `Contact.tsx`, and the same shape in `Furniture.tsx`, where `showMessage()` fires on click rather than on a confirmed cart write. See [[04 - State Management Patterns]].

### 10. No user-facing error or loading states anywhere
Every failure path terminates in `console.error`. A visitor sees an empty review list or an unresponsive button with no explanation. `handleCheckout` has no pending flag, so a slow network invites repeat clicks and duplicate Stripe sessions.

### 11. No webhook, no order record
Nothing listens for `checkout.session.completed`. Orders exist only in the Stripe dashboard; the app has no record a purchase occurred. `success_url` and `cancel_url` are both the homepage, so the user gets no confirmation and the app cannot distinguish the two outcomes.

### 12. The contact form's image upload goes nowhere
`Contact.tsx` collects a filename into state, but `handleSubmit` posts JSON containing only `name`, `email`, `phone`, `message`. The UI promises an attachment the request never carries. Either wire it up or remove the control.

### 13. `Contact.tsx` never checks failure
`if (response.ok) { ...reset... }` with no `else`. A rejected Formspree submission leaves the form populated and the user told "Submitted".

---

## Maintainability

### 14. Per-product routes and pages
Every product needs two hand-written files and two route registrations that contain no logic beyond a hardcoded `id`. `EarthWood.tsx` and `HazyNight.tsx` differ by one string and one devtools class name.

Fix: one `/product/:productId` route with `useParams()`. Detailed in [[14 - Adding a New Product]].

### 15. The toast block is copied three times
Identical 8-line `useState`/`useEffect` pair in `Furniture.tsx`, `Reviews.tsx`, and `Contact.tsx` — including the `messageVisbility` typo, which is the tell.

Fix: `useTimedMessage()` custom hook. This is now the **only** surviving instance of state holding a CSS class string; extracting it would retire the pattern from the codebase entirely. See [[04 - State Management Patterns]].

### 16. `handleImage` and `handleVideo` are the same function
Byte-identical apart from the words `image`/`video`. Fix: one factory taking the setter pair.

### 17. `any[]` for the cart erases type safety on the checkout path
Cart items are `Product` plus `activeColor`, `cartItemId`, `quantity` — and `imageUrl` is bolted on in a fourth place. Four lines fix it:
```ts
interface CartItem extends Product { cartItemId: string; quantity: number; }
```
`Navigation` derives its props from `Cart` with `React.ComponentProps<typeof Cart>`, so typing `Cart` fixes both at once. See [[12 - Coding Style Guide]].

### 18. Review document shapes are hand-mirrored
`Furniture.tsx` declares `ReviewType` (9 fields), `FurnitureCard.tsx` declares `Review` (5 fields), and `reviewSchema` is the actual source of truth in a `.js` file no tsconfig covers. Three definitions, no link between them.

### 19. Average rating is computed client-side
`FurnitureCard.tsx` downloads every review document to display one number, and the home page issues one such request per product tile. An aggregation endpoint returning `{ count, average }` would scale.

`averageRating` is still `NaN` when `data.length === 0` in `FurnitureCard` — the ternary never renders it, but the value is computed regardless. `Furniture.tsx` guards the same expression properly (`reviews.length === 0 ? 0 : ...`); the two should agree.

### 20. `colorTextStyles` is populated but never read
The array existed for the `text-[1px]` swatch-label trick. Both surfaces that used it now render the label properly, so nothing consumes it — yet it is still in the `Product` interface and still hand-maintained in lockstep with two other arrays for every new product. Delete it, or collapse all three into an array of objects. See [[05 - Catalog Data Model]].

### 21. Marketing copy lives in components
`Home.tsx` holds `PROCESS` — four objects of prose describing sourcing, craft, finishing, and pickup — plus `COLLECTION_IMAGES`, and `About.tsx` holds the whole `FAQ` array. These are content, not layout, and editing them means editing a component.

They are at least *hoisted* to module scope with SCREAMING_SNAKE names, which keeps them out of the render body and makes them easy to lift into a content module later.

### 22. Two facts about the catalog are hardcoded in the footer
The **Collection** column maps `FURNITURE_CATALOG` and stays current, but the `Chairs — coming soon` line beneath it is literal text, as is the `03 / Chairs / In the workshop` block on the home page. Both need a manual edit the day a chair ships. See [[14 - Adding a New Product]].

### 23. The hero section is still called `#video-showcase`
It has held a still image, not a video, for some time. The id is referenced only by itself, so renaming it costs nothing.

### 24. Ghost buttons carry their surface in the class list
`.btn-ghost` fills dark on hover; `.btn-ghost-light` fills light. Putting a `btn-ghost-light` on a bone section, or forgetting it on a bark one, produces a hover state with no contrast. The two rules must be read together — see [[10 - Tailwind Design System]].

### 25. The finish selector assumes short labels
The swatch row is `grid grid-cols-4 w-max`, so its width is four times the **longest** finish name. `"Stain - Espresso"` fits comfortably; something like `"Hand-rubbed walnut oil"` would push the row past the column on narrow screens. The `max-xsm:grid-cols-2` fallback covers phones but not the 534–900px band. See [[11 - Styling Conventions]].

---

## Configuration

### 26. No dev proxy for the API
`vite.config.ts` has no `server.proxy`, and `vercel.json` rewrites don't apply locally. `fetch('/api/...')` from `npm run dev` hits Vite on `:5173`, not Express on `:8080` — which is why the console fills with `Unexpected token '<'` on any page that loads reviews: the SPA fallback returns `index.html` and `.json()` chokes on it.

Fix — either use `vercel dev`, or add:
```ts
server: { proxy: { '/api': 'http://localhost:8080' } }
```
See [[13 - Deployment and Configuration]].

### 27. The toast duration is duplicated
`5s` in the two `--animate-timer-*` tokens, `5000` in three `setTimeout` calls. The keyframes themselves are no longer measured in pixels, but the timing still lives in two languages.

### 28. Unused dependencies and assets
- `@stripe/stripe-js` in `package.json`, never imported
- `stripePriceId: 'N/A'` on every product, never read
- `const origin = request.headers.origin || ...` computed in `/api/checkout`, never used
- `public/hammer-favicon.svg` — superseded, never referenced
- `public/about-media/woodWorkSample.mp4` and `woodworkPoster.webp` — unreferenced since the hero became a still image
- `public/furniture/catalog/nightstands/vatano/*` and `tables/earth-wood.{jpg,png}` — assets for products not in the catalog

### 29. SEO is single-page
One `<title>` and one `<meta name="description">` for all nine routes, no Open Graph tags. Every shared link previews identically. Client-side rendering also means crawlers see an empty `#root` until JS executes.

The `<h1>` situation did improve: each page now has exactly one, and it describes the page rather than repeating the company name.

### 30. No tests, no CI
`tsc -b` in the build script is the only automated check between a commit and production. `npm run lint` is not wired in and does not currently pass — see the table in [[12 - Coding Style Guide]].

---

## Recently fixed

Closed during the visual overhaul. Left here as a record of what the code used to do.

| Was | Now |
|---|---|
| `bg-olive-500` / `text-olive-500` referenced with no token behind them — the olive swatch rendered transparent | `--color-olive-500` and `--color-olive-300` defined in `@theme`; `--color-raw-500` added for raw wood |
| `` `bg-${item.activeColor}-500` `` in `Cart.tsx` — a class Tailwind never generated | `SWATCH_STYLES` lookup with literal class names |
| Clearing a file reset the display name only, so a "cleared" file still uploaded | `setSelectedImageFile(null)` alongside it |
| Clear buttons had no `type`, so clicking one submitted the form | `type="button"` on all of them |
| Missing `key` props on four `.map()` calls; a duplicate `key` on two nested divs of one iteration | keyed, with the cart line keyed by `cartItemId` |
| `mt-30` / `mt-40` / `mt-60` / `mt-80` per page to clear the absolute nav | one `--header-h`, consumed by the nav and every page |
| `h1 { }` and `form { }` as global element rules | class-based sizing, opted into |
| Keyframes starting at measured pixel widths (`144.34px`, `91.77px`) | `100% → 0%` against a `w-fit` parent |
| Ten `useState` calls for five FAQ panels, markup repeated five times | one `number[]` over a `FAQ` array |
| A four-element `"true"`/`"false"` array tracking nav hover | `.link-underline`, pure CSS |
| `console.log` on every mount, every hover, and every toast | removed |
| `pointer-events-none` for the disabled add-to-cart, reachable by keyboard | the `disabled` attribute, plus a label that states the precondition |
| `aria-expanded` on the FAQ panel rather than its button; no `alt` on the toggle icons; `max-2md:aria-hidden` no-op classes | attributes on the controls, decorative `alt=""`, no-ops removed |
| `text-[1px]` to hide swatch labels | `sr-only`, or a visible caption |
| Seven `--color-svg*` tokens, a `Share+Tech` webfont, and `.about-img-element` — all unreferenced | removed from `App.css` |
| `public/furniture/gallery/img1-6.avif` unreferenced | used by the home collections strip, and labelled as stock photography |

---

## Suggested order of work

**Fix first — exploitable or user-visible**
1. Server-side prices (#4) and `.select('-email')` (#5)
2. Rate limit and validate the review endpoint (#6, #7)
3. Move the toast to *after* a successful response (#9)
4. Handle the Formspree failure path (#13) and either wire up or remove the contact attachment (#12)

**Then — robustness**
5. Real error and loading states (#10)
6. Guard `localCart` against `undefined` (#1)
7. Replace `substring(8)` with something that can't mis-slice (#2)
8. A dev proxy, so local development exercises the API at all (#26)

**Then — structure, if the catalog grows**
9. `/product/:productId` route (#14)
10. `useTimedMessage()` hook (#15) — retires the last class-string state
11. `CartItem` type (#17), which also types `Navigation`
12. Collapse the three colour arrays into one array of objects (#20)
