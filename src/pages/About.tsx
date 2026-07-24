import Footer from'../components/Footer';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function About() {
    const gallery = ['/about-media/workStation1.png', '/about-media/workStation2.png', '/about-media/workStation3.png', '/about-media/workStation4.png'];
    const [panelOne, setPanelOne] = useState('hidden');
    const [panelOneIcon, setPanelOneIcon] = useState('/faq-plus-icon.svg');
    const [panelTwo, setPanelTwo] = useState('hidden');
    const [panelTwoIcon, setPanelTwoIcon] = useState('/faq-plus-icon.svg');
    const [panelThree, setPanelThree] = useState('hidden');
    const [panelThreeIcon, setPanelThreeIcon] = useState('/faq-plus-icon.svg');
    const [panelFour, setPanelFour] = useState('hidden');
    const [panelFourIcon, setPanelFourIcon] = useState('/faq-plus-icon.svg');
    const [panelFive, setPanelFive] = useState('hidden');
    const [panelFiveIcon, setPanelFiveIcon] = useState('/faq-plus-icon.svg');


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
                            We are based in San Marcos and are able to ship our products anywhere across the United States. We strive for excellence and we hope to expand our reach to other countries as well!
                        </p>
                        <Link to="/Home" className="text-sm font-semibold text-white bg-black pt-2 pb-2 pl-5 pr-6 w-fit h-fit hover:cursor-pointer">Explore our catalog</Link>
                    </section>

                    <section className="flex flex-col gap-10">
                        <h2 className="text-3xl font-semibold">A glimpse into the studio</h2>
                        <div className="flex flex-wrap gap-10">
                            {
                                gallery.map((item) => (
                                    <img className="max-lg:w-full max-2xl:w-(--gallery-item-sm) w-(--gallery-item)" src={item} alt="Workstation" />
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

                        <div className="flex flex-col justify-center gap-10 max-xsm:justify-center">
                            <div className="flex justify-center items-center text-xl uppercase font-bold text-white bg-black size-50">
                                Coming Soon
                            </div> 
                        </div>
                    </section>

                    <section className="flex flex-col gap-5">
                        <h3 className="text-xl font-semibold">Frequently asked questions</h3>

                        <div>
                            <div id="faq-panel-one" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Do you source and use real wood for your products?</div>

                                    <button
                                        onClick={() => panelOne === 'hidden' ? ( setPanelOne('block'), setPanelOneIcon('/faq-minus-icon.svg') ) : ( setPanelOne('hidden'), setPanelOneIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                        aria-controls="panel-one"
                                    >
                                        <img className="min-w-3" src={panelOneIcon} />
                                    </button>
                                </div>

                                <div id="panel-one" className={`${panelOne}`} aria-expanded={panelOne === 'block'}>
                                    <p className="font-light">Yes! We source our wood from Lowes and Home Depot to build our products. We may also source wood from a local lumber supplier for any custom projects. We do <strong>NOT</strong> use any cheap lamination, particle board, or fake prints.</p>
                                </div>
                            </div>

                            <div id="faq-panel-two" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Are the furniture pieces water resistant?</div>

                                    <button
                                        onClick={() => panelTwo === 'hidden' ? ( setPanelTwo('block'), setPanelTwoIcon('/faq-minus-icon.svg') ) : ( setPanelTwo('hidden'), setPanelTwoIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                        aria-controls="panel-two"
                                    >
                                        <img className="min-w-3" src={panelTwoIcon} />
                                    </button>
                                </div>

                                <div id="panel-two" className={`${panelTwo}`} aria-expanded={panelTwo === 'block'}>
                                    <p className="font-light">Yes they are! We use a protective transparent coating to ensure the paint does not get damaged and the wood is able to last a long time.</p>
                                </div>
                            </div>

                            <div id="faq-panel-three" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">How long does a furniture piece take to make and ship?</div>

                                    <button
                                        onClick={() => panelThree === 'hidden' ? ( setPanelThree('block'), setPanelThreeIcon('/faq-minus-icon.svg') ) : ( setPanelThree('hidden'), setPanelThreeIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                        aria-controls="panel-three"
                                    >
                                        <img className="min-w-3" src={panelThreeIcon} />
                                    </button>
                                </div>

                                <div id="panel-three" className={`${panelThree}`} aria-expanded={panelThree === 'block'}>
                                    <p className="font-light">The completion time of a furniture piece is dependent on which model it is. It can vary from 1 week to around 3 weeks depending on the furniture piece. Shipping time is entirely out of our control and depends on the shipping provider.</p>
                                </div>
                            </div>

                            <div id="faq-panel-four" className="flex flex-col gap-5 border-b pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Can I choose a paint finish that is not currently available?</div>

                                    <button
                                        onClick={() => panelFour === 'hidden' ? ( setPanelFour('block'), setPanelFourIcon('/faq-minus-icon.svg') ) : ( setPanelFour('hidden'), setPanelFourIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                        aria-controls="panel-four"
                                    >
                                        <img className="min-w-3" src={panelFourIcon} />
                                    </button>
                                </div>

                                <div id="panel-four" className={`${panelFour}`} aria-expanded={panelFour === 'block'}>
                                    <p className="font-light">Absolutely! You can pick out a paint finish you prefer and add it in a contact form submission at our <Link to="/Contact" className="text-blue-500 underline">contact page</Link>.</p>
                                </div>
                            </div>

                            <div id="faq-panel-five" className="flex flex-col gap-5 pt-4 pb-4">
                                <div className="flex justify-between items-center gap-5">
                                    <div className="font-semibold">Can I commission a custom-made furniture piece?</div>
                                    
                                    <button
                                        onClick={() => panelFive === 'hidden' ? ( setPanelFive('block'), setPanelFiveIcon('/faq-minus-icon.svg') ) : ( setPanelFive('hidden'), setPanelFiveIcon('/faq-plus-icon.svg') )}
                                        className="flex justify-center items-center bg-black rounded-[50%] size-7 p-2 hover:cursor-pointer"
                                        aria-controls="panel-five"
                                    >
                                        <img className="min-w-3" src={panelFiveIcon} />
                                    </button>
                                </div>

                                <div id="panel-five" className={`${panelFive}`} aria-expanded={panelFive === 'block'}>
                                    <p className="font-light">Yes! You can visit the <Link to="/Contact" className="text-blue-500 underline">contact page</Link> and submit a request about commissioning a custom-made furniture piece.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="flex justify-center items-center">
                        <div className="flex flex-col justify-center items-center gap-2 w-fit">
                            <p className="text-lg uppercase flex gap-2">Created by Joshua M.</p>
                        </div>
                    </section>
                </main>
            </div>

            <Footer />
        </div>
    )
}