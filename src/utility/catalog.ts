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
        price: 500,
        activeColor: '',
        colors: ['no paint', 'olive', 'black', 'gray', 'blue'],
        colorTextStyles: ['text-orange-200', 'text-olive-500', 'text-black', 'text-gray-500', 'text-blue-900'],
        colorStyles: ['bg-orange-200', 'bg-olive-500', 'bg-black', 'bg-gray-500', 'bg-blue-900'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/tables/earth-wood.jpg',
        imageGallery: ['/furniture/catalog/tables/earth-wood.jpg', '/35d.jpg', '/36d.png'],
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
        activeColor: '',
        colors: ['no paint', 'olive', 'black', 'gray', 'blue'],
        colorTextStyles: ['text-orange-200', 'text-olive-500', 'text-black', 'text-gray-500', 'text-blue-900'],
        colorStyles: ['bg-orange-200', 'bg-olive-500', 'bg-black', 'bg-gray-500', 'bg-blue-900'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/nightstands/hazy-night.jpg',
        imageGallery: ['/furniture/catalog/nightstands/hazy-night.jpg', '/37d.png', '/38d.png'],
        wood: 'Poplar',
        width: '24.5"',
        height: '31"',
        diameter: '16"'
    }
];