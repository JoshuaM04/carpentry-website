import Furniture from '../../../components/Furniture';
import Footer from '../../../components/Footer';
import type { Product } from '../../../utility/catalog';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

interface HazyNightProps {
    addToCart: (product: Product, selectedColor: string) => void;
}

export default function HazyNight({ addToCart }: HazyNightProps) {
    const item = FURNITURE_CATALOG.find((product) => product.id === 'hazy-night')

    if (!item) return <p>Product not found</p>;

    return (
        <div className="flex flex-col justify-between items-center gap-20 min-h-dvh">
            <main className="table-one-container flex flex-col w-fit 2md:max-w-[2500px] gap-10 p-10 max-xsm:w-100">
                <Furniture
                    product={item}
                    addToCart={addToCart}
                />
            </main>

            <Footer />
        </div>
    );
}