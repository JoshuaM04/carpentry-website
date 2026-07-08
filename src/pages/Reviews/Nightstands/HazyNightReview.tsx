import Reviews from '../../../components/Reviews';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function HazyNightReview() {
    return (
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
    );
}