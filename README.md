# WoodWork Creations

A storefront for a family-owned carpentry business — browse handmade furniture, pick a finish, leave a review with photos, and check out through Stripe.

**Live:** [woodwork-creations.com](https://woodwork-creations.com/) · **Preview:** [carpentry-website-two.vercel.app](https://carpentry-website-two.vercel.app/)

Built with React 19, Express, MongoDB, and Node on Vercel. 244 commits between June 18 and August 2, 2026.

---

## Table of contents

- [What this is, and who it's for](#what-this-is-and-who-its-for)
- [The stack](#the-stack)
- [Design decisions](#design-decisions)
- [Challenges](#challenges)
- [Working with Claude Code after launch](#working-with-claude-code-after-launch)
- [The security review](#the-security-review)
- [Documenting the project in Obsidian](#documenting-the-project-in-obsidian)
- [What I learned](#what-i-learned)
- [What I want to improve](#what-i-want-to-improve)
- [Running it locally](#running-it-locally)
- [Repository map](#repository-map)

---

## What this is, and who it's for

This is my first full-stack MERN e-commerce project, and my first time using MongoDB, Express, and Node in anger rather than in a tutorial. Everything before this was frontend-only.

The site serves a small carpentry business selling to its **local community**. That single fact shaped almost every decision in the codebase, and it's worth stating up front because a lot of the architecture only makes sense against it:

- **The catalog is small and changes slowly.** Two products at launch, hand-built, each taking weeks. There is no inventory system to build because there is no inventory — pieces are made to order.
- **Delivery is local pickup only.** Stripe collects a US shipping address for the record, but the only shipping option is a $0 "Local Pickup" rate. The About page says so plainly rather than burying it at checkout.
- **The audience is people who want to see the wood.** Buyers here care what poplar looks like under an espresso stain far more than they care about faceted search. So the interface leans on large photography, front/side/top views for every piece, and a finish selector that shows real colour swatches.

So the product is a **showcase with a checkout attached**, not a general-purpose store. Where a real e-commerce platform would generalise, this project deliberately does not.

---

## The stack

| Layer | Technology | Where |
|---|---|---|
| **M**ongoDB | MongoDB Atlas via Mongoose 8 | `backend/src/server.js` |
| **E**xpress | Express 4, exported as a serverless handler | `backend/src/server.js` |
| **R**eact | React 19 + React Router 7 | `src/` |
| **N**ode | Node runtime on Vercel (`@vercel/node`) | build target |
| Build | Vite 8 + TypeScript | `vite.config.ts` |
| Styling | Tailwind CSS v4 (CSS-first config) | `src/App.css` |
| Payments | Stripe Checkout (hosted) | `/api/checkout` |
| File storage | Vercel Blob | `/api/reviews/:productKey` |
| Contact form | Formspree | `src/pages/Contact.tsx` |
| Accessibility | React Aria Components | `Cart.tsx`, `Navigation.tsx` |
| Telemetry | Vercel Analytics + Speed Insights | `src/App.tsx` |

---

## Design decisions

### The catalog is a TypeScript file, not a database table

`src/utility/catalog.ts` exports a typed `Product[]`, and **every product surface in the app derives from it** — the home grid, the detail page, the cart line item, the Stripe line item, the footer's collection column, and the MongoDB query key.

MongoDB stores *only customer reviews*.

This looks like a shortcut and I want to defend it as a choice. With two products that change a few times a year, putting the catalog in Mongo would buy an admin panel I'd have to build, an extra network round trip on every page, and a loading state on the most important content on the site — in exchange for editing convenience I don't need. Keeping it in TypeScript means the compiler catches a typo in a product route at build time instead of at 404. Adding a product is a pull request, which is the right amount of friction for a decision that involves photographing furniture anyway.

The tradeoff is real: prices, copy, and dimensions require a deploy to change. If the catalog reaches twenty pieces or the owner wants to edit prices themselves, this is the first thing that should move to the database.

### One dynamic endpoint instead of per-product routes

Reviews were the first thing I built that couldn't be hardcoded. My instinct was one endpoint per product, which obviously doesn't scale past the first afternoon.

Instead, each product carries a `reviewDB` key in the catalog, and both review endpoints are parameterised on it:

```js
app.get('/api/reviews/:productKey', connectDB, async (request, response) => {
    const { productKey } = request.params;
    const reviews = await ReviewCollection
        .find({ productIdentifier: productKey })
        .select(PUBLIC_REVIEW_PROJECTION);
    response.status(200).json(reviews);
});
```

Every review document stores that same key in `productIdentifier`, so one collection serves the whole catalog and one route handler serves every product. On the frontend, three separate components consume it — the product page, the review submission form, and the catalog card that shows an average rating — all reading `product.reviewDB` from the same catalog object.

This was the moment the MERN stack clicked for me. The catalog file, the URL parameter, and the Mongo query key are the same string, and that string travels through React state, an HTTP route, and a database index without ever being retyped.

### Cart state lives in `App.tsx`

The cart started as local state inside a single product page. That worked until the cart needed to be visible from the navigation bar on *every* page.

Lifting `useState` up to `App.tsx` — above the `<Routes>` — gave the cart drawer and every product page a common parent, so `addToCart` could be passed down as a prop and the drawer could read the same array no matter which route was mounted. No Redux, no Context, because the state is one array with one writer.

The cart is deliberately not persisted. Items are made to order and prices move, so a cart restored from `localStorage` three weeks later would be lying about both.

### Conditional rendering off the current route

The navigation bar is transparent over the home page hero and solid everywhere else. Rather than shipping two navbars, one component reads the router's location and branches:

```tsx
const location = useLocation();
const isHomePage = location.pathname === '/' || location.pathname === '/home';
const isTransparent = isHomePage && !scrolled;
```

Small, but it's where React Router stopped being "a thing that swaps pages" for me and became a source of application state I could style against.

### Stripe hosted checkout, not a custom form

Checkout builds Stripe line items from the cart and redirects to Stripe's hosted page. That means card details never touch my server, my database, or my code — which is the entire reason I chose it. For a solo project handling real money for a real family business, "I am not going to be the one storing card numbers" was not a close call.

### Uploads go straight to blob storage

Reviews accept a photo or video. `multer` holds the file in memory, `@vercel/blob` writes it to storage, and only the resulting URL is saved on the review document. The database stays small and text-only; the serverless function stays stateless, which it has to be, because there is no disk to write to between invocations.

### One Mongoose connection guard for serverless

This one cost me an evening. On Vercel the Express app is a serverless function, so it can be invoked cold, or reuse a warm container, or run several at once — and calling `mongoose.connect()` on every request exhausts the Atlas connection pool.

```js
const connectDB = async (request, response, next) => {
    if (mongoose.connection.readyState === 1) return next();
    await mongoose.connect(process.env.MONGODB_URI);
    return next();
};
```

Checking `readyState` before connecting, as middleware on the routes that need the database, was the fix. Traditional Express tutorials connect once at startup because there *is* a startup. Serverless doesn't work that way.

### Tailwind v4 with a CSS-first theme

All design tokens — the bark/bone/clay colour ramps, the type scale, the header height — are declared in an `@theme` block in `src/App.css`. Page padding derives from a single `--header-h` variable rather than a per-page margin, which is what it used to be.

---

## Challenges

**Deploying a frontend and a backend as one Vercel project.** `vercel.json` runs two builds from one repo: `@vercel/static-build` for the Vite output and `@vercel/node` for the Express app, with rewrites sending `/api/*` to the server and everything else to `index.html` so client-side routing survives a page refresh. Getting that last rewrite right took several attempts — before it, deep-linking to `/about` returned a 404 from the CDN because no such file exists.

**Serverless changed how I had to write the backend.** Covered above, but it deserves listing as a challenge and not just a decision: nearly everything I'd read about Express assumed a long-lived process.

**Cart identity across finishes.** The same table in espresso and in olive are different line items, but incrementing the espresso one shouldn't touch the olive one. The fix was a composite key — `` `${product.id}-${finalColor}` `` — used to find an existing item before deciding whether to push or increment. Several commits in late July are me chasing bugs where the colour string didn't match between the cart, the conditional rendering, and the Stripe line item because one path prefixed it with `"Stain - "` and another didn't.

**Uploads breaking layout.** A user with a 60-character filename blew out the review form horizontally. Truncating the displayed name with a substring fixed it. So did discovering that `max-w-*` and `w-*` are not interchangeable when the child is an uploaded image of unknown dimensions.

**Autoplaying video on mobile.** The hero originally ran a workshop video. iOS Safari's autoplay policy, a `useEffect` that didn't help, and the file size all conspired against it. It's now a still image, and the site is faster for it.

**Accessibility retrofitting.** Icon-only buttons with no accessible name, labels not associated with their inputs, a disabled add-to-cart button that was still keyboard-reachable because it was disabled with `pointer-events-none` instead of the `disabled` attribute. Running the site through Lighthouse found most of these. Adopting React Aria Components for the mobile menu and cart drawer prevented the next round.

---

## Working with Claude Code after launch

The site was already built and deployed — 219 commits of it — before I used any AI tooling on this project. Everything above was hand-written.

Once it was live, I used [Claude Code](https://claude.com/claude-code) for two follow-up passes, both isolated on a `visual-update` branch and merged through pull requests so the history stays legible:

**A visual overhaul across every page and route** ([`24c8f71`](https://github.com/JoshuaM04/carpentry-website/commit/24c8f71)). The original design was functional but inconsistent — spacing set per page, a few colour tokens referenced in class names that were never defined, so those swatches rendered transparent. This pass rebuilt the design system: real colour ramps in `@theme`, a display/eyebrow/micro type scale, a single `--header-h` the nav and every page pad against, and reusable `.btn` / `.field` / `.img-frame` classes replacing ad-hoc utility strings. Routes, catalog data, form handlers, and checkout logic were left untouched by design — this was a styling pass, and keeping the diff to styling is what made it reviewable.

**A code-organisation pass.** Duplicated markup collapsed into data-driven components — the FAQ went from ten `useState` calls and five copies of the same markup to one array mapped over. Dead tokens, an unused webfont, unreferenced CSS classes, and leftover `console.log` calls came out. Missing `key` props got added. Keyframes that started at hardcoded pixel widths got rewritten in percentages.

Roughly a dozen small follow-up commits after that are me reviewing the output and correcting it — re-centering the wordmark, changing what the hero leads with, labelling the collections strip as stock photography, fixing a ghost button whose label went invisible on hover. The tool did the sweep; the judgement calls about what the site should say and look like stayed mine.

I want to be precise about what this was and wasn't. It wasn't "AI built my site." It was using a tool to do a consistent, mechanical pass over 3,000 lines of CSS and JSX that I'd written incrementally over six weeks — the kind of cleanup I knew the codebase needed and would have deprioritised forever.

---

## The security review

Before making this repository public I had Claude Code audit it, on the reasoning that publishing the source of a live site taking real payments is exactly when you want a second read of the backend. It checked the git history for committed credentials — clean, no `.env` has ever been tracked and the Stripe, MongoDB, and blob tokens have always been read from the environment — and then went through the API surface. That part was less clean, and the fixes are in the current code.

**Checkout prices were taken from the request body.** `/api/checkout` built its Stripe line items out of whatever the client posted, including `unit_amount`. A crafted request could name its own price and Stripe would honour the session — the $535 nightstand for fifty cents.

The fix was to stop trusting the client with anything involving money. `backend/src/catalog.js` is now the server-side authority for price, display name, and product image; the browser sends only a product id, a finish, and a quantity, and everything chargeable is resolved server-side:

```js
const product = item && getProduct(item.id);
if (!product) return response.status(400).json({ error: "That item is no longer available." });
```

I verified it by replaying the attack against a local instance with a tap on the outbound Stripe call. Sending `price: 0.5`, `name: "FREE TABLE"`, and an off-site image URL now produces a Stripe request reading `unit_amount: 40000`, `"Earth Wood (Espresso)"`, and the real catalog image — every client-supplied value discarded.

**Reviewer emails were being served to the public.** `GET /api/reviews/:productKey` returned whole documents, `email` included. Nothing rendered it, but it was in JSON every visitor downloaded — and the home page fires one of those requests per product tile. Both read paths now go through a projection that withholds it.

**The review endpoint was unauthenticated, unthrottled, and accepted 50 MB uploads.** It now validates every field, rate limits to three submissions per IP per hour (counted in MongoDB, because a counter held in a serverless function's memory resets on every cold start), caps images at 8 MB and video at 25 MB, and rejects files whose type doesn't match the field.

**An out-of-range rating could blank a product page.** `rating` had no bounds, so a stored `6` made the star row compute `'★'.repeat(5 - 6)` — and `repeat` throws a `RangeError` on a negative count, which unmounts the React tree. It's bounded in the schema, rejected at the endpoint, and clamped at the point of render so rows written before the fix can't trigger it either.

Two smaller things came out of the same pass: the CORS allowlist had trailing slashes on both origins, which no browser's `Origin` header ever carries, so neither entry could ever match; and the server-side catalog lookup used a truthiness check on a plain object, meaning a product id of `__proto__` matched an inherited property and returned a product with no price. The lookup uses `Object.hasOwn` now — that one was caught by a smoke test rather than by reading, which is the argument for running the code.

The interesting part was how many of these came from the same instinct: trusting the client because I wrote the client. The browser code and the server code were mine, so it didn't occur to me that the boundary between them is where someone else's input arrives.

---

## Documenting the project in Obsidian

The practical problem with an AI coding assistant is that each new session starts with no memory of the last one. Re-explaining the architecture every time is slow and produces inconsistent answers.

So I built an Obsidian vault of sixteen linked Markdown notes documenting the codebase — architecture and request lifecycles, the routing chain, the component network, the state management idioms, the catalog data model, each backend endpoint, the Mongoose connection guard, the Stripe flow, the upload path, the Tailwind token system, the styling conventions, a walkthrough for adding a new product, and a running list of known gotchas and tech debt. Notes are connected with `[[wikilinks]]` and diagrammed with Mermaid, so Obsidian's graph view shows the shape of the project.

Pointing a fresh session at the relevant notes means it starts with the same context I have, instead of inferring conventions from whichever three files it happened to read first. It's also genuinely useful to me — the tech debt note is where I found half the improvements listed below, and I'd forgotten several of them.

The vault lives outside this repository now to keep the codebase to code, but the commit that introduced it ([`fcd842e`](https://github.com/JoshuaM04/carpentry-website/commit/fcd842e)) is still in the history. It's the practice I'd carry into the next project regardless of tooling: documentation that describes *why*, kept close enough to the code that it gets updated.

---

## What I learned

**Building the backend teaches you what the frontend was hiding.** Every prior project ended at the network boundary. Owning both sides meant learning that a schema is a contract two codebases have to agree on, that the shape of a URL is a design decision, and that "it works locally" and "it works deployed" are separate claims.

**Parameterised routes are the whole idea.** `/api/reviews/:productKey` doing the work of an endpoint per product was the concept that made the rest of the backend make sense.

**React Router made routes into state.** `useLocation` driving conditional styling, `useParams` as the bridge between a URL and a database query, and a `ScrollToTop` component because client-side navigation preserves scroll position and users find that disorienting.

**Conditional rendering is where the bugs live.** Nearly every rendering bug I chased came down to two branches disagreeing about a string's format. Deriving values from one source instead of reconstructing them in three places is a lesson I paid for in commits.

**Serverless is a different execution model, not a deployment detail.** No startup, no shared memory, no disk.

**Integrating a payment provider is mostly about what you choose not to build.** Hosted checkout meant a smaller surface, less liability, and less code.

**Environment variables and the deploy boundary.** Stripe keys, the Mongo URI, and the blob token live in Vercel's environment and never in the repository. Obvious in hindsight, and the first thing I checked before making this public.

**Accessibility is cheaper to design in than to retrofit.** I did it the expensive way here.

---

## What I want to improve

Honest list, roughly in the order I'd tackle it. The items from [the security review](#the-security-review) are already fixed; these are what's left.

**Review moderation.** Submissions are validated and rate limited now, but they still publish immediately. An approval step before display is the remaining gap on that endpoint.

**Real error and loading states.** Right now most failure paths end at `console.error`, and the "submitted" toast fires before the network call resolves rather than after it succeeds. A visitor on a slow connection sees an empty list or an unresponsive button with no explanation.

**Stripe webhooks and order records.** Nothing listens for `checkout.session.completed`, so orders exist only in the Stripe dashboard and the app has no record a purchase happened. Success and cancel URLs both point at the homepage, so the app can't even tell the two apart.

**Collapse the per-product pages into one dynamic route.** Every product currently needs two hand-written files and two route registrations that differ by a single string. `/product/:productId` with `useParams` replaces all of it — the same lesson the review endpoint already taught me, applied to the frontend.

**Type the cart properly.** It's `any[]` today, which erases type safety on the path that talks to Stripe. A `CartItem extends Product` interface is four lines and fixes the navigation component's props at the same time.

**Move the catalog to MongoDB with an admin interface**, once the catalog is big enough to justify it, so the owner can update prices without a deploy.

**Per-route SEO.** One `<title>` and one description serve all nine routes, and there are no Open Graph tags, so every shared link previews identically. Server-side rendering would also fix crawlers seeing an empty `#root`.

**Tests and CI.** `tsc -b` in the build script is currently the only automated check between a commit and production. Lint isn't wired into the pipeline and doesn't currently pass cleanly.

**A dev proxy.** Vercel's rewrites don't apply locally, so `fetch('/api/...')` in dev hits Vite instead of Express. Adding `server.proxy` to `vite.config.ts` would make local development exercise the API at all.

---

## Running it locally

```bash
npm install
npm run dev
```

The backend has its own dependencies:

```bash
cd backend && npm install
```

Create `backend/.env.local` with:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (use a test key locally) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |
| `IP_HASH_SALT` | Optional. Salts the hashed IP used for review rate limiting |

Because `vercel.json`'s rewrites only apply on Vercel, `vercel dev` gives the closest match to production locally.

---

## Repository map

```
carpentry-website/
├── index.html                 # Vite entry, SEO meta, #root mount
├── vercel.json                # dual build: static frontend + node backend
├── src/
│   ├── main.tsx               # createRoot + StrictMode + BrowserRouter
│   ├── App.tsx                # cart state owner + route table
│   ├── App.css                # Tailwind import + @theme tokens + component classes
│   ├── components/            # reusable, prop-driven
│   ├── pages/
│   │   ├── Catalog/<Type>/    # product detail pages
│   │   └── Reviews/<Type>/    # review submission pages
│   └── utility/catalog.ts     # Product type + FURNITURE_CATALOG
├── backend/src/
│   ├── server.js              # the entire Express API
│   └── catalog.js             # server-side price authority for checkout
└── public/                    # images, SVG icons, video
```

---

Built by [Joshua M.](https://github.com/JoshuaM04)
