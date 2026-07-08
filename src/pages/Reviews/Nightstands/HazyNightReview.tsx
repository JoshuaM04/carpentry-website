import Reviews from '../../../components/Reviews';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function HazyNightReview() {
    return (
        <Reviews 
            key={FURNITURE_CATALOG[1]["id"]}
            product={FURNITURE_CATALOG[0]}
        />
    );
}