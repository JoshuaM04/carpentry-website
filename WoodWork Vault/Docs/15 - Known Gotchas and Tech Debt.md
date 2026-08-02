# 15 — Known Gotchas and Tech Debt

Observations from reading the code, ordered by consequence. Each links back to the note explaining the surrounding design.

Nothing here is a crisis — the app works. These are the sharp edges to know about before changing something near them.

---

## Correctness — things that are currently wrong

### 1. `olive` colour classes generate nothing
`catalog.ts` uses `bg-olive-500`, `text-olive-500`, and `FurnitureCard.tsx` uses `to-olive-300` — but there is **no `--color-olive-*` token** in the `@theme` block and Tailwind has no built-in `olive` palette.

Result: the olive swatch on every product card and detail page renders with no background, and the card's gradient (`bg-linear-to-br from-white to-olive-300`) has no end colour.

Fix — one line in `src/App.css`:
```css
@theme {
    --color-olive-300: #a3b18a;
    --color-olive-500: #6b7a4f;
}
```
See [[10 - Tailwind Design System]].

### 2. Dynamic class construction in the cart
```tsx
// Cart.tsx
className={`... ${item.activeColor === 'raw wood' ? 'bg-orange-200' : `bg-${item.activeColor}-500`}`}
```
Tailwind scans source **text**; it cannot evaluate `bg-${item.activeColor}-500`. That class never exists in the output CSS, so every non-raw-wood swatch in the cart is transparent.

Fix: carry the class from the catalog instead of rebuilding it — store the chosen `colorStyles[index]` on the cart item in `addToCart`. See [[05 - Catalog Data Model]].

### 3. Clearing a file doesn't clear the file
```tsx
// Reviews.tsx
<button onClick={() => setImageUpload('No file chosen')}>
```
This resets the *display name* only. `selectedImageFile` still holds the `File`, and `handleSubmit` appends it based on that state — so a "cleared" file uploads anyway.

Fix: also call `setSelectedImageFile(null)`. Same for video. See [[09 - Media Uploads]].

### 4. Clear buttons submit the form
The clear buttons in `Reviews.tsx` and `Contact.tsx` have no `type` attribute. Inside a `<form>`, a button defaults to `type="submit"` — so clicking "clear file" submits the review or contact form.

Fix: `type="button"`. (The star-rating buttons already do this correctly, which is how the pattern is known to be understood.)

### 5. `localCart` can contain `undefined`
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

### 6. Missing `key` props
React needs a `key` on the **outermost element** returned by a `.map()`:

| File | Element |
|---|---|
| `Furniture.tsx` | gallery `<img className="animated-gallery">` |
| `Furniture.tsx` | colour swatch wrapper `<div className="flex flex-col gap-1">` — `key={index}` is on the two *inner* divs instead, and duplicated between them |
| `Cart.tsx` | cart line `<div>` (should be `key={item.cartItemId}`) |
| `About.tsx` | studio gallery `<img>` |

Console warnings today; incorrect reconciliation once lists reorder.

### 7. `substring(8)` depends on an exact prefix
```tsx
finalColor = selectedColor.substring(8);   // 'stain - espresso' → 'espresso'
```
Works only because `"stain - "` is exactly 8 characters. A colour labelled `'oil - teak'` or `'Stain - Walnut'` silently produces garbage that then flows into the `cartItemId` and the Stripe line-item name.

Fix: `selectedColor.replace(/^stain - /, '')`, or store a separate `colorValue` in the catalog. See [[04 - State Management Patterns]].

### 8. CORS origins have trailing slashes
```js
origin: ['https://woodwork-creations.com/', 'http://localhost:5173/']
```
A browser's `Origin` header never has a trailing slash, so neither entry can match. Invisible in production — Vercel rewrites make the API same-origin, so CORS never engages — but it means the config is not doing what it appears to. Remove the slashes. See [[06 - Backend API]].

---

## Security and privacy

### 9. Prices come from the client
`POST /api/checkout` builds `unit_amount: Math.round(item.price * 100)` from the request body. A crafted POST can set any price and Stripe honours the session.

Fix: look up price server-side by `item.id`, or use real Stripe Price objects via the (currently unused) `stripePriceId`. See [[08 - Stripe Checkout Flow]].

### 10. Reviewer emails are served publicly
`GET /api/reviews/:productKey` returns whole documents including `email`. Nothing renders it, but it's in the JSON every visitor downloads on a product page.

Fix: `.find({...}).select('-email')`. See [[07 - MongoDB and Mongoose]].

### 11. The review endpoint is unauthenticated and unthrottled
No auth, no rate limit, no CAPTCHA, no moderation — and it accepts 50 MB public file uploads to Vercel Blob. That's the shape of a storage-cost and spam problem the moment it's discovered.

Minimum viable mitigations: rate limit by IP, cap uploads far below 50 MB, and require review approval before display. See [[09 - Media Uploads]].

### 12. No server-side validation beyond `required`
`rating` has no `min`/`max`, so `{ rating: 9999 }` persists and `'★'.repeat(9999)` renders. `comment` and `title` are stored unsanitised.

Fix: `rating: { type: Number, required: true, min: 1, max: 5 }` plus length caps.

---

## Robustness

### 13. Orphaned blobs on failed writes
If `ReviewCollection.create` throws after a successful upload, the blob persists with no document referencing it and no cleanup path.

### 14. The toast lies
`setMessageVisibility('block')` runs at the **top** of `handleSubmit`, before the network call. "Submitted" appears even when the POST fails — the failure only reaches `console.error`. Same in `Contact.tsx`. See [[04 - State Management Patterns]].

### 15. No user-facing error or loading states anywhere
Every failure path terminates in `console.error`. A visitor sees an empty review list or an unresponsive button with no explanation. `handleCheckout` has no pending flag, so a slow network invites repeat clicks and duplicate Stripe sessions.

### 16. No webhook, no order record
Nothing listens for `checkout.session.completed`. Orders exist only in the Stripe dashboard; the app has no record a purchase occurred. `success_url` and `cancel_url` are both the homepage, so the user gets no confirmation and the app cannot distinguish the two outcomes.

### 17. The contact form's image upload goes nowhere
`Contact.tsx` collects a filename into state, but `handleSubmit` posts JSON containing only `name`, `email`, `phone`, `message`. The UI promises an attachment the request never carries. Either wire it up or remove the control.

### 18. `Contact.tsx` never checks failure
`if (response.ok) { ...reset... }` with no `else`. A rejected Formspree submission leaves the form populated and the user told "Submitted".

---

## Maintainability

### 19. Per-product routes and pages
Every product needs two hand-written files and two route registrations that contain no logic beyond a hardcoded `id`. `EarthWood.tsx` and `HazyNight.tsx` differ by one string and two Tailwind classes.

Fix: one `/product/:productId` route with `useParams()`. Detailed in [[14 - Adding a New Product]].

### 20. The toast block is copied three times
Identical 8-line `useState`/`useEffect` pair in `Furniture.tsx`, `Reviews.tsx`, and `Contact.tsx` — including the `messageVisbility` typo, which is the tell.

Fix: `useTimedMessage()` custom hook.

### 21. `handleImage` and `handleVideo` are the same function
Byte-identical apart from the words `image`/`video`. Fix: one factory taking the setter pair.

### 22. Manual `mt-*` compensation on every page
`mt-30`, `mt-40`, `mt-60`, `mt-80` across pages, all working around the absolutely-positioned nav. A shared layout route (or a non-absolute nav) replaces four magic numbers with one rule. See [[11 - Styling Conventions]].

### 23. `About.tsx` has ten state variables for five FAQ panels
Two `useState` per panel (visibility + icon path), plus a comma-expression ternary per toggle. An array of `{ question, answer }` with a single `openIndex` collapses the whole section — and the FAQ markup is currently repeated five times.

### 24. `any[]` for the cart erases type safety on the checkout path
Cart items are `Product` plus `activeColor`, `cartItemId`, `quantity` — and `imageUrl` is bolted on in a fourth place. Four lines fix it:
```ts
interface CartItem extends Product { cartItemId: string; quantity: number; }
```
See [[12 - Coding Style Guide]].

### 25. Review document shapes are hand-mirrored
`Furniture.tsx` declares `ReviewType` (9 fields), `FurnitureCard.tsx` declares `Review` (5 fields), and `reviewSchema` is the actual source of truth in a `.js` file no tsconfig covers. Three definitions, no link between them.

### 26. Average rating is computed client-side
`FurnitureCard.tsx` downloads every review document to display one number, and the home page issues one such request per product tile. An aggregation endpoint returning `{ count, average }` would scale.

Note `averageRating` is `NaN` when `data.length === 0` — masked by the paired `hidden`/`block` elements, but the value is computed regardless.

### 27. `console.log` in production paths
`Furniture.tsx` logs the gallery array and full review payload on every mount. `Navigation.tsx` logs `navHover[0]` on every mouse enter *and* leave, on all four links. The toast effect logs `count`. All ship to users.

### 28. State stores CSS class strings
`useState('hidden')` / `useState('block')` typed as `string` — a typo like `'blok'` type-checks fine and silently does nothing. Boolean state with a derived class is one variable instead of two and is type-safe. See [[04 - State Management Patterns]].

---

## Configuration

### 29. No dev proxy for the API
`vite.config.ts` has no `server.proxy`, and `vercel.json` rewrites don't apply locally. `fetch('/api/...')` from `npm run dev` hits Vite on `:5173`, not Express on `:8080`.

Fix — either use `vercel dev`, or add:
```ts
server: { proxy: { '/api': 'http://localhost:8080' } }
```
See [[13 - Deployment and Configuration]].

### 30. Animation start widths are hardcoded pixel measurements
```css
@keyframes timer-message      { 0% { width: 144.34px; } 100% { width: 0%; } }
@keyframes timer-forms-message{ 0% { width: 91.77px;  } 100% { width: 0%; } }
```
Measured from the specific toast boxes. Change the word "Submitted" and the bar no longer matches its container. `100% → 0%` is self-maintaining. The 5s duration is also duplicated between CSS and the `setTimeout` in JS.

### 31. Unused theme tokens and dependencies
- Seven `--color-svg*` tokens referenced nowhere in `src/`
- `Share+Tech` font fetched by the Google Fonts `@import`, never assigned
- `.about-img-element` declared in CSS, never applied
- `@stripe/stripe-js` in `package.json`, never imported
- `stripePriceId: 'N/A'` on every product, never read
- `const origin = request.headers.origin || ...` computed in `/api/checkout`, never used
- `public/furniture/gallery/img1-6.avif` and `about-media/woodWorkSample.mp4` unreferenced

### 32. Global bare-element CSS
```css
h1   { font-size: clamp(2rem, 3vw, 3.75rem); }
form { width: clamp(1rem, 50vw, 87.5rem); }
```
`form` sets the width of **every** form on the site with no opt-out. Scope to a class if a form ever needs a different width.

### 33. SEO is single-page
One `<title>` and one `<meta name="description">` for all nine routes, no Open Graph tags. Every shared link previews identically. Client-side rendering also means crawlers see an empty `#root` until JS executes.

### 34. Accessibility gaps
- `aria-expanded` in `About.tsx` is on the **panel**, not the controlling `<button>` — the attribute belongs on the control
- The FAQ toggle `<img>` elements have no `alt`
- `max-2md:aria-hidden` is a Tailwind variant, not an attribute; it does nothing (the `hidden` class handles it correctly anyway)
- The disabled add-to-cart button uses `pointer-events-none` rather than the `disabled` attribute, so keyboard users can still activate it with no colour selected

Credit where due: React Aria handles focus trapping and dismissal correctly, every icon-only button has an explicit `aria-label`, and every form input is properly associated with its label.

### 35. No tests, no CI
`tsc -b` in the build script is the only automated check between a commit and production.

---

## Suggested order of work

**Fix first — visible or exploitable**
1. Add `--color-olive-*` (#1) — visual bug on every product
2. `type="button"` on clear buttons (#4) — breaks two forms
3. Clear the `File` state (#3)
4. Server-side prices (#9) and `.select('-email')` (#10)
5. Fix the cart swatch class (#2)

**Then — robustness**
6. Move the toast to *after* a successful response (#14)
7. Rate-limit and validate the review endpoint (#11, #12)
8. Add the missing `key` props (#6)
9. Real error and loading states (#15)

**Then — structure, if the catalog grows**
10. `/product/:productId` route (#19)
11. `useTimedMessage()` hook (#20)
12. `CartItem` type (#24)
13. Shared layout route to kill the `mt-*` numbers (#22)
