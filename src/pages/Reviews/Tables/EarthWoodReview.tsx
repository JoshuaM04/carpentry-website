import Reviews from '../../../components/Reviews';
import Footer from '../../../components/Footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function EarthWoodReview() {
    return (
        <div className="earth-wood-review-container flex flex-col min-h-dvh w-full">
            {
                FURNITURE_CATALOG.filter((item) => item.id === 'earth-wood').map((item) => (
                    <Reviews
                        key={item.id}
                        product={item}
                    />
                ))
            }

            <Footer />
        </div>
    );
}
