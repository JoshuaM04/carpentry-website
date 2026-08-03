import Reviews from '../../../components/Reviews';
import Footer from '../../../components/Footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function HazyNightReview() {
    return (
        <div className="hazy-night-review-container flex flex-col min-h-dvh w-full">
            {
                FURNITURE_CATALOG.filter((item) => item.id === 'hazy-night').map((item) => (
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
