import Furniture from '../../../components/Furniture';
import Footer from '../../../components/footer';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function HazyNight() {
    return (
        <div className="flex flex-col justify-between gap-20 min-h-dvh">
            <main className="table-one-container flex flex-col gap-10 p-10">
                <Furniture
                    key={FURNITURE_CATALOG[1]["id"]}
                    product={FURNITURE_CATALOG[1]}
                />
            </main>

            <Footer />
        </div>
    );
}