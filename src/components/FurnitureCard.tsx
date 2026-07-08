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
    const [data, setData] = useState<Review[] | null>(null);

    useEffect(() => {
        fetch(`/api/reviews/${product.reviewDB}`) 
        .then(response => response.json())
        .then(responseData => {
            setData(responseData);
        })
        .catch(error => {
            console.error("Error fetching reviews:", error);
        });
    }, []); 

    if (!data || data.length === 0) return <p>No reviews yet</p>;

    const totalRatingSum = data.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRatingSum / data.length;

    return (
        <div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
            <Link to={product.route} className="flex flex-col gap-5 w-50 h-fit">
                <img className="size-50" src={product.image} alt={product.name} />

                <div className="flex flex-col gap-5">
                        <div>
                            <p className="font-semibold">{product.name}</p>
                            <div>
                                <p>{averageRating.toFixed(1)} / 5.0</p>
                            </div>
                        </div>
                    
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