import Footer from '../components/Footer';

export default function Gallery() {
    return (
        <div className="gallery-container flex flex-col gap-20">
            <main className="flex justify-center items-center min-h-dvh p-10 mt-40">
                <div className="flex flex-wrap items-center gap-10 max-xsm:justify-center">
                    <div className="flex justify-center items-center text-2xl uppercase font-bold text-white bg-black size-100">
                        Coming Soon
                    </div> 
                </div>
            </main>

            <Footer />
        </div>
    );
}