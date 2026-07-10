export interface Product {
    id: string;
    type: string;
    route: string;
    review: string;
    reviewDB: string;
    name: string;
    price: number;
    stripePriceId: string;
    image: string;
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
        price: 500,
        stripePriceId: 'N/A',
        image: '../../public/furniture/catalog/tables/earth-wood.jpg',
        wood: 'Oak',
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
        price: 500,
        stripePriceId: 'N/A',
        image: '../../public/furniture/catalog/nightstands/hazy-night.jpg',
        wood: 'Poplar',
        width: '24.5"',
        height: '31"',
        diameter: '16"'
    }
];