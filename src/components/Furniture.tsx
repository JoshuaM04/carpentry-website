import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Product } from '../utility/catalog';
import SectionHeading from './SectionHeading';

/* Mirrors what GET /api/reviews/:productKey actually returns — the reviewer's
   email is stored but never served, so it is absent here. */
interface ReviewType {
    _id: string;
    title: string;
    rating: number;
    comment: string;
    username: string;
    imageUpload: string;
    videoUpload: string;
    timestamp: string;
}

/* Keeps a stored rating inside the range the star row can render. */
const clampStars = (rating: number) => Math.max(0, Math.min(5, Math.round(rating) || 0));

interface FurnitureProps {
    product: Product;
    addToCart: (product: Product, selectedColor: string) => void;
}

export default function Furniture({ product, addToCart }: FurnitureProps) {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [activeColor, setActiveColor] = useState('');
    const colors  = [...product.colors];
    const colorStyles = [...product.colorStyles];
    const [messageVisbility, setMessageVisibility] = useState('hidden');
    const [count, setCount] = useState(0);
    const imageGallery = [...product.imageGallery];
    const [activeButton, setActiveButton] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(`/api/reviews/${product.reviewDB}`);
                const data: unknown = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data && typeof data === 'object' && 'error' in data
                            ? String(data.error)
                            : 'Could not load reviews.'
                    );
                }

                setReviews(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to pull reviews:", err);
            }
        };

        fetchReviews();
    }, [product.reviewDB]);

    const showMessage = () => {
        setMessageVisibility('block');
        setCount((prevIndex) => prevIndex + 1);
    }

    useEffect(() => {
        const timer = setTimeout(() => { setMessageVisibility('hidden'); setCount(0) }, 5000);

        return () => {
            clearTimeout(timer);
        }
    }, [count])

    const averageRating = reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return (
        <main className="furniture-component flex flex-col">
            <section className="flex flex-col gap-10 border-b border-bark-900/15 px-6 pt-(--header-h) pb-24 max-2md:pb-16">
                <div className="flex items-center gap-3 eyebrow text-stone-500 pt-10">
                    <Link to="/home" className="link-underline">Catalog</Link>
                    <span>/</span>
                    <span className="capitalize">{product.type}s</span>
                    <span>/</span>
                    <span className="text-bark-900">{product.name}</span>
                </div>

                <div className="grid grid-cols-[1.15fr_1fr] gap-16 w-full max-2md:grid-cols-1 max-2md:gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="img-container img-frame flex gap-10 w-full overflow-hidden">
                            {
                                imageGallery.map((item, index) => (
                                    <img
                                        key={index}
                                        className="animated-gallery aspect-[4/3] w-full object-cover shrink-0"
                                        style={{'--animation-duration': `0.7s`, '--galleryPosition': `${activeButton}`} as React.CSSProperties}
                                        src={item}
                                        alt={`${product.name} — view ${index + 1}`}
                                    />
                                ))
                            }
                        </div>

                        <div className="flex justify-between items-center gap-4">
                            <div className="flex gap-2">
                                {
                                    imageGallery.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveButton(index)}
                                            aria-label={`Show image ${index + 1}`}
                                            className={`${activeButton === index ? 'bg-bark-900' : 'bg-bark-900/25'} w-10 h-0.5 hover:cursor-pointer`}
                                        ></button>
                                    ))
                                }
                            </div>

                            <p className="micro text-stone-500">0{activeButton + 1} / 0{imageGallery.length}</p>
                        </div>
                    </div>

                    <div className="product-information-container flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <p className="eyebrow text-stone-500 capitalize">{product.type} · {product.wood}</p>

                            <h1 className="display display-xl">{product.name}</h1>

                            <div className="flex items-center gap-4">
                                <p className="display display-md">${product.price}</p>

                                {
                                    reviews.length > 0 && (
                                        <p className="micro text-stone-500">{averageRating.toFixed(1)} / 5.0 · {reviews.length} review{reviews.length === 1 ? '' : 's'}</p>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex flex-col border-t border-bark-900/15">
                            <div className="flex justify-between items-center border-b border-bark-900/15 py-3">
                                <p className="eyebrow text-stone-500">Width</p>
                                <p className="micro">{product.width}</p>
                            </div>

                            <div className="flex justify-between items-center border-b border-bark-900/15 py-3">
                                <p className="eyebrow text-stone-500">Height</p>
                                <p className="micro">{product.height}</p>
                            </div>

                            <div className="flex justify-between items-center border-b border-bark-900/15 py-3">
                                <p className="eyebrow text-stone-500">Diameter</p>
                                <p className="micro">{product.diameter}</p>
                            </div>

                            <div className="flex justify-between items-center border-b border-bark-900/15 py-3">
                                <p className="eyebrow text-stone-500">Wood</p>
                                <p className="micro">{product.wood}</p>
                            </div>

                            <div className="flex justify-between items-center border-b border-bark-900/15 py-3">
                                <p className="eyebrow text-stone-500">Completion</p>
                                <p className="micro">Approximately 14 days</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h2 className="eyebrow text-stone-500">Finish</h2>
                                <p className="micro capitalize">{activeColor === '' ? 'Select a finish' : activeColor}</p>
                            </div>

                            <div className="grid grid-cols-4 gap-3 w-max max-xsm:grid-cols-2">
                                {
                                    colors.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveColor(item)}
                                            className={`${activeColor === item ? 'border-bark-900' : 'border-transparent'} flex flex-col gap-2 border-b-2 pb-2 hover:cursor-pointer`}
                                        >
                                            <span className={`${colorStyles[index]} block border border-bark-900/15 w-full h-10`}></span>
                                            <span className="micro text-stone-500 capitalize">{item}</span>
                                        </button>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between items-center bg-bone-200 px-4 py-3">
                                <p className="display display-md">${product.price}</p>
                                <p className="eyebrow text-stone-600">Free local pickup</p>
                            </div>

                            <button
                                onClick={() => { showMessage(); addToCart(product, activeColor) }}
                                disabled={activeColor === ''}
                                className="btn btn-solid justify-center w-full"
                            >
                                {activeColor === '' ? 'Select a finish first' : 'Add to cart'}
                            </button>

                            <div className={`${messageVisbility === 'hidden' ? 'hidden' : 'block'} w-fit mt-4`}>
                                <div className="flex items-center gap-3 bg-bark-900 text-bone-50 eyebrow px-4 h-9">
                                    <p>Added to cart</p>
                                    <span className="flex justify-center items-center bg-bone-50 text-bark-900 text-[0.625rem] font-semibold size-4">{count}</span>
                                </div>

                                <div key={count} className="bg-espresso-500 h-1 animate-timer-message"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-12 px-6 py-24 max-2md:py-16">
                <SectionHeading eyebrow={`${reviews.length} total`} left="Customer" right="Reviews." />

                <div className="reviews-container flex flex-col gap-10">
                    <Link className="btn btn-ghost w-fit" to={product.review}>Write a review</Link>

                    {
                        reviews.length === 0 ? (
                            <p className="text-sm text-stone-500">No reviews yet — be the first to write one.</p>
                        ) : (
                            <div className="flex flex-col">
                                {
                                    reviews.map((review) => (
                                        <div key={review._id} className="flex flex-col gap-4 border-t border-bark-900/15 py-8">
                                            <div className="flex flex-wrap justify-between items-baseline gap-4">
                                                {/* Clamped before it reaches repeat() — a negative count throws a
                                                    RangeError, which would unmount the whole page. The schema bounds
                                                    this too; this covers rows written before it did. */}
                                                <p className="text-sm tracking-[0.2em]">{'★'.repeat(clampStars(review.rating))}<span className="text-bark-900/25">{'★'.repeat(5 - clampStars(review.rating))}</span></p>
                                                <p className="micro text-stone-500">{new Date(review.timestamp).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex flex-col gap-2 max-w-3xl">
                                                <h3 className="display display-md">{review.title}</h3>
                                                <p className="text-base leading-relaxed text-stone-600">{review.comment}</p>
                                                <p className="micro text-stone-500">By <span className="text-bark-900">{review.username}</span></p>
                                            </div>

                                            <div className="media-upload-container flex flex-wrap gap-4">
                                                {
                                                    review.imageUpload ? (
                                                        <div className="img-frame w-80 max-w-full"><img src={review.imageUpload} alt={product.name} className="w-full h-full object-cover" /></div>
                                                    ) : null
                                                }

                                                {
                                                    review.videoUpload ? (
                                                        <video src={review.videoUpload} controls className="w-80 max-w-full" />
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </section>
        </main>
    )
}
