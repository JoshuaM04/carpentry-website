import Reviews from '../../../components/Reviews';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function EarthWoodReview() {
    return (
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
    );
}