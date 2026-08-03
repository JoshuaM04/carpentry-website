export interface Product {
    id: string;
    type: string;
    route: string;
    review: string;
    reviewDB: string;
    name: string;
    price: number;
    activeColor: string;
    colors: Array<string>;
    colorTextStyles: Array<string>;
    colorStyles: Array<string>;
    stripePriceId: string;
    image: string;
    imageGallery: Array<string>;
    wood: string;
    width: string;
    height: string;
    diameter: string;
}

export const FURNITURE_CATALOG: Product[] = [
    {
        id: 'earth-wood',
        type: 'table',
        route: '/EarthWood',
        review: '/EarthWoodReview',
        reviewDB: 'earth-wood',
        name: 'Earth Wood',
        price: 400,
        activeColor: '',
        colors: ['raw wood', 'stain - espresso', 'stain - olive', 'stain - gray'],
        colorTextStyles: ['text-raw-500', 'text-espresso-500', 'text-olive-500', 'text-gray-500'],
        colorStyles: ['bg-raw-500', 'bg-espresso-500', 'bg-olive-500', 'bg-gray-500'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/tables/earth-wood/earth-wood-front.png',
        imageGallery: ['/furniture/catalog/tables/earth-wood/earth-wood-front.png', '/furniture/catalog/tables/earth-wood/earth-wood-side.png', '/furniture/catalog/tables/earth-wood/earth-wood-top.png'],
        wood: 'Poplar',
        width: '36"',
        height: '25"',
        diameter: '14"'
    },
    {
        id: 'hazy-night',
        type: 'nightstand',
        route: '/HazyNight',
        review: '/HazyNightReview',
        reviewDB: 'hazy-night',
        name: 'Hazy Night',
        price: 535,
        activeColor: '',
        colors: ['raw wood', 'stain - espresso', 'stain - olive', 'stain - gray'],
        colorTextStyles: ['text-raw-500', 'text-espresso-500', 'text-olive-500', 'text-gray-500'],
        colorStyles: ['bg-raw-500', 'bg-espresso-500', 'bg-olive-500', 'bg-gray-500'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/nightstands/hazy-night/hazy-night-front.png',
        imageGallery: ['/furniture/catalog/nightstands/hazy-night/hazy-night-front.png', '/furniture/catalog/nightstands/hazy-night/hazy-night-side.png', '/furniture/catalog/nightstands/hazy-night/hazy-night-top.png'],
        wood: 'Poplar & Pine',
        width: '24.5"',
        height: '31"',
        diameter: '16"'
    }
];