import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import EarthWood from './pages/Catalog/Tables/EarthWood';
import EarthWoodReview from './pages/Reviews/Tables/EarthWoodReview';
import HazyNight from './pages/Catalog/Nightstands/HazyNight';
import HazyNightReview from './pages/Reviews/Nightstands/HazyNightReview';
import NavBar from './components/Navigation';
import ScrollToTop from './components/ScrollToTop';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import AIChatbot from './components/AIChatbot';

export default function App() {
  const [cart, setCart] = useState<any[]>([]);

  const addToCart = (product: any, selectedColor: string) => {
    setCart((prevCart) => {
      let finalColor = '';

      if (selectedColor === 'raw wood') {
        finalColor = selectedColor;
      } else {
        finalColor = selectedColor.substring(8);
      }

      const uniqueCartId = `${product.id}-${finalColor}`;

      const existingItem = prevCart.find((item) => item.cartItemId === uniqueCartId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.cartItemId === uniqueCartId
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }

      return [
        ...prevCart,
        {
          ...product,
          activeColor: finalColor,
          cartItemId: uniqueCartId,
          quantity: 1
        }
      ];
    });
  };

  return (
    <div className="root-container flex flex-col min-h-dvh text-bark-900 bg-bone-50 font-sans">
      <Analytics />
      <SpeedInsights />

      <NavBar cart={cart} setCart={setCart} />

      <ScrollToTop />
      <AIChatbot />

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
