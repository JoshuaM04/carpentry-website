import { DialogTrigger, Modal, Dialog, Heading, Button } from 'react-aria-components/Modal';

interface CartProps {
    cart: any[];
    setCart: React.Dispatch<React.SetStateAction<any[]>>;
}

/* Stain name → swatch class. A lookup keeps the class names literal so
   Tailwind can see them at build time. */
const SWATCH_STYLES: Record<string, string> = {
    'raw wood': 'bg-raw-500',
    'espresso': 'bg-espresso-500',
    'olive': 'bg-olive-500',
    'gray': 'bg-gray-500'
};

export default function cart({ cart, setCart }: CartProps) {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    const handleCheckout = async () => {
        try {
            const productionUrl = 'https://woodwork-creations.com/';
            const baseUrl = window.location.hostname === 'localhost' ? '' : productionUrl;

            /* Send only what the server cannot know: which product, which
               finish, how many. Price, display name, and image are resolved
               server-side from the catalog so the client cannot set them. */
            const localCart = cart.map((item) => ({
                id: item.id,
                activeColor: item.activeColor,
                quantity: item.quantity
            }));

            const response = await fetch(`${baseUrl}/api/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: localCart }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("Failed to retrieve a valid payment session URL.");
            }
        } catch (error) {
            console.error("Checkout redirection error:", error);
        }
    }

    const updateQuantity = (cartItemId: string, amount: number) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + amount }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
    };

    return (
        <div id="cart" className="flex items-center">
            <DialogTrigger>
                <Button aria-label="Cart modal display" className="flex items-center gap-2 relative hover:cursor-pointer">
                    <svg className="fill-bone-50 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.25 18.75C11.25 19.58 10.58 20.25 9.75 20.25C8.92 20.25 8.25 19.58 8.25 18.75C8.25 17.92 8.92 17.25 9.75 17.25C10.58 17.25 11.25 17.92 11.25 18.75ZM16.25 17.25C15.42 17.25 14.75 17.92 14.75 18.75C14.75 19.58 15.42 20.25 16.25 20.25C17.08 20.25 17.75 19.58 17.75 18.75C17.75 17.92 17.08 17.25 16.25 17.25ZM20.73 7.68L18.73 15.68C18.65 16.01 18.35 16.25 18 16.25H8C7.64 16.25 7.33 15.99 7.26 15.63L5.37 5.25H4C3.59 5.25 3.25 4.91 3.25 4.5C3.25 4.09 3.59 3.75 4 3.75H6C6.36 3.75 6.67 4.01 6.74 4.37L7.17 6.75H20C20.23 6.75 20.45 6.86 20.59 7.04C20.73 7.22 20.78 7.46 20.73 7.68ZM19.04 8.25H7.44L8.62 14.75H17.41L19.04 8.25Z"></path></svg>

                    <span className={`${itemCount === 0 ? 'hidden' : 'flex'} justify-center items-center text-bark-900 bg-bone-50 text-[0.625rem] font-semibold size-4 -top-1 -right-2 absolute`}>{itemCount}</span>
                </Button>

                <Modal className="modal-display fixed left-[50%] top-[50%] translate-[-50%] text-bone-50 backdrop-blur-sm w-full h-full font-sans z-40 max-lg:bg-bark-950 lg:flex lg:justify-end">
                    <Dialog className="modal-pop-up flex flex-col justify-between bg-bark-950 h-full outline-none max-lg:w-full lg:w-[34rem] lg:drop-shadow-2xl">
                        <div className="flex flex-col gap-6 border-b border-bone-50/15 p-8">
                            <div className="flex justify-between items-center">
                                <p className="eyebrow text-clay-400">Order summary</p>

                                <Button aria-label="Close cart modal display" className="hover:cursor-pointer" slot="close">
                                    <svg className="stroke-bone-50 w-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7 17L16.8995 7.10051" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7 7.00001L16.8995 16.8995" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                </Button>
                            </div>

                            <Heading className="display display-lg">Your cart <span className="text-clay-400">({itemCount})</span></Heading>
                        </div>

                        {cart.length === 0 ? (
                            <div className="flex flex-col gap-4 flex-1 p-8">
                                <p className="text-clay-400 text-sm">Your cart is empty.</p>
                            </div>
                        ) : (
                            <div className="cart-items-container scroll-slim flex flex-col flex-1 p-8 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.cartItemId} className="flex justify-between gap-6 border-b border-bone-50/10 pb-6 mb-6 last:border-0 last:mb-0 max-sm:flex-col">
                                        <div className="flex gap-5">
                                            <div className="img-frame bg-bark-800 w-28 h-28 shrink-0"><img className="w-full h-full object-cover" src={item.image} alt={item.name} /></div>

                                            <div className="flex flex-col justify-between gap-3">
                                                <div className="flex flex-col gap-2">
                                                    <p className="display display-md">{item.name}</p>

                                                    <div className="flex items-center gap-2">
                                                        <span className={`${SWATCH_STYLES[item.activeColor] ?? 'bg-bone-300'} border border-bone-50/25 w-6 h-3`}></span>
                                                        <span className="micro text-clay-400 capitalize">{item.activeColor}</span>
                                                    </div>
                                                </div>

                                                <p className="micro">${item.price}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="flex items-center border border-bone-50/25">
                                                <button onClick={() => updateQuantity(item.cartItemId, -1)} aria-label={`Remove one ${item.name}`} className="flex justify-center items-center size-9 hover:bg-bone-50/10 hover:cursor-pointer"><svg className="fill-bone-50 w-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1 10L1 6L15 6V10L1 10Z"></path></svg></button>
                                                <div className="flex justify-center items-center micro select-none w-9">{item.quantity}</div>
                                                <button onClick={() => updateQuantity(item.cartItemId, 1)} aria-label={`Add one ${item.name}`} className="flex justify-center items-center size-9 hover:bg-bone-50/10 hover:cursor-pointer"><svg className="fill-bone-50 w-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z"></path></svg></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-5 border-t border-bone-50/15 p-8">
                            <div className="flex justify-between items-baseline">
                                <p className="eyebrow text-clay-400">Subtotal</p>
                                <p className="display display-md">${cart.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
                            </div>

                            <p className="micro text-clay-400">Local pickup in San Marcos — no shipping charges at checkout.</p>

                            <button onClick={handleCheckout} disabled={cart.length === 0} className="btn btn-light justify-center w-full">Checkout</button>
                        </div>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}
