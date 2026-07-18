import Footer from'../components/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function About() {
    const gallery = ['/workStation1.png', '/workStation2.png', '/workStation3.png', '/workStation4.png'];
    const [panelOne, setPanelOne] = useState('hidden');
    const [panelOneIcon, setPanelOneIcon] = useState('/faq-plus-icon.svg');
    const [panelTwo, setPanelTwo] = useState('hidden');
    const [panelTwoIcon, setPanelTwoIcon] = useState('/faq-plus-icon.svg');
    const [panelThree, setPanelThree] = useState('hidden');
    const [panelThreeIcon, setPanelThreeIcon] = useState('/faq-plus-icon.svg');
    const [panelFour, setPanelFour] = useState('hidden');
    const [panelFourIcon, setPanelFourIcon] = useState('/faq-plus-icon.svg');


    return (
        <div className="about-container flex flex-col gap-20">
            <div className="flex flex-col items-center">
                <main className="flex flex-col gap-20 p-10 mt-60 w-[90vw] min-h-dvh">
                    <section className="flex flex-col gap-10">
                        <h2 className="text-3xl font-semibold">Creating hand-made furniture to last</h2>
                        <p className="font-light">
                            We are a family-business with our sights on quality and care pertaining to our products. We source our wood from Home Depot or Lowes and can order specific pieces from suppliers if a custom request is made for a furniture piece.
                            From the very start, we ensure communication is thorough when covering product details and at the very end we ensure that the product is properly delivered.
                        </p>

                        <p className="font-light">
                            We are based in Austin and are able to ship our products anywhere across the United States. We strive for excellence and we hope to expand our reach to other countries as well!
                        </p>
                        <Link to="/Home" className="text-sm font-semibold text-white bg-black pt-2 pb-2 pl-5 pr-6 w-fit h-fit hover:cursor-pointer">Explore our catalog</Link>
                    </section>

                    <section className="flex flex-col gap-10">
                        <h2 className="text-3xl font-semibold">A glimpse into the studio</h2>
                        <div className="flex gap-10 overflow-x-scroll">
                            {
                                gallery.map((item) => (
                                    <img className="max-lg:w-full max-2xl:w-(--gallery-item-sm) w-(--gallery-item)" src={item} />
                                ))
                            }
                        </div>
                    </section>
                    
                    <section className="flex flex-col gap-10">
                        <h2 className="text-3xl font-semibold">Our plans for the future</h2>
                        <p className="font-light">
                            The future of our company will pertain to expanding the catalog to include different furniture pieces that are common in different areas of someone's home. That could be a lawn chair, a coffee table, or even an island for your kitchen.
                        </p>
                    </section>

                    <section className="flex flex-col gap-10">
                        <h2 className="text-3xl font-semibold">Behind the scenes</h2>

                        <div className="flex flex-col 2xl:grid 2xl:grid-cols-[1fr_1fr] gap-10">
                            <video poster="/woodworkPoster.webp" controls>
                                <source src="woodWorkSample.mp4" type="video/mp4"></source>
                            </video>

                            <p className="font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae lectus ullamcorper, ullamcorper nunc eu, accumsan justo. Nullam egestas, augue quis faucibus scelerisque, leo purus consequat risus, ut tincidunt nulla orci eu nisi.</p>
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h3 className="text-xl font-semibold">Frequently asked questions</h3>

                        <div>
                            <div id="faq-panel-one" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Can I commission a custom-made furniture piece?</div>
                                    
                                    <button
                                        onClick={() => panelOne === 'hidden' ? ( setPanelOne('block'), setPanelOneIcon('/faq-minus-icon.svg') ) : ( setPanelOne('hidden'), setPanelOneIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                    >
                                        <img className="min-w-3" src={panelOneIcon} />
                                    </button>
                                </div>

                                <div className={`${panelOne}`}>
                                    <p className="font-light">Yes! You can visit the <Link to="/Contact" className="text-blue-500 underline">contact page</Link> and submit a request about commissioning a custom-made furniture piece.</p>
                                </div>
                            </div>

                            <div id="faq-panel-two" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Are the furniture pieces water proof?</div>

                                    <button
                                        onClick={() => panelTwo === 'hidden' ? ( setPanelTwo('block'), setPanelTwoIcon('/faq-minus-icon.svg') ) : ( setPanelTwo('hidden'), setPanelTwoIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                    >
                                        <img className="min-w-3" src={panelTwoIcon} />
                                    </button>
                                </div>

                                <div className={`${panelTwo}`}>
                                    <p className="font-light">Yes they are! We use a protective coating to ensure the paint does not get damaged and the wood is able to last a long time.</p>
                                </div>
                            </div>

                            <div id="faq-panel-three" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">How long does a furniture piece take to make and ship?</div>

                                    <button
                                        onClick={() => panelThree === 'hidden' ? ( setPanelThree('block'), setPanelThreeIcon('/faq-minus-icon.svg') ) : ( setPanelThree('hidden'), setPanelThreeIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                    >
                                        <img className="min-w-3" src={panelThreeIcon} />
                                    </button>
                                </div>

                                <div className={`${panelThree}`}>
                                    <p className="font-light">The completion time of a furniture piece is dependent on which model it is. It can vary from 1 week to around 3 weeks depending on the furniture piece. Shipping time is entirely out of our control and depends on the shipping provider.</p>
                                </div>
                            </div>

                            <div id="faq-panel-four" className="flex flex-col gap-5 pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Can I choose a paint finish that is not currently available?</div>

                                    <button
                                        onClick={() => panelFour === 'hidden' ? ( setPanelFour('block'), setPanelFourIcon('/faq-minus-icon.svg') ) : ( setPanelFour('hidden'), setPanelFourIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                    >
                                        <img className="min-w-3" src={panelFourIcon} />
                                    </button>
                                </div>

                                <div className={`${panelFour}`}>
                                    <p className="font-light">Absolutely! You can pick out a paint finish you prefer and add it in a contact form submission at our <Link to="/Contact" className="text-blue-500 underline">contact page</Link>.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    )
}