import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../utility/catalog';

interface ReviewType {
    _id: string;
    title: string;
    rating: number;
    comment: string;
    username: string;
    imageUpload: string;
    videoUpload: string;
    email: string;
    timestamp: string;
}

interface FurnitureProps {
    product: Product;
    addToCart: (product: Product, selectedColor: string) => void;
}

export default function Furniture({ product, addToCart }: FurnitureProps) {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [activeColor, setActiveColor] = useState('');
    const colors  = [...product.colors];
    const colorTextStyles = [...product.colorTextStyles];
    const colorStyles = [...product.colorStyles];
    const [messageVisbility, setMessageVisibility] = useState('hidden');
    const [count, setCount] = useState(0);
    const imageGallery = [...product.imageGallery];
    const galleryButton = [0, 1, 2];
    const [activeButton, setActiveButton] = useState(0);
    const galleryPosition = [0, 1, 2];

    useEffect(() => { 
        console.log(imageGallery);

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

    const showMessage = () => {
        setMessageVisibility('block');
        setCount((prevIndex) => prevIndex + 1);
    }

    useEffect(() => {
        console.log(count);
        const timer = setTimeout(() => { setMessageVisibility('hidden'); setCount(0) }, 5000);

        return () => {
            clearTimeout(timer);
        }
    }, [count])

    return (
        <main className="furniture-component flex flex-col gap-10 max-2md:gap-5">
            <section className="flex flex-col gap-10 mt-80 w-full">
                <div className="grid grid-cols-[29vw_1fr] gap-10 2md:w-full max-2md:flex max-2md:flex-col">
                   <div className="flex flex-col items-center gap-5 max-w-189.25">
                       <div className="img-container flex gap-10 overflow-hidden">
                            {
                                imageGallery.map((item) => (
                                    <img className="animated-gallery" style={{'--animation-duration': `2s`, '--galleryPosition': `${galleryPosition[activeButton]}`} as React.CSSProperties} src={item} alt={product.name} />
                                ))
                            }
                       </div>

                       <div className="flex gap-2">
                            {
                                galleryButton.map((item, index) => (
                                    <button key={index} onClick={() => setActiveButton(item)} 
                                    aria-label="color-option"
                                    className={`${activeButton === item ? 'bg-black text-black' : 'bg-slate-300 text-slate-300'} w-4 h-4 rounded-[50%] text-[1px]`}>{item}</button>
                                ))
                            }
                       </div>
                   </div>

                    <div className="product-information-container flex flex-col gap-2 max-2md:min-h-132 relative">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl">{product.name}</h2>
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

                        <div className="flex flex-col gap-2 h-fit">
                            <h3 className="font-bold">Color</h3>

                            <div className="flex gap-2 overflow-x-scroll h-18.75 overflow-y-hidden">
                               {
                                    colors.map((item, index) => (
                                        <div className="flex flex-col gap-1">
                                            <div key={index} className={`h-9 ${activeColor === item ? 'border-b-2' : ''}`}>
                                                <div className={`${colorTextStyles[index]} ${colorStyles[index]} w-20 h-8 hover:cursor-pointer select-none`} key={index} onClick={() => { setActiveColor(item); console.log(item); }}>{item}</div>
                                            </div>
                                            
                                            <div className="text-xs font-semibold capitalize">{item}</div>
                                        </div>
                                    ))
                               }
                            </div>
                        </div>

                        <hr />

                        <div className="flex flex-col">
                            <div className="flex justify-between items-center bg-slate-100 p-2 -mt-2">
                                <p className="text-black text-lg">${product.price}</p>
                                <p className="font-light">$75 Shipping</p>
                            </div>

                            <button onClick={() => { showMessage(); addToCart(product, activeColor) }} className={`${activeColor === '' ? 'pointer-events-none select-none' : ''} font-semibold text-white bg-black p-2 hover:cursor-pointer`}>Add to cart</button>
                        </div>

                        <div className="h-10">
                            <div className={`${messageVisbility === 'hidden' ? 'hidden' : 'block'} font-semibold uppercase bg-green-100 p-2 w-fit mt-3`}>
                                <p>Added to cart</p>
                                <div className="absolute top-118 left-33 text-white text-xs flex justify-center items-center bg-black rounded-[50%] w-6 p-1">{count}</div>
                            </div>

                            <div key={count} className={`${messageVisbility === 'hidden' ? 'hidden' : 'block animate-timer-message'} bg-black h-1`}></div>
                        </div>
                    </div>
                </div>
            </section>

            <hr />

            <section className="flex flex-col gap-10 w-full">
                <div className="flex flex-col gap-2">
                    <Link className="text-sm font-semibold text-white bg-black p-2 w-fit" to={product.review}>Write a Review</Link>
                </div>

                <div className="reviews-container flex flex-col gap-5">
                    <h3 className="text-lg">Customer Reviews <span className="font-semibold">({reviews.length})</span></h3>

                    <div className="flex flex-col gap-5">
                        {
                            reviews.map((review) => (
                                <div key={review._id} className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                        <p>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} ({review.rating}/5)</p>
                                        <p>By <span className="font-semibold">{review.username}</span></p>
                                    </div>

                                    <div className="flex justify-between">
                                        <h3 className="font-semibold">{review.title}</h3>
                                        <p>{new Date(review.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    
                                    <p>{review.comment}</p>

                                    <div className="media-upload-container">
                                        {
                                            review.imageUpload === '' && review.videoUpload === '' ? (
                                                <div className="hidden"></div>
                                            ) : 
                                                review.imageUpload !== '' && review.videoUpload !== '' ? (
                                                    <div>
                                                        <img src={review.imageUpload} alt={product.name} className="w-100" />
                                                        <video src={review.videoUpload} controls className="max-w-100" />
                                                    </div>
                                                ) :
                                                    review.imageUpload ? (
                                                        <img src={review.imageUpload} alt={product.name} className="w-100" />
                                                    ) : (
                                                        <video src={review.videoUpload} controls className="w-100" />
                                                    )
                                        }
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