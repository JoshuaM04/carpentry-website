import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import EarthWood from './pages/Catalog/Tables/EarthWood';
import EarthWoodReview from './pages/Reviews/Tables/EarthWoodReview';
import HazyNight from './pages/Catalog/Nightstands/HazyNight';
import HazyNightReview from './pages/Reviews/Nightstands/HazyNightReview';
import NavBar from './components/Navigation';
import Cart from './components/Cart'
import ScrollToTop from './components/ScrollToTop';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  const [cart, setCart] = useState<any[]>([]);
  
  const addToCart = (product: any, selectedColor: string) => {
    setCart((prevCart) => {
      const finalColor = selectedColor || product.colors?.[0] || 'Default';

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
    <div className="root-container min-h-dvh font-roboto">
      <NavBar />

      <Cart cart={cart} setCart={setCart} />
      
      <ScrollToTop />

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