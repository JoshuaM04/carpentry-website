import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import EarthWood from './pages/Catalog/Tables/EarthWood';
import EarthWoodReview from './pages/Reviews/Tables/EarthWoodReview';
import HazyNight from './pages/Catalog/Nightstands/HazyNight';
import HazyNightReview from './pages/Reviews/Nightstands/HazyNightReview';
import NavBar from './components/Navigation';
import Cart from './components/Cart';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...prevCart, { ...product, quantity: 1}];
    });
  };

  return (
    <div className="root-container min-h-dvh font-roboto">
      <NavBar />

      <Cart cart={cart} setCart={setCart} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/EarthWood" element={<EarthWood addToCart={addToCart} />} />
        <Route path="/HazyNight" element={<HazyNight addToCart={addToCart} />} />

        <Route path="/EarthWoodReview" element={<EarthWoodReview />} />
        <Route path="/HazyNightReview" element={<HazyNightReview />} />
      </Routes>
    </div>
  );
}