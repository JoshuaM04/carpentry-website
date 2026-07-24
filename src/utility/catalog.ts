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
        price: 715,
        activeColor: '',
        colors: ['no paint', 'olive', 'black', 'gray', 'blue'],
        colorTextStyles: ['text-orange-200', 'text-olive-500', 'text-black', 'text-gray-500', 'text-blue-900'],
        colorStyles: ['bg-orange-200', 'bg-olive-500', 'bg-black', 'bg-gray-500', 'bg-blue-900'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/tables/earth-wood/earth-wood-front.png',
        imageGallery: ['/furniture/catalog/tables/earth-wood/earth-wood-front.png', '/furniture/catalog/tables/earth-wood/earth-wood-side.png', '/furniture/catalog/tables/earth-wood/earth-wood-top.png'],
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
        price: 780,
        activeColor: '',
        colors: ['no paint', 'olive', 'black', 'gray', 'blue'],
        colorTextStyles: ['text-orange-200', 'text-olive-500', 'text-black', 'text-gray-500', 'text-blue-900'],
        colorStyles: ['bg-orange-200', 'bg-olive-500', 'bg-black', 'bg-gray-500', 'bg-blue-900'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/nightstands/hazy-night/hazy-night-front.png',
        imageGallery: ['/furniture/catalog/nightstands/hazy-night/hazy-night-front.png', '/furniture/catalog/nightstands/hazy-night/hazy-night-side.png', '/furniture/catalog/nightstands/hazy-night/hazy-night-top.png'],
        wood: 'Poplar',
        width: '24.5"',
        height: '31"',
        diameter: '16"'
    },
    {
        id: 'vatano',
        type: 'nightstand',
        route: '/Vatano',
        review: '/VatanoReview',
        reviewDB: 'vatano',
        name: 'Vatano',
        price: 300,
        activeColor: '',
        colors: ['no paint', 'olive', 'black', 'gray', 'blue'],
        colorTextStyles: ['text-orange-200', 'text-olive-500', 'text-black', 'text-gray-500', 'text-blue-900'],
        colorStyles: ['bg-orange-200', 'bg-olive-500', 'bg-black', 'bg-gray-500', 'bg-blue-900'],
        stripePriceId: 'N/A',
        image: '/furniture/catalog/nightstands/vatano/vatano-front.png',
        imageGallery: ['/furniture/catalog/nightstands/vatano/vatano-front.png', '/furniture/catalog/nightstands/vatano/vatano-side.png', '/furniture/catalog/nightstands/vatano/vatano-top.png'],
        wood: 'N/A',
        width: 'N/A',
        height: 'N/A',
        diameter: 'N/A'
    }
];