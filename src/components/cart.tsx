import { DialogTrigger, Modal, Dialog, Heading, Button } from 'react-aria-components/Modal';
import { useLocation } from 'react-router-dom';

interface cartProps {
    inCart: number;
    inCartPrice: number;
    handleCartDecrement: Function;
    handleCartIncrement: Function;
}

export default function cart({inCart, inCartPrice, handleCartDecrement, handleCartIncrement}: cartProps) {
    const location = useLocation();

    const isHomePage = location.pathname === '/' || location.pathname === '/home'
    const spacingStyle = isHomePage ? 'max-2md:mt-380 mt-380 p-10' : 'max-2md:mt-40 mt-30 p-10';

    return (
        <div id="cart" className={`cart-component flex justify-end items-center gap-5 ${spacingStyle} absolute w-full`}>
            <DialogTrigger>
                <Button className="hover:cursor-pointer">
                    <svg className="fill-black w-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.25 18.75C11.25 19.58 10.58 20.25 9.75 20.25C8.92 20.25 8.25 19.58 8.25 18.75C8.25 17.92 8.92 17.25 9.75 17.25C10.58 17.25 11.25 17.92 11.25 18.75ZM16.25 17.25C15.42 17.25 14.75 17.92 14.75 18.75C14.75 19.58 15.42 20.25 16.25 20.25C17.08 20.25 17.75 19.58 17.75 18.75C17.75 17.92 17.08 17.25 16.25 17.25ZM20.73 7.68L18.73 15.68C18.65 16.01 18.35 16.25 18 16.25H8C7.64 16.25 7.33 15.99 7.26 15.63L5.37 5.25H4C3.59 5.25 3.25 4.91 3.25 4.5C3.25 4.09 3.59 3.75 4 3.75H6C6.36 3.75 6.67 4.01 6.74 4.37L7.17 6.75H20C20.23 6.75 20.45 6.86 20.59 7.04C20.73 7.22 20.78 7.46 20.73 7.68ZM19.04 8.25H7.44L8.62 14.75H17.41L19.04 8.25Z"></path></g></svg>
                    <div className={` ${inCart === 0 ? 'hidden aria-hidden' : 'block'} text-white text-xs flex justify-center items-center bg-black rounded-[50%] w-6 p-1 absolute bottom-9 right-15`}>{inCart}</div>
                </Button>

                <Modal className=" z-2 text-white flex justify-center items-center fixed left-[50%] top-[50%] translate-[-50%] backdrop-blur-sm w-full h-full p-10 font-roboto">
                    <Dialog className="modal-pop-up flex flex-col justify-between bg-black drop-shadow-xl/50 h-200 w-180 p-10 max-lg:h-180">
                        <div className="flex flex-col gap-10">
                            <div className="flex flex-col max-lg:gap-5">
                                <div className="flex justify-end max-lg:-ml-5 max-lg:-mr-5">
                                    <Button className="hover:cursor-pointer" slot="close">
                                        <svg className="stroke-white w-10 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7 17L16.8995 7.10051" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 7.00001L16.8995 16.8995" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                                    </Button>
                                </div>

                                <Heading className="text-2xl font-bold text-center border-b pb-5 -ml-10 -mr-10">Order Summary</Heading>
                            </div>

                            <div className={`flex justify-between max-lg:flex-col max-lg:items-center max-lg:gap-5 ${inCart === 0 ? 'hidden aria-hidden' : 'block'} `}>
                                <div className="flex gap-5 max-lg:justify-center max-lg:flex-col">
                                    <div className="w-40"><img src="/furniture/catalog/tables/furnitureOne.webp" alt="" /></div>
                                    
                                    <div className="flex flex-col justify-between max-lg:flex-row">
                                        <p>Table One</p>
                                        <p className="font-semibold">${inCartPrice}</p>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-black flex gap-4 max-lg:justify-center max-lg:w-40">
                                        <button onClick={() => handleCartDecrement(inCart)} className="hover:cursor-pointer"><svg className="fill-white w-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 10L1 6L15 6V10L1 10Z"></path> </g></svg></button>
                                        <div className="flex justify-center items-center bg-white pl-4 pr-4 select-none w-10">{inCart}</div>
                                        <button onClick={() => handleCartIncrement(inCart)} className="hover:cursor-pointer"><svg className="fill-white w-5" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z"></path> </g></svg></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 border-t -ml-10 -mr-10 pl-10 pr-10 pt-5">
                            <div className="flex justify-between">
                                <p>Subtotal</p>
                                <p>${inCartPrice}</p>
                            </div>

                            <div className="flex justify-between">
                                <p>Tax</p>
                                <p>N/A</p>
                            </div>
                        </div>
                    </Dialog>
                </Modal>
            </DialogTrigger>
        </div>
    );
}