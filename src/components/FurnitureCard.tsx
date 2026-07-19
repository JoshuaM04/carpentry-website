import { type Product } from '../utility/catalog'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Review {
  title: string;
  rating: number;
  comment: string;
  username: string;
  email: string;
}

interface FurnitureCardProps {
    product: Product;
}

export default function FurnitureCard({ product }: FurnitureCardProps) {
    const [data, setData] = useState<Review[]>([]);
    const colors  = [...product.colors];
    const colorTextStyles = [...product.colorTextStyles];
    const colorStyles = [...product.colorStyles];

    useEffect(() => {
        if (!product?.reviewDB) return;
        
        fetch(`/api/reviews/${product?.reviewDB}`) 
        .then(response => response.json())
        .then(responseData => {
            setData(responseData);
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });
    }, [product?.reviewDB]); 

    const totalRatingSum = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatingSum / data.length;

    return (
        <div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
            <Link to={product.route} className="flex flex-col gap-5 w-50 h-fit shadow-xl/30 bg-linear-to-br from-white to-olive-300">
                <img className="h-50" src={product.image} alt={product.name} />

                <div className="flex flex-col gap-5 p-5 -mt-5">
                    <div>
                        <p className="text-lg font-semibold">{product.name}</p>
                        <p>${product.price}</p>
                    </div>
                
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            {
                                colors.map((item, index) => (
                                    <div key={index} className={`${colorTextStyles[index]} ${colorStyles[index]} text-[1px] w-10 h-5 hover:cursor-pointer select-none`}>{item}</div>
                                ))
                            }
                        </div>

                        <p className="text-xs">{product.colors.length} color options</p>
                    </div>

                    <div>
                        <p className={`${data.length === 0 ? 'hidden' : 'block'}`}>{averageRating.toFixed(1)} / 5.0</p>
                        <p className={`${data.length === 0 ? 'block' : 'hidden'}`}>No reviews yet</p>
                    </div>
                    <p className="text-xs italic">Approximately <span className="font-bold">7 days</span> completion</p>
                </div>
            </Link>
        </div>
    );
}