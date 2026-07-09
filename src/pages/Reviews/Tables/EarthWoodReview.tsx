import Reviews from '../../../components/Reviews';
import Footer from '../../../components/footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function EarthWoodReview() {
    return (
        <div className="flex flex-col justify-between gap-20 min-h-dvh">
            <main>
                {
                    FURNITURE_CATALOG.filter((item) => item.id === 'earth-wood').map((item) => (
                        <Reviews
                            key={item.id}
                            product={item}
                        />
                    ))
                }
            </main>

            <Footer />
        </div>
    );
}