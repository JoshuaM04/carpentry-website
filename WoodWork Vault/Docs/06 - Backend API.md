# 06 — Backend API

The entire server is one file: `backend/src/server.js`, 178 lines.

Related: [[01 - Architecture and Data Flow]] · [[07 - MongoDB and Mongoose]] · [[08 - Stripe Checkout Flow]] · [[09 - Media Uploads]]

---

## Shape of the file

```
imports + stripe client
  ↓
app + global middleware (json, urlencoded, cors)
  ↓
multer config
  ↓
mongoose schema + model
  ↓
connectDB middleware
  ↓
POST /api/reviews/:productKey
GET  /api/reviews/:productKey
POST /api/checkout
  ↓
conditional app.listen
export default app
```

No router files, no controllers, no services. For three endpoints this is proportionate; the seams to split along are marked in [[15 - Known Gotchas and Tech Debt]].

## Global middleware

```js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ['https://woodwork-creations.com/', 'http://localhost:5173/'],
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
```

`express.json()` handles the checkout POST. It does **not** handle the review POST — that's `multipart/form-data`, parsed per-route by multer.

Note both CORS origins carry a trailing slash. Browser `Origin` headers never do (`https://woodwork-creations.com`, no slash), so these entries can't match a real request. It doesn't surface in production because Vercel rewrites make the API same-origin, meaning CORS never engages. Flagged in [[15 - Known Gotchas and Tech Debt]].

## The `connectDB` gate

```js
const connectDB = async (request, response, next) => {
    if (mongoose.connection.readyState === 1) {
        return next();
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB Atlas");
        return next();
    } catch (error) {
        console.error("Database connection failed:", error);
        return response.status(500).json({ success: false, error: "Database connection failed", mongoError: error.message });
    }
}
```

Applied **per-route**, not globally — `/api/checkout` deliberately skips it, since Stripe needs no database. Full explanation of why it's written this way in [[07 - MongoDB and Mongoose]].

---

## Endpoints

### `POST /api/reviews/:productKey`

Middleware chain: `connectDB` → `multer.fields([image, video])` → handler.

```js
app.post('/api/reviews/:productKey', connectDB, upload.fields([
        { name: 'image', maxCount: 1},
        { name: 'video', maxCount: 1 }
    ]), async(request, response) => {
```

Steps:
1. Read `productKey` from `request.params`, text fields from `request.body`
2. Defensively extract files: `request.files && request.files['image'] ? request.files['image'][0] : null`
3. Upload each present file to Vercel Blob, capture `blob.url`
4. `ReviewCollection.create({ productIdentifier: productKey, ...fields, imageUpload, videoUpload })`
5. Respond `201` with the created document

`productIdentifier` comes from the **URL param**, not the body — the client can't submit a review against a mismatched product by tampering with form fields.

Returns `500` with `error.message` on any throw, including Mongoose validation failures.

### `GET /api/reviews/:productKey`

```js
app.get('/api/reviews/:productKey', connectDB, async (request, response) => {
    try {
        const { productKey } = request.params;
        const reviews = await ReviewCollection.find({ productIdentifier: productKey });
        response.status(200).json(reviews);
    } catch (error) {
        response.status(500).json({ success: false, error: error.message });
    }
});
```

No pagination, no sort, no projection. It returns the **full documents**, which includes the reviewer's `email` field — see the privacy note in [[15 - Known Gotchas and Tech Debt]].

Called by both `Furniture.tsx` and `FurnitureCard.tsx`, meaning the home page issues one request per product tile.

### `POST /api/checkout`

No `connectDB`. Body is JSON: `{ cartItems: [...] }`. Detailed in [[08 - Stripe Checkout Flow]].

---

## Route table

| Method | Path | DB | Body | Success |
|---|---|---|---|---|
| POST | `/api/reviews/:productKey` | yes | `multipart/form-data` | `201` document |
| GET | `/api/reviews/:productKey` | yes | — | `200` array |
| POST | `/api/checkout` | no | `application/json` | `200 { url }` |

`vercel.json` also rewrites a bare `/api/reviews` to the server, but no handler is registered for it — that path falls through to Express's default 404.

## Error handling convention

Every handler is a `try`/`catch` returning the same envelope:

```js
catch (error) {
    response.status(500).json({ success: false, error: error.message });
}
```

Consistent, but everything is a `500` — a Mongoose validation failure (client's fault, should be `400`) is indistinguishable from a database outage. There's no `app.use((err, req, res, next) => ...)` error middleware; each route handles its own.

Naming note: parameters are spelled out as `request` / `response` rather than the conventional `req` / `res`. Applied consistently, including in `connectDB`. See [[12 - Coding Style Guide]].

## Environment variables

| Variable | Used by | Notes |
|---|---|---|
| `MONGODB_URI` | `connectDB` | Atlas connection string |
| `STRIPE_SECRET_KEY` | `new Stripe(...)` at module load | server-side only |
| `BLOB_READ_WRITE_TOKEN` | `@vercel/blob` `put()` | read implicitly from env |
| `BLOB_STORE_ID` | Vercel Blob | provisioned by Vercel CLI |
| `NODE_ENV` | `app.listen` guard | |

`backend/.env.local` is generated by the Vercel CLI and excluded by `.gitignore` (`.env*`). Note that `new Stripe(process.env.STRIPE_SECRET_KEY)` runs at **module load**, so a missing key fails the whole function cold-start, not just the checkout route.

## What the backend does not do

- No authentication or authorization — every endpoint is public
- No rate limiting — review POST is open to automated submission
- No server-side validation beyond Mongoose `required` (e.g. `rating` isn't bounded to 1–5)
- No sanitisation of `comment` / `title` before storage
- No logging beyond `console.log` / `console.error`
- No health-check endpoint
