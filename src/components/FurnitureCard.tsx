import { type Product } from '../utility/catalog'
import { Link } from 'react-router-dom';

interface FurnitureCardProps {
    product: Product;
    addToCart: (product: Product) => void;
}

export default function FurnitureCard({ product, addToCart }: FurnitureCardProps) {
    return (
        <div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
            <Link to={product.route} className="flex flex-col gap-5 w-50 h-fit">
                <img className="size-50" src={product.image} alt={product.name} />

                <div className="flex flex-col gap-4">
                    <p className="font-semibold">{product.name}</p>

                    <div>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 bg-black"></div>
                            <div className="w-4 h-4 bg-red-900"></div>
                        </div>
                        <p className="text-xs">2 color options</p>
                    </div>

                    <p className="text-xs italic">Approximately <span className="font-bold">2 days</span> completion</p>
                </div>
            </Link>
        </div>
    );
}