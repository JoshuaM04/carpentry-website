import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import EarthWood from './pages/Catalog/Tables/EarthWood';
import EarthWoodReview from './pages/Reviews/Tables/EarthWoodReview';
import HazyNight from './pages/Catalog/Nightstands/HazyNight';
import HazyNightReview from './pages/Reviews/Nightstands/HazyNightReview';
import NavBar from './components/navigation';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="root-container min-h-dvh font-roboto">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/EarthWood" element={<EarthWood />} />
        <Route path="/HazyNight" element={<HazyNight />} />

        <Route path="/EarthWoodReview" element={<EarthWoodReview />} />
        <Route path="/HazyNightReview" element={<HazyNightReview />} />
      </Routes>
    </div>
  );
}