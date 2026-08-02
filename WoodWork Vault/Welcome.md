# WoodWork Creations — Codebase Vault

Documentation for the `carpentry-website` MERN application.

**Start here → [[00 - Project Overview]]**

Open the **graph view** (`Ctrl+G`) to see the note network.

---

## Reading paths

**New to the codebase**
[[00 - Project Overview]] → [[01 - Architecture and Data Flow]] → [[05 - Catalog Data Model]] → [[03 - Component Network]]

**Working on the frontend**
[[02 - Frontend Routing]] → [[03 - Component Network]] → [[04 - State Management Patterns]] → [[12 - Coding Style Guide]]

**Working on the backend**
[[06 - Backend API]] → [[07 - MongoDB and Mongoose]] → [[08 - Stripe Checkout Flow]] → [[09 - Media Uploads]]

**Working on styling**
[[10 - Tailwind Design System]] → [[11 - Styling Conventions]]

**Shipping a change**
[[14 - Adding a New Product]] → [[13 - Deployment and Configuration]] → [[15 - Known Gotchas and Tech Debt]]

---

## All notes

| # | Note | Covers |
|---|---|---|
| 00 | [[00 - Project Overview]] | stack, directory layout, map of content |
| 01 | [[01 - Architecture and Data Flow]] | dual Vercel build, three request lifecycles |
| 02 | [[02 - Frontend Routing]] | bootstrap chain, route table, `ScrollToTop` |
| 03 | [[03 - Component Network]] | component tree, thin-page/fat-component pattern |
| 04 | [[04 - State Management Patterns]] | five recurring `useState`/`useEffect` idioms |
| 05 | [[05 - Catalog Data Model]] | `Product`, `FURNITURE_CATALOG`, the hub of the app |
| 06 | [[06 - Backend API]] | Express app, middleware, three endpoints |
| 07 | [[07 - MongoDB and Mongoose]] | review schema, serverless connection guard |
| 08 | [[08 - Stripe Checkout Flow]] | hosted checkout, line items, redirects |
| 09 | [[09 - Media Uploads]] | multer → Vercel Blob → Mongo URL |
| 10 | [[10 - Tailwind Design System]] | v4 `@theme` tokens, keyframes, `clamp()` |
| 11 | [[11 - Styling Conventions]] | utility ordering, `max-*` variants, house style |
| 12 | [[12 - Coding Style Guide]] | naming, typing, formatting, inconsistencies |
| 13 | [[13 - Deployment and Configuration]] | every config file, env vars, deploy flow |
| 14 | [[14 - Adding a New Product]] | end-to-end walkthrough |
| 15 | [[15 - Known Gotchas and Tech Debt]] | 35 findings, prioritised |

---

*Notes live in `Docs/`. They are plain Markdown with Mermaid diagrams — readable in any editor or on GitHub. Only the `[[wikilinks]]` are Obsidian-specific.*
