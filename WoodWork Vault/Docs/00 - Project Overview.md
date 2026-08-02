# 00 — Project Overview

**WoodWork Creations** — a storefront for a family-owned carpentry business.
Live: `https://woodwork-creations.com/` · Preview: `https://carpentry-website-two.vercel.app/`

This vault documents the codebase at `carpentry-website/`. Every note is standalone; the `[[wikilinks]]` form the network.

---

## Map of content

### Foundations
- [[01 - Architecture and Data Flow]] — how MERN actually maps onto this repo, and the three request lifecycles
- [[13 - Deployment and Configuration]] — Vite, Vercel, TypeScript, ESLint

### Frontend
- [[02 - Frontend Routing]] — `main.tsx` → `App.tsx` → `<Routes>`
- [[03 - Component Network]] — who renders whom, and why each component exists
- [[04 - State Management Patterns]] — the `useState`/`useEffect` idioms used throughout
- [[05 - Catalog Data Model]] — `Product` and `FURNITURE_CATALOG`, the single source of truth

### Backend
- [[06 - Backend API]] — the Express app and its three endpoints
- [[07 - MongoDB and Mongoose]] — the review schema and the serverless connection guard
- [[08 - Stripe Checkout Flow]] — cart → session → hosted checkout
- [[09 - Media Uploads]] — multer → Vercel Blob

### Conventions
- [[10 - Tailwind Design System]] — the `@theme` block and custom tokens
- [[11 - Styling Conventions]] — how utilities are actually written in this codebase
- [[12 - Coding Style Guide]] — naming, typing, and structural conventions

### Practical
- [[14 - Adding a New Product]] — end-to-end recipe
- [[15 - Known Gotchas and Tech Debt]] — things that will bite you

---

## The stack in one table

| Layer | Technology | Where |
|---|---|---|
| **M**ongoDB | MongoDB Atlas (via Mongoose 8) | `backend/src/server.js` |
| **E**xpress | Express 4, exported as a serverless handler | `backend/src/server.js` |
| **R**eact | React 19 + React Router 7 | `src/` |
| **N**ode | Node runtime on Vercel (`@vercel/node`) | build target |
| Build | Vite 8 + `@vitejs/plugin-react` | `vite.config.ts` |
| Styling | Tailwind CSS v4 (CSS-first config) | `src/App.css` |
| Payments | Stripe Checkout (hosted) | `/api/checkout` |
| File storage | Vercel Blob | `/api/reviews/:productKey` |
| Contact form | Formspree (third-party) | `src/pages/Contact.tsx` |
| A11y primitives | React Aria Components | `Cart.tsx`, `Navigation.tsx` |
| Telemetry | Vercel Analytics + Speed Insights | `src/App.tsx` |

## Directory shape

```
carpentry-website/
├── index.html                 # Vite entry, SEO meta, #root mount
├── vite.config.ts             # react() + tailwindcss() plugins
├── vercel.json                # dual build: static frontend + node backend
├── src/
│   ├── main.tsx               # createRoot + StrictMode + BrowserRouter
│   ├── App.tsx                # cart state owner + route table
│   ├── App.css                # Tailwind import + @theme design tokens
│   ├── components/            # reusable, prop-driven
│   ├── pages/                 # route targets
│   │   ├── Catalog/<Type>/    # product detail pages
│   │   └── Reviews/<Type>/    # review submission pages
│   └── utility/catalog.ts     # Product type + FURNITURE_CATALOG
├── backend/src/server.js      # entire Express API (178 lines)
└── public/                    # static images, SVG icons, video
```

## The one thing to understand first

There is no database of products. `src/utility/catalog.ts` is a hardcoded TypeScript array, and **every product surface in the app derives from it** — the home grid, the detail page, the cart line item, the Stripe line item, and the Mongo query key. MongoDB stores *only customer reviews*.

Read [[05 - Catalog Data Model]] before anything else.
