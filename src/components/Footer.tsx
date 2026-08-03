import { Link } from 'react-router-dom';
import { FURNITURE_CATALOG } from '../utility/catalog';

export default function footer() {
    return (
        <footer className="footer-component flex flex-col gap-16 text-bone-50 bg-bark-950 w-full">
            <div className="flex flex-wrap justify-between gap-16 px-8 pt-20 max-2md:px-6">
                <div className="flex flex-col justify-between gap-10 max-w-md">
                    <div className="flex flex-col gap-5">
                        <p className="eyebrow text-clay-400">Hand crafted in San Marcos</p>
                        <p className="display display-lg">Furniture built<br />to outlive trends.</p>
                    </div>

                    <Link to="/contact" className="btn btn-solid bg-bone-50 text-bark-950 hover:bg-bone-200 w-fit">Start a conversation</Link>
                </div>

                <div className="flex flex-wrap gap-16">
                    <div className="flex flex-col gap-5">
                        <p className="eyebrow text-clay-400">Information</p>

                        <div className="flex flex-col gap-3 micro">
                            <Link to="/home" className="link-underline w-fit">Home</Link>
                            <Link to="/gallery" className="link-underline w-fit">Gallery</Link>
                            <Link to="/about" className="link-underline w-fit">About</Link>
                            <Link to="/contact" className="link-underline w-fit">Contact</Link>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="eyebrow text-clay-400">Collection</p>

                        <div className="flex flex-col gap-3 micro">
                            {
                                FURNITURE_CATALOG.map((item) => (
                                    <Link key={item.id} to={item.route} className="link-underline w-fit">{item.name}</Link>
                                ))
                            }
                            <span className="text-clay-400">Chairs — coming soon</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5">
                        <p className="eyebrow text-clay-400">Studio</p>

                        <div className="flex flex-col gap-3 micro text-clay-400">
                            <p>San Marcos, Texas</p>
                            <p>Local pickup only</p>
                            <p>Family owned</p>
                            <p>Real wood, no laminate</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 border-t border-bone-50/15 px-8 py-6 max-2md:px-6">
                <div className="flex items-center gap-2 eyebrow text-clay-400">
                    <p>WoodWork Creations</p>
                    <svg className="stroke-clay-400 w-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12Z" strokeWidth="1.5"></path><path d="M14 15.6672C13.475 15.8812 12.8952 16 12.2857 16C9.91878 16 8 14.2091 8 12C8 9.79086 9.91878 8 12.2857 8C12.8952 8 13.475 8.11876 14 8.33283" strokeWidth="1.5" strokeLinecap="round"></path></svg>
                    <p>2026</p>
                </div>

                <p className="eyebrow text-clay-400">Created by Joshua M.</p>
            </div>
        </footer>
    )
}
