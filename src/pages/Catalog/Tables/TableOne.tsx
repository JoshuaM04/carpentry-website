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
        <main className="table-one-container min-h-dvh p-10">
            <div className="flex flex-col gap-10 mt-80">
                <div className="grid grid-cols-[1fr_400px] gap-10 max-2md:flex max-2md:flex-col">
                    <div className="img-container">
                        <img src="/furniture/catalog/tables/furnitureOne.webp" alt="" />
                    </div>

                    <div className="product-information-container flex flex-col gap-2">
                        <div>
                            <h2 className="text-2xl">Table One</h2>
                            <p>$500</p>
                        </div>

                        <hr />

                        <div>
                            <p className="font-bold">Size</p>
                            <p>48w</p>
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
            </div>
        </main>
    );
}