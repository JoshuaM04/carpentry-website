import Furniture from '../../../components/Furniture';
import Footer from '../../../components/Footer';
import type { Product } from '../../../utility/catalog';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

interface HazyNightProps {
    addToCart: (product: Product) => void;
}

export default function HazyNight({ addToCart }: HazyNightProps) {
    const item = FURNITURE_CATALOG.find((product) => product.id === 'hazy-night')

    if (!item) return <p>Product not found</p>;

    return (
        <div className="flex flex-col justify-between gap-20 min-h-dvh">
            <main className="table-one-container flex flex-col gap-10 p-10">
                <Furniture
                    product={item}
                    addToCart={addToCart}
                />
            </main>

            <Footer />
        </div>
    );
}