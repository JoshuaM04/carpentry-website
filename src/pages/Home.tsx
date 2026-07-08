import Footer from '../components/footer';
import { FURNITURE_CATALOG } from '../utility/catalog'
import FurnitureCard from '../components/FurnitureCard';

export default function Home() {

    return (
        <div className="home-container flex flex-col gap-20">
            <main className="flex flex-col gap-80 items-center">
                <section id="video-showcase" className="relative h-screen w-full overflow-hidden">
                    <video 
                        className="top-0 left-0 w-full h-full object-cover pointer-events-none max-2md:hidden max-2md:aria-hidden" autoPlay loop muted>
                        <source className="max-2md:hidden max-2md:aria-hidden" src="woodWorkSample.mp4" type="video/mp4"></source>
                    </video>

                    <div className="h-screen w-full overflow-hidden mt-40 pointer-events-none"><img className="top-0 left-0 w-full h-full object-cover" src="/heroSectionImage.avif" alt="" /></div>

                    <div className="text-white top-[45%] left-[50%] translate-x-[-50%] absolute max-2md:w-56.25 max-2md:top-[50%]">
                        <h1 className="font-bold flex flex-col gap-4 text-6xl text-center">
                            <div>Hand Crafted</div>
                            <div>Real Materials</div>
                            <div>Family Owned</div>
                        </h1>
                    </div>

                    <div className="flex flex-col justify-center items-center gap-5 text-white bottom-20 left-[50%] translate-x-[-50%] absolute max-2md:bottom-10">
                        <p className="explore-text font-bold uppercase">Explore</p>

                        <a href="#cart" className="flex justify-center items-center explore-arrow-container bg-slate-900 rounded-full animate-bounce">
                            <svg className="fill-white w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3C12.5523 3 13 3.44772 13 4V17.5858L18.2929 12.2929C18.6834 11.9024 19.3166 11.9024 19.7071 12.2929C20.0976 12.6834 20.0976 13.3166 19.7071 13.7071L12.7071 20.7071C12.3166 21.0976 11.6834 21.0976 11.2929 20.7071L4.29289 13.7071C3.90237 13.3166 3.90237 12.6834 4.29289 12.2929C4.68342 11.9024 5.31658 11.9024 5.70711 12.2929L11 17.5858V4C11 3.44772 11.4477 3 12 3Z"></path> </g></svg>
                        </a>
                    </div>
                </section>

                <section id="furniture-menu" className="flex flex-col gap-10 w-full p-10">
                    <p className="text-2xl font-bold max-xsm:text-center">Tables</p>

                    <div className="flex flex-wrap justify-between items-center gap-10 max-xsm:justify-center">
                        <div className="flex flex-wrap justify-between items-center gap-10 max-xsm:justify-center">    
                            {
                                FURNITURE_CATALOG.filter((item) => item.type === "table").map((item) => (
                                    <FurnitureCard
                                        key={item.id}
                                        product={item}
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <hr />

                    <p className="text-2xl font-bold max-sm:text-center">Nightstands</p>

                    <div className="flex flex-wrap justify-between items-center gap-10 max-xsm:justify-center">    
                        {
                            FURNITURE_CATALOG.filter((item) => item.type === "nightstand").map((item) => (
                                <FurnitureCard
                                    key={item.id}
                                    product={item}
                                />
                            ))
                        }
                    </div>

                    <hr />

                    <p className="text-2xl font-bold max-xsm:text-center">Chairs</p>

                    <div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
                        <div className="flex justify-center items-center text-xl uppercase font-bold bg-slate-100 size-50">
                            Coming Soon
                        </div> 
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}