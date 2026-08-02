# 04 — State Management Patterns

The recurring `useState` / `useEffect` idioms in this codebase. Recognising these four patterns lets you read any component in the repo quickly.

Related: [[03 - Component Network]] · [[12 - Coding Style Guide]]

---

## No global state, by design

There is no Context, no Redux, no Zustand, no React Query. State is either **local to a component** or **lifted to `App.tsx`**. For an app with nine routes and one shared concern (the cart), this is the right call — but it's the reason `addToCart` is threaded through two component layers.

---

## Pattern 1 — Lifting the cart to `App`

`App.tsx` owns the cart because two disconnected subtrees need it: product pages **write**, the `Cart` modal **reads**.

```tsx
const [cart, setCart] = useState<any[]>([]);
```

The write path is a single function passed down as a prop; the read path is the state itself:

```tsx
<Cart cart={cart} setCart={setCart} />
<Route path="/EarthWood" element={<EarthWood addToCart={addToCart} />} />
```

Note the asymmetry: `Cart` receives the raw `setCart` setter and implements its own `updateQuantity`, while product pages receive a pre-built `addToCart` closure. Two different levels of encapsulation for the same state.

### `addToCart` — the merge logic

```tsx
const addToCart = (product: any, selectedColor: string) => {
    setCart((prevCart) => {
      let finalColor = '';

      if (selectedColor === 'raw wood') {
        finalColor = selectedColor;
      } else {
        finalColor = selectedColor.substring(8);   // strips "stain - "
      }

      const uniqueCartId = `${product.id}-${finalColor}`;
      const existingItem = prevCart.find((item) => item.cartItemId === uniqueCartId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.cartItemId === uniqueCartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }

      return [...prevCart, { ...product, activeColor: finalColor, cartItemId: uniqueCartId, quantity: 1 }];
    });
};
```

Three things worth internalising:

**The functional updater is used consistently.** `setCart((prevCart) => ...)` never reads `cart` from the closure. This matters because add-to-cart can fire in quick succession — `React 19` batches updates, and reading stale closure state would drop increments.

**The composite key is the identity.** `cartItemId = "earth-wood-espresso"` means the same product in two stains occupies two cart lines. The catalog `id` alone would collapse them.

**`substring(8)` is positional string surgery.** The catalog stores `'stain - espresso'`; the eighth character onward is `'espresso'`. This depends entirely on the literal prefix `"stain - "` being exactly 8 characters. Flagged in [[15 - Known Gotchas and Tech Debt]].

Every update is immutable — spread for objects, `map`/`filter` for arrays, never mutation.

## Pattern 2 — State holding a CSS class name

The single most distinctive idiom in this codebase. Instead of a boolean plus a ternary, state stores the **Tailwind utility string itself**:

```tsx
const [messageVisbility, setMessageVisibility] = useState('hidden');
const [panelOne, setPanelOne] = useState('hidden');
const [panelOneIcon, setPanelOneIcon] = useState('/faq-plus-icon.svg');
```

Rendered by interpolation:

```tsx
<div id="panel-one" className={`${panelOne}`} aria-expanded={panelOne === 'block'}>
```

`About.tsx` scales this to five FAQ panels, each with a paired icon-path state — ten `useState` calls, plus a toggle written as a ternary of comma expressions:

```tsx
onClick={() => panelOne === 'hidden'
  ? ( setPanelOne('block'),  setPanelOneIcon('/faq-minus-icon.svg') )
  : ( setPanelOne('hidden'), setPanelOneIcon('/faq-plus-icon.svg') )}
```

`Navigation.tsx` uses the same shape with string `"true"`/`"false"` in a four-element array.

**Why it works:** the value goes straight into `className` with no mapping step, and Tailwind's scanner sees the literal `'hidden'` and `'block'` in the source, so both classes are generated.

**The cost:** the state type is `string`, so TypeScript can't catch a typo like `'blok'`; derived conditions must string-compare (`panelOne === 'block'`); and each panel needs two independent state variables that must be kept in sync. A boolean plus a derived class would be one variable and type-safe. See [[15 - Known Gotchas and Tech Debt]].

Also note the typo `messageVisbility` (missing `i`), which is consistent across all three files that use it — copied along with the pattern.

## Pattern 3 — The self-clearing toast

Duplicated verbatim in `Furniture.tsx`, `Reviews.tsx`, and `Contact.tsx`:

```tsx
const [messageVisbility, setMessageVisibility] = useState('hidden');
const [count, setCount] = useState(0);

useEffect(() => {
    console.log(count);
    const timer = setTimeout(() => { setMessageVisibility('hidden'); setCount(0) }, 5000);
    return () => { clearTimeout(timer); }
}, [count])
```

The mechanism is subtle and worth spelling out:

- Showing the toast does **two** things: `setMessageVisibility('block')` and `setCount(c => c + 1)`.
- `count` is the effect's dependency, so incrementing it **re-runs the effect**.
- The cleanup `clearTimeout` kills the previous 5-second timer before the new one starts.

So `count` is not really a counter — it's a **restart token**. Rapid add-to-cart clicks keep pushing the dismissal 5 seconds into the future instead of letting the first timer close the toast early. Cleanup-on-rerun is exactly the right tool here.

`count` does double duty in `Furniture.tsx`, where it's also displayed as the number of items just added:

```tsx
<div className="absolute top-118 left-33 ...">{count}</div>
```

And it drives the progress bar by forcing a remount, so the CSS animation replays from 0%:

```tsx
<div key={count} className={`... animate-timer-message`}></div>
```

Changing `key` is a deliberate remount — the standard React trick for restarting a CSS animation. The `--animate-timer-message` token is defined in [[10 - Tailwind Design System]].

## Pattern 4 — Fetch on mount

Two variants coexist, `async/await` and `.then()` chains:

```tsx
// Furniture.tsx — async/await inside useEffect
useEffect(() => {
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/${product.reviewDB}`);
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            console.error("Failed to pull reviews:", err);
        }
    };
    fetchReviews();
}, []);
```

```tsx
// FurnitureCard.tsx — promise chain, with a guard and a real dependency
useEffect(() => {
    if (!product?.reviewDB) return;

    fetch(`/api/reviews/${product?.reviewDB}`)
    .then(response => response.json())
    .then(responseData => { setData(responseData); })
    .catch(error => { console.error("Error fetching reviews:", error); });
}, [product?.reviewDB]);
```

The async function is declared **inside** the effect and called immediately — correct, since an effect callback must not itself be `async` (it would return a Promise where React expects a cleanup function).

Differences to note: `Furniture` uses `[]` while `FurnitureCard` uses `[product?.reviewDB]`. In practice `Furniture` is remounted per route so `[]` works today, but the dependency array is technically incomplete — `product.reviewDB` is read inside. `FurnitureCard`'s version is the more defensible one.

Neither has a loading or error state in the UI; failures land in `console.error` and the list simply stays empty.

## Pattern 5 — Controlled forms

Every input is fully controlled, one `useState` per field, no form library:

```tsx
const [title, setTitle]       = useState("");
const [comment, setComment]   = useState("");
const [username, setUsername] = useState("");
const [email, setEmail]       = useState("");
```

```tsx
<input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="border p-2" type="text" />
```

Resetting after a successful submit is a manual sweep of every setter:

```tsx
if (response.ok) {
    setTitle(""); setComment(""); setUsername("");
    setImageUpload("No file chosen"); setVideoUpload("No file chosen");
    setEmail(""); setActiveRating(0);
    setSelectedImageFile(null); setSelectedVideoFile(null);
}
```

`Reviews.tsx` carries **eleven** state variables this way. A single object in state, or `useReducer`, would collapse both the declarations and the reset — but the flat version is trivially readable, which is the trade that was made.

## State inventory

| Component | State vars | Purpose |
|---|---|---|
| `App` | 1 | cart array (lifted) |
| `Navigation` | 1 | hover flags (string array) |
| `Cart` | 0 | fully controlled by props + React Aria |
| `Furniture` | 5 | reviews, activeColor, toast visibility, count, activeButton |
| `FurnitureCard` | 1 | fetched reviews (for average) |
| `Reviews` | 11 | form fields, rating, file handles, toast |
| `Contact` | 7 | form fields, toast, image name |
| `About` | 10 | five FAQ panels × (visibility + icon) |
| `Home`, `Gallery`, `Footer`, product pages | 0 | pure |
