import Furniture from '../../../components/Furniture';
import Footer from '../../../components/Footer';
import type { Product } from '../../../utility/catalog';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

interface EarthWoodProps {
    addToCart: (product: Product, selectedColor: string) => void;
}

export default function EarthWood({ addToCart }: EarthWoodProps) {
    const item = FURNITURE_CATALOG.find((product) => product.id === 'earth-wood')

    if (!item) return <p className="p-6">Product not found</p>;

    return (
        <div className="table-one-container flex flex-col min-h-dvh w-full">
            <Furniture
                product={item}
                addToCart={addToCart}
            />

            <Footer />
        </div>
    );
}
