import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Gallery() {
    return (
        <div className="gallery-container flex flex-col">
            <main className="flex flex-col justify-between text-bone-50 bg-bark-950 min-h-dvh w-full pt-(--header-h) relative overflow-hidden">
                <img className="top-0 left-0 w-full h-full object-cover opacity-25 absolute" src="/about-media/workStation3.png" alt="" aria-hidden="true" />

                <div className="flex flex-col gap-6 px-6 pt-16 relative max-2md:pt-12">
                    <p className="eyebrow text-clay-400">Gallery</p>

                    <p className="text-sm leading-relaxed max-w-md text-bone-100/80">
                        A full gallery of finished pieces and installs is being photographed. Until it lands, the catalog carries every angle we have.
                    </p>
                </div>

                <div className="flex flex-col gap-10 px-6 pb-16 relative max-2md:pb-12">
                    <h1 className="display display-hero">Coming soon.</h1>

                    <div className="flex flex-wrap gap-3 border-t border-bone-50/15 pt-10">
                        <Link to="/home" className="btn btn-solid bg-bone-50 text-bark-950 hover:bg-bone-200">Browse the catalog</Link>
                        <Link to="/contact" className="btn btn-ghost btn-ghost-light">Ask about a piece</Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
