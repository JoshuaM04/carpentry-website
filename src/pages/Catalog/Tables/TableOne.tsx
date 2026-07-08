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


interface cartProps {
    quantity: number;
    price: number;
    count: number;
    handleDecrement: Function;
    handleIncrement: Function;
    handleCart: Function;
}

export default function TableOne({quantity, handleDecrement, handleIncrement, handleCart, count, price}: cartProps) {

    return (
        <main className="table-one-container flex flex-col gap-10 min-h-dvh p-10">
            <section className="flex flex-col gap-10 mt-80">
                <div className="grid grid-cols-[1fr_1fr] gap-10 max-2md:flex max-2md:flex-col">
                   <div className="img-container">
                        <img src="/furniture/catalog/tables/tableOne.jpg" alt="" />
                   </div>

                    <div className="product-information-container flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl">Table One</h2>
                            <p>$500</p>
                        </div>

                        <hr />

                        <div>
                            <p className="font-bold">Dimensions</p>
                            <p>36" - Width</p>
                            <p>25" - Height</p>
                            <p>14" - Diameter</p>
                        </div>

                        <hr />

                        <div>
                            <p className="font-bold">Wood</p>
                            <p>Oak</p>
                        </div>

                        <hr />

                        <div className="flex flex-col">
                            <div className="flex justify-between items-center bg-slate-100 -mt-2 p-2">
                                <p className="text-black text-lg">${price}</p>

                                <div className="flex gap-4">
                                    <button onClick={() => handleDecrement(quantity)} className="hover:cursor-pointer"><svg className="fill-black w-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 10L1 6L15 6V10L1 10Z"></path> </g></svg></button>
                                    <div className="flex justify-center items-center bg-white pl-4 pr-4 select-none w-10">{quantity}</div>
                                    <button onClick={() => handleIncrement(quantity)} className="hover:cursor-pointer"><svg className="fill-black w-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z"></path> </g></svg></button>
                                </div>
                            </div>

                            <button onClick={() => { handleCart(quantity); count++; }} className="font-semibold text-white bg-black p-2 hover:cursor-pointer">Add to cart</button>
                        </div>
                    </div>
                </div>
            </section>

            <hr />

            <section className="flex flex-col gap-10">
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl">Reviews</h2>
                    <Link className="text-sm font-semibold text-white bg-black p-2 w-fit" to="/TableOneReview">Write a Review</Link>
                </div>

                <ReviewsSection />
            </section>
        </main>
    );
}