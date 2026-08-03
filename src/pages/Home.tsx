import Footer from '../components/Footer';
import { FURNITURE_CATALOG } from '../utility/catalog'
import FurnitureCard from '../components/FurnitureCard';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';

const COLLECTION_IMAGES = [
    '/furniture/gallery/img1.avif',
    '/furniture/gallery/img2.avif',
    '/furniture/gallery/img3.avif',
    '/furniture/gallery/img4.avif',
    '/furniture/gallery/img5.avif',
    '/furniture/gallery/img6.avif'
];

const PROCESS = [
    { step: '01', title: 'Sourcing', copy: 'Wood is picked by hand from Home Depot and Lowes, or ordered from a local supplier when a commission calls for it.' },
    { step: '02', title: 'Craftsmanship', copy: 'Real lumber only — no laminate, no particle board, no printed grain. Every piece is cut, joined, and sanded by hand.' },
    { step: '03', title: 'Finishing', copy: 'Your chosen stain is sealed under a protective transparent coat, so the colour holds and the wood stays water resistant.' },
    { step: '04', title: 'Pickup', copy: 'One to three weeks from order to finished piece, then local pickup in San Marcos with the details confirmed start to finish.' }
];

export default function Home() {
    const featured = FURNITURE_CATALOG.find((item) => item.id === 'hazy-night') ?? FURNITURE_CATALOG[0];
    const tables = FURNITURE_CATALOG.filter((item) => item.type === "table");
    const nightstands = FURNITURE_CATALOG.filter((item) => item.type === "nightstand");

    return (
        <div className="home-container flex flex-col">
            <main className="flex flex-col">
                <section id="video-showcase" className="flex flex-col justify-between text-bone-50 bg-bark-950 h-dvh min-h-160 w-full pt-(--header-h) relative overflow-hidden">
                    <img className="top-0 left-0 w-full h-full object-cover absolute" src="/heroSectionImage.avif" alt="WoodWork Creations banner" />

                    <div className="bg-linear-to-b from-bark-950/75 via-bark-950/25 to-bark-950/85 top-0 left-0 w-full h-full absolute"></div>

                    <div className="flex justify-center items-center flex-1 px-6 relative">
                        <h1 className="display display-xl text-center">Hand crafted.<br />Real materials.<br />Family owned.</h1>
                    </div>

                    <div className="flex flex-wrap justify-between items-end gap-10 px-6 pb-10 relative max-2md:pb-8">
                        <Link to={featured.route} className="flex items-center gap-4 bg-bone-50/95 text-bark-900 p-3 w-fit max-w-xs">
                            <div className="img-frame w-16 h-16 shrink-0">
                                <img className="w-full h-full object-cover" src={featured.image} alt={featured.name} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="display text-sm">{featured.name}</p>
                                <p className="micro text-stone-500 capitalize">{featured.type} · {featured.wood}</p>
                                <p className="micro">${featured.price}</p>
                            </div>
                        </Link>

                        <div className="flex flex-col gap-6 max-w-md">
                            <p className="text-sm leading-relaxed text-bone-100">
                                Furniture made from honest wood, joined by hand and finished to last — built by a family in San Marcos who talk you through every detail from the first message to local pickup.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a href="#furniture-menu" className="btn btn-solid bg-bone-50 text-bark-950 hover:bg-bone-200">Explore collection</a>
                                <Link to="/about" className="btn btn-ghost btn-ghost-light">Our story</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="reveal flex flex-col gap-12 px-6 py-24 max-2md:py-16">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <p className="eyebrow text-stone-500">Collections</p>

                        <p className="display display-xl max-w-4xl">
                            <span>Tables, Nightstands, Chairs,</span> <span className="text-stone-500">and more</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-6 gap-3 max-2md:grid-cols-3 max-xsm:grid-cols-2">
                            {
                                COLLECTION_IMAGES.map((item, index) => (
                                    <div key={index} className="img-frame aspect-[4/5]">
                                        <img className="w-full h-full object-cover" src={item} alt="Stock photograph of a wooden furniture piece" loading="lazy" />
                                    </div>
                                ))
                            }
                        </div>

                        <p className="micro text-stone-500 text-center">Stock imagery shown for inspiration — these are not pieces from our catalog.</p>
                    </div>
                </section>

                <section id="furniture-menu" className="reveal flex flex-col gap-16 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
                    <SectionHeading eyebrow="Available now" left="Signature" right="Collections." />

                    <div className="flex flex-col gap-16">
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <p className="eyebrow text-stone-500">01</p>
                                <p className="display display-md">Tables</p>
                                <span className="bg-bark-900/15 flex-1 h-px"></span>
                                <p className="micro text-stone-500">{tables.length} piece{tables.length === 1 ? '' : 's'}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                                {
                                    tables.map((item) => (
                                        <FurnitureCard
                                            key={item.id}
                                            product={item}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <p className="eyebrow text-stone-500">02</p>
                                <p className="display display-md">Nightstands</p>
                                <span className="bg-bark-900/15 flex-1 h-px"></span>
                                <p className="micro text-stone-500">{nightstands.length} piece{nightstands.length === 1 ? '' : 's'}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                                {
                                    nightstands.map((item) => (
                                        <FurnitureCard
                                            key={item.id}
                                            product={item}
                                        />
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <p className="eyebrow text-stone-500">03</p>
                                <p className="display display-md">Chairs</p>
                                <span className="bg-bark-900/15 flex-1 h-px"></span>
                                <p className="micro text-stone-500">In the workshop</p>
                            </div>

                            <div className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                                <div className="flex justify-center items-center border border-dashed border-bark-900/25 text-stone-500 aspect-[4/3]">
                                    <p className="eyebrow">Coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-16 text-bone-50 bg-bark-950 px-6 py-24 relative overflow-hidden max-2md:py-16">
                    <img className="top-0 left-0 w-full h-full object-cover opacity-20 absolute" src="/about-media/workStation2.png" alt="" aria-hidden="true" loading="lazy" />

                    <div className="flex flex-col gap-16 relative">
                        <SectionHeading eyebrow="How it is made" left="Made with" right="Intention." inverted />

                        <div className="grid grid-cols-4 gap-px bg-bone-50/20 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                            {
                                PROCESS.map((item) => (
                                    <div key={item.step} className="flex flex-col gap-4 bg-bark-950/80 p-6 backdrop-blur-sm">
                                        <p className="eyebrow text-clay-400">{item.step}</p>
                                        <p className="display display-md">{item.title}</p>
                                        <p className="text-sm leading-relaxed text-bone-100/80">{item.copy}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </section>

                <section className="flex justify-start items-center min-h-140 px-6 py-24 relative overflow-hidden max-2md:py-16">
                    <img className="top-0 left-0 w-full h-full object-cover absolute" src="/about-media/workStation4.png" alt="" aria-hidden="true" loading="lazy" />
                    <div className="bg-bark-950/45 top-0 left-0 w-full h-full absolute"></div>

                    <div className="flex flex-col gap-6 bg-bone-50 p-10 max-w-xl relative max-2md:p-8">
                        <p className="eyebrow text-stone-500">Made to order</p>

                        <p className="display display-xl">Find the piece that feels at home.</p>

                        <p className="text-sm leading-relaxed text-stone-600">
                            Pick a finish from the catalog, or commission something built to your own measurements. Either way you get the same wood, the same joinery, and a straight answer on timing.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <a href="#furniture-menu" className="btn btn-solid">Explore collection</a>
                            <Link to="/contact" className="btn btn-ghost">Request a commission</Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
