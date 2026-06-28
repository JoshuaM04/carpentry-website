import Footer from '../components/footer';

export default function Gallery() {
    return (
        <div className="gallery-container flex flex-col gap-20">
            <main className="flex min-h-dvh p-10">
                <div className="flex flex-wrap justify-center gap-10 mt-40 max-2md:mt-60 w-full">
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img1.avif" alt="" /></div>
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img2.avif" alt="" /></div>
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img3.avif" alt="" /></div>
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img4.avif" alt="" /></div>
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img5.avif" alt="" /></div>
                    <div className="h-min"><img className="w-100" src="/furniture/gallery/img6.avif" alt="" /></div>
                </div>
            </main>

            <Footer />
        </div>
    );
}