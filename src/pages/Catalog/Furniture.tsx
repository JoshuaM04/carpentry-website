import { Link } from 'react-router-dom';
import type { Product } from '../../utility/catalog';

interface FurnitureProps {
    product: Product;
    addToCart: (product: Product) => void;
}

export default function Furniture({ product, addToCart }: FurnitureProps) {
    return (
        <main className="table-one-container flex flex-col gap-10 min-h-dvh p-10">
            <section className="flex flex-col gap-10 mt-80">
                <div className="grid grid-cols-[1fr_1fr] gap-10 max-2md:flex max-2md:flex-col">
                   <div className="img-container">
                        <img src={product.image} alt={product.name} />
                   </div>

                    <div className="product-information-container flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl">{product.name}</h2>
                            <p>{product.price}</p>
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

                            <button onClick={() => addToCart(product)} className="font-semibold text-white bg-black p-2 hover:cursor-pointer">Add to cart</button>
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
            </section>
        </main>
    )
}