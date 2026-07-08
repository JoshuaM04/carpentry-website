import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../utility/catalog';

interface ReviewType {
    _id: string;
    title: string;
    rating: number;
    comment: string;
    username: string;
    email: string;
    timestamp: string;
}

interface FurnitureProps {
    product: Product;
    // addToCart: (product: Product) => void;
}

export default function Furniture({ product }: FurnitureProps) {
    const [reviews, setReviews] = useState<ReviewType[]>([]);

    useEffect(() => { 
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/${product.reviewDB}`);
                const data = await response.json();
                setReviews(data);

                console.log("Data from Express backend:", data);
            } catch (err) {
                console.error("Failed to pull reviews:", err);
            }
        };

        fetchReviews();
    }, []);

    return (
        <main className="furniture-component flex flex-col gap-10">
            <section className="flex flex-col gap-10 mt-80">
                <div className="grid grid-cols-[35vw_1fr] gap-10 max-2md:flex max-2md:flex-col">
                   <div className="img-container">
                        <img src={product.image} alt={product.name} />
                   </div>

                    <div className="product-information-container flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl">{product.name}</h2>
                            <p>${product.price}</p>
                        </div>

                        <hr />

                        <div>
                            <p className="font-bold">Dimensions</p>
                            <p>{product.width} - Width</p>
                            <p>{product.height} - Height</p>
                            <p>{product.diameter} - Diameter</p>
                        </div>

                        <hr />

                        <div>
                            <p className="font-bold">Wood</p>
                            <p>{product.wood}</p>
                        </div>

                        <hr />

                        <div className="flex flex-col">
                            <div className="flex justify-between items-center bg-slate-100 -mt-2 p-2">
                                <p className="text-black text-lg">${product.price}</p>
                            </div>

                            <button className="font-semibold text-white bg-black p-2 hover:cursor-pointer">Add to cart</button>
                        </div>
                    </div>
                </div>
            </section>

            <hr />

            <section className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl">Reviews</h2>
                    <Link className="text-sm font-semibold text-white bg-black p-2 w-fit" to={product.review}>Write a Review</Link>
                </div>

                <div className="reviews-container flex flex-col gap-5">
                    <h2>Customer Reviews ({reviews.length})</h2>

                    <div className="flex flex-col gap-5">
                        {
                            reviews.map((review) => (
                                <div key={review._id} className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <p>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} ({review.rating}/5)</p>
                                        <p>By <span className="font-semibold">{review.username}</span></p>
                                    </div>
                                    <div className="flex justify-between">
                                        <h3>{review.title}</h3>
                                        <p>{new Date(review.timestamp).toLocaleDateString()}</p>
                                    </div>

                                    
                                    <div>
                                        <p className="font-semibold">Review</p>
                                        <p>{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </main>
    )
}