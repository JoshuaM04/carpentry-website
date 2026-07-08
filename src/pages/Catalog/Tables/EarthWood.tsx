import Furniture from '../../../components/Furniture';
import { FURNITURE_CATALOG } from '../../../utility/catalog';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ReviewType {
    _id: string;
    title: string;
    rating: number;
    comment: string;
    username: string;
    email: string;
    timestamp: string;
}

function ReviewsSection() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);

    useEffect(() => { 
        const fetchReviews = async () => {
            try {
                const response = await fetch('/api/reviews');
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
        <div className="flex flex-col gap-5">
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
    );
}

export default function EarthWood() {

    return (
        <main className="table-one-container flex flex-col gap-10 min-h-dvh p-10">
            <Furniture 
                key={FURNITURE_CATALOG[0]["id"]}
                product={FURNITURE_CATALOG[0]}
            />
        </main>
    );
}