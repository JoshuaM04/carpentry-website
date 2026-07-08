export interface Product {
    id: string;
    type: string;
    route: string;
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
        name: 'Earth Wood',
        price: 500,
        stripePriceId: 'N/A',
        image: '../../furniture/catalog/tables/tableOne.jpg',
        wood: 'Oak',
        width: '36"',
        height: '25"',
        diameter: '14"'
    },
    {
        id: 'hazy-night',
        type: 'nightstand',
        route: '/HazyNight',
        name: 'Hazy Night',
        price: 500,
        stripePriceId: 'N/A',
        image: '../../furniture/catalog/nightstands/nightstandOne.jpg',
        wood: 'Poplar',
        width: '24.5"',
        height: '31"',
        diameter: '16"'
    }
];