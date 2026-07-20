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
                                    <button key={index} onClick={() => setActiveButton(item)} className={`${activeButton === item ? 'bg-black text-black' : 'bg-slate-300 text-slate-300'} w-4 h-4 rounded-[50%] text-[1px]`}>{item}</button>
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
                            <div className="flex flex-wrap justify-center items-center gap-10 p-2 pt-4 pb-4 -mt-2">
                                <div className="flex flex-col items-center gap-2 w-fit">
                                    <svg className="size-10" fill="#000000" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>hand-saw</title> <path d="M26.831 2.149l-18.943 15.235-0.773-0.79-5.959 4.339c0.999 3.706 3.372 6.562 6.092 9.204l5.214-5.741-3.812-4.12 0.167-0.502 2.856 3.57 2.338-2.494 0.358-1.743 1.655-0.404 0.254-1.548 1.509-0.333 0.1-1.383 1.637-0.47 0.188-1.297 1.38-0.377 0.405-1.346 1.356-0.531 0.39-1.141 1.093-0.441 0.263-1.008 1.094-0.439 0.219-0.967 1.077-0.415 0.241-1.072 0.988-0.238 0.156-1.073 0.904-0.059 1.054-1.124-3.501-1.292zM9.837 24.4l-2.361 2.528c-0.305-2.501-1.401-4.417-3.606-5.514l1.987-1.342 3.979 4.328z"></path> </g></svg>
                                    <p className="text-sm font-light">Hand-Crafted</p>
                                </div>

                                <div className="flex flex-col items-center gap-2 w-fit">
                                    <svg className="size-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12,6.36c2,2.58,4,5.87,4,7.64a4,4,0,0,1-8,0c0-1.77,2-5.06,4-7.64M12,3.2S6,10,6,14a6,6,0,0,0,12,0c0-4-6-10.8-6-10.8Z"></path> <rect width="24" height="24" fill="none"></rect> </g></svg>
                                    <p className="text-sm font-light">Water Resistant</p>
                                </div>

                                <div className="flex flex-col items-center gap-2 w-fit">
                                    <svg className="size-10" fill="#000000" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 1.9205 50.6968 L 5.3687 54.1450 C 7.2673 56 9.4279 55.8472 11.3484 53.7303 L 34.1981 28.8511 C 35.1365 29.5058 36.0094 29.4840 37.0788 29.2658 L 39.4140 28.7856 L 40.9636 30.3351 L 40.8545 31.4918 C 40.7017 32.6921 41.0508 33.6087 42.1637 34.7217 L 43.9971 36.5331 C 45.1100 37.6679 46.5939 37.7334 47.6634 36.6640 L 54.9309 29.3967 C 56.0000 28.3273 55.9347 26.8651 54.8218 25.7303 L 52.9884 23.8971 C 51.8755 22.7840 50.9369 22.3912 49.7583 22.5658 L 48.5801 22.6967 L 47.0958 21.2127 L 47.7506 18.6593 C 48.0563 17.3936 47.7287 16.3678 46.3539 15.0147 L 40.9636 9.6461 C 33.0414 1.7677 22.8933 2.0077 15.9532 9.0132 C 14.9930 9.9734 14.9057 11.2829 15.5168 12.2431 C 16.0187 13.0724 17.0881 13.5744 18.5503 13.2034 C 21.9330 12.3522 25.3157 12.6141 28.6330 14.8620 L 27.2362 18.3975 C 26.7124 19.7069 26.7561 20.7762 27.2799 21.7583 L 2.3352 44.7171 C .2401 46.6594 0 48.7763 1.9205 50.6968 Z M 19.4233 9.8861 C 25.3812 5.4341 32.8013 6.1542 38.1700 11.5229 L 44.0404 17.3499 C 44.5643 17.8737 44.6300 18.2883 44.4771 18.9431 L 43.6480 22.4349 L 47.1615 25.9485 L 49.3002 25.7521 C 49.9331 25.6866 50.1293 25.7303 50.6531 26.2322 L 52.0284 27.6290 L 45.8957 33.7833 L 44.4990 32.3866 C 43.9971 31.8846 43.9533 31.6882 44.0190 31.0553 L 44.2152 28.8947 L 40.7236 25.4029 L 37.1006 26.1013 C 36.4677 26.2322 36.1404 26.2322 35.5948 25.6866 L 30.7499 20.8199 C 30.2261 20.2961 30.1606 19.9906 30.4443 19.2922 L 32.5831 14.1855 C 29.0040 10.7591 24.2682 8.8604 19.7070 10.3226 C 19.5106 10.3881 19.3796 10.3444 19.3142 10.2571 C 19.2487 10.1480 19.2487 10.0389 19.4233 9.8861 Z M 4.7576 49.1255 C 3.6446 48.0125 4.0374 47.3359 4.7794 46.6594 L 29.2877 24.0499 L 32.0156 26.7996 L 9.3406 51.2206 C 8.6641 51.9626 7.8130 52.1808 6.8964 51.2861 Z"></path></g></svg>
                                    <p className="text-sm font-light">Built To Last</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-slate-100 p-2 border-t">
                                <p className="text-black text-lg">${product.price}</p>
                                <p className="font-light">$75 Shipping</p>
                            </div>

                            <button onClick={() => { showMessage(); addToCart(product, activeColor) }} className={`${activeColor === '' ? 'pointer-events-none select-none' : ''} font-semibold text-white bg-black p-2 hover:cursor-pointer`}>Add to cart</button>
                        </div>

                        <div>
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