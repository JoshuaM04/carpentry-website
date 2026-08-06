/* Server-side authority for anything the checkout charges money for.
 *
 * The client sends only an id, a finish, and a quantity. Price, display name,
 * and image are resolved here so a crafted request cannot set its own price.
 *
 * Keep in sync with src/utility/catalog.ts, which owns everything the client
 * renders. Only the fields Stripe needs live here. */

const SITE_ORIGIN = 'https://woodwork-creations.com';

/* Finishes a line item may be ordered in. Anything else is rejected, so the
 * value can be trusted in the Stripe product name. */
export const ALLOWED_FINISHES = ['raw wood', 'espresso', 'olive', 'gray'];

export const MAX_QUANTITY_PER_ITEM = 99;

const CATALOG = {
    'earth-wood': {
        name: 'Earth Wood',
        price: 400,
        image: '/furniture/catalog/tables/earth-wood/earth-wood-front.png'
    },
    'hazy-night': {
        name: 'Hazy Night',
        price: 535,
        image: '/furniture/catalog/nightstands/hazy-night/hazy-night-front.png'
    }
};

export const getProduct = (id) => {
    if (typeof id !== 'string') return null;

    /* hasOwn, not a truthiness check — a plain object inherits '__proto__',
       'constructor', and 'toString', and any of those would otherwise look
       like a hit and return a product with no price. */
    if (!Object.hasOwn(CATALOG, id)) return null;

    const product = CATALOG[id];

    return { ...product, imageUrl: `${SITE_ORIGIN}${product.image}` };
};
