import Furniture from '../../../components/Furniture';
import { FURNITURE_CATALOG } from '../../../utility/catalog';

export default function EarthWood() {

    return (
        <main className="table-one-container flex flex-col gap-10 min-h-dvh p-10">
            <Furniture 
                key={FURNITURE_CATALOG[0]["id"]}
                product={FURNITURE_CATALOG[0]}
            />
        </main>
    );
}