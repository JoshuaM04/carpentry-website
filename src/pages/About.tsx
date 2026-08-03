import Footer from'../components/Footer';
import SectionHeading from '../components/SectionHeading';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GALLERY = ['/about-media/workStation1.png', '/about-media/workStation2.png', '/about-media/workStation3.png', '/about-media/workStation4.png'];

const FAQ = [
    {
        question: 'Do you source and use real wood for your products?',
        answer: <>Yes! We source our wood from Lowes and Home Depot to build our products. We may also source wood from a local lumber supplier for any custom projects. We do <strong className="font-semibold">NOT</strong> use any cheap lamination, particle board, or fake prints.</>
    },
    {
        question: 'Are the furniture pieces water resistant?',
        answer: <>Yes they are! We use a protective transparent coating to ensure the stain does not get damaged and the wood is able to last a long time.</>
    },
    {
        question: 'How long does a furniture piece take to craft?',
        answer: <>The completion time of a furniture piece is dependent on which model it is. It can vary from 1 week to around 3 weeks depending on the complexity of the furniture piece.</>
    },
    {
        question: 'Can I choose a stain that is not currently available?',
        answer: <>Absolutely! You can pick out a stain you prefer and add it in a contact form submission at our <Link to="/contact" className="link-underline font-medium whitespace-nowrap">contact page</Link>.</>
    },
    {
        question: 'Can I commission a custom-made furniture piece?',
        answer: <>Yes! You can visit the <Link to="/contact" className="link-underline font-medium whitespace-nowrap">contact page</Link> and submit a request about commissioning a custom-made furniture piece.</>
    }
];

export default function About() {
    const [openPanels, setOpenPanels] = useState<number[]>([]);

    const togglePanel = (index: number) => {
        setOpenPanels((prevPanels) =>
            prevPanels.includes(index)
            ? prevPanels.filter((item) => item !== index)
            : [...prevPanels, index]
        );
    };

    return (
        <div className="about-container flex flex-col">
            <main className="flex flex-col">
                <section className="flex flex-col justify-end gap-10 text-bone-50 bg-bark-950 min-h-[70vh] px-6 pt-(--header-h) pb-14 relative overflow-hidden">
                    <img className="top-0 left-0 w-full h-full object-cover opacity-35 absolute" src="/about-media/workStation1.png" alt="" aria-hidden="true" />

                    <div className="flex flex-col gap-6 pt-16 relative">
                        <p className="eyebrow text-clay-400">Our story</p>
                        <h1 className="display display-hero max-w-5xl">Creating hand-made furniture to last</h1>
                    </div>
                </section>

                <section className="reveal grid grid-cols-[1fr_1.2fr] gap-16 px-6 py-24 max-2md:grid-cols-1 max-2md:gap-10 max-2md:py-16">
                    <p className="eyebrow text-stone-500">A family business</p>

                    <div className="flex flex-col gap-8">
                        <p className="text-base leading-relaxed">
                            We are a family-business with our sights on quality and care pertaining to our products. We source our wood from Home Depot or Lowes and can order specific pieces from suppliers if a custom request is made for a furniture piece.
                            From the very start, we ensure communication is thorough when covering product details and at the very end we ensure that the product is properly delivered.
                        </p>

                        <p className="text-base leading-relaxed text-stone-600">
                            We are based in San Marcos and are only allowing local pickup for our products for the time being. In the future we hope to be able to ship our products anywhere across the United States!
                        </p>

                        <Link to="/home" className="btn btn-solid w-fit">Explore our catalog</Link>
                    </div>
                </section>

                <section className="reveal flex flex-col gap-12 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
                    <SectionHeading eyebrow="Inside the workshop" left="A glimpse" right="Into the studio." />

                    <div className="grid grid-cols-4 gap-3 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                        {
                            GALLERY.map((item, index) => (
                                <div key={index} className="img-frame aspect-[4/5]">
                                    <img className="w-full h-full object-cover" src={item} alt="Workstation" loading="lazy" />
                                </div>
                            ))
                        }
                    </div>
                </section>

                <section className="reveal flex flex-col gap-12 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
                    <SectionHeading eyebrow="What comes next" left="Our plans" right="For the future." />

                    <div className="grid grid-cols-[1fr_1.2fr] gap-16 max-2md:grid-cols-1 max-2md:gap-8">
                        <p className="eyebrow text-stone-500">Expanding the catalog</p>

                        <p className="text-base leading-relaxed">
                            The future of our company will pertain to expanding the catalog to include different furniture pieces that are common in different areas of someone's home. That could be a lawn chair, a coffee table, or even an island for your kitchen.
                            We also hope to be able to offer the option of shipping in the future to reach a larger audience across the United States.
                        </p>
                    </div>
                </section>

                <section className="reveal flex flex-col gap-12 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
                    <SectionHeading eyebrow="In progress" left="Behind" right="The scenes." />

                    <div className="grid grid-cols-3 gap-10 max-2md:grid-cols-2 max-xsm:grid-cols-1">
                        <div className="flex justify-center items-center border border-dashed border-bark-900/25 text-stone-500 aspect-[4/3]">
                            <p className="eyebrow">Coming soon</p>
                        </div>
                    </div>
                </section>

                <section className="reveal flex flex-col gap-12 border-t border-bark-900/15 px-6 py-24 max-2md:py-16">
                    <SectionHeading eyebrow="Good to know" left="Frequently" right="Asked questions." />

                    <div className="flex flex-col">
                        {
                            FAQ.map((item, index) => {
                                const isOpen = openPanels.includes(index);

                                return (
                                    <div key={index} id={`faq-panel-${index}`} className="flex flex-col border-b border-bark-900/15 first:border-t py-6">
                                        <div className="flex justify-between items-start gap-8">
                                            <p className="display display-md max-w-3xl">{item.question}</p>

                                            <button
                                                onClick={() => togglePanel(index)}
                                                className="flex justify-center items-center bg-bark-900 size-8 p-2.5 shrink-0 hover:bg-bark-700 hover:cursor-pointer"
                                                aria-controls={`panel-${index}`}
                                                aria-expanded={isOpen}
                                                aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
                                            >
                                                <img className="w-full" src={isOpen ? '/faq-minus-icon.svg' : '/faq-plus-icon.svg'} alt="" />
                                            </button>
                                        </div>

                                        <div id={`panel-${index}`} className={`${isOpen ? 'block' : 'hidden'} pt-5 max-w-3xl`}>
                                            <p className="text-base leading-relaxed text-stone-600">{item.answer}</p>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
