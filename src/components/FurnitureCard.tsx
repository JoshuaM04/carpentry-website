import { type Product } from '../utility/catalog'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

/* The reviewer's email is stored but never served — see the projection on
   GET /api/reviews/:productKey. */
interface Review {
  title: string;
  rating: number;
  comment: string;
  username: string;
}

interface FurnitureCardProps {
    product: Product;
}

export default function FurnitureCard({ product }: FurnitureCardProps) {
    const [data, setData] = useState<Review[]>([]);
    const colors  = [...product.colors];
    const colorStyles = [...product.colorStyles];

    useEffect(() => {
        if (!product?.reviewDB) return;

        fetch(`/api/reviews/${product?.reviewDB}`)
        .then(async response => {
            const responseData: unknown = await response.json();

            if (!response.ok) {
                throw new Error(
                    responseData && typeof responseData === 'object' && 'error' in responseData
                        ? String(responseData.error)
                        : 'Could not load reviews.'
                );
            }

            return responseData;
        })
        .then(responseData => {
            setData(Array.isArray(responseData) ? responseData : []);
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });
    }, [product?.reviewDB]);

    const totalRatingSum = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = data.length === 0 ? 0 : totalRatingSum / data.length;

    return (
        <Link to={product.route} className="furniture-card flex flex-col gap-4 w-full">
            <div className="img-frame aspect-[4/3] w-full relative">
                <img className="w-full h-full object-cover" src={product.image} alt={product.name} />

                <span className="eyebrow text-bone-50 bg-bark-900/80 px-2 py-1 top-3 left-3 absolute capitalize">{product.type}</span>
            </div>

            <div className="flex justify-between items-start gap-4 border-t border-bark-900/15 pt-4">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <p className="display display-md">{product.name}</p>
                        <p className="micro text-stone-500">{product.wood} · {product.width} × {product.height}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {
                                colors.map((item, index) => (
                                    <span key={index} className={`${colorStyles[index]} border border-bark-900/15 w-5 h-2.5`}>
                                        <span className="sr-only">{item}</span>
                                    </span>
                                ))
                            }
                        </div>

                        <p className="micro text-stone-500">{product.colors.length} finishes</p>
                    </div>

                    <p className="micro text-stone-500">
                        {data.length === 0 ? 'No reviews yet' : `${averageRating.toFixed(1)} / 5.0 · ${data.length} review${data.length === 1 ? '' : 's'}`}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="display display-md">${product.price}</p>
                    <p className="micro text-stone-500">~14 days</p>
                </div>
            </div>
        </Link>
    );
}
