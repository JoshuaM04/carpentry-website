import Reviews from '../../../components/Reviews';
import Footer from '../../../components/Footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function HazyNightReview() {
    return (
        <div className="flex flex-col justify-between gap-20 min-h-dvh">
            <main>
                {
                    FURNITURE_CATALOG.filter((item) => item.id === 'hazy-night').map((item) => (
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