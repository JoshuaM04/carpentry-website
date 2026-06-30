import Home from './pages/Home'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'
import TableOne from './pages/Catalog/Tables/TableOne'
import TableOneReview from './pages/Reviews/Tables/TableOneReview';
import NavBar from './components/navigation';
import Cart from './components/cart';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

export default function App() {
  let count = 0;
    const [quantity, setQuantity] = useState(1);
    const [inCart, setInCart] = useState(0);
    const [price, setPrice] = useState(500);
    const [inCartPrice, setInCartPrice] = useState(0);
    const handleDecrement = (quantity: number) => {if (quantity !== 1) { setQuantity(quantity - 1); setPrice(price - 500) }};
    const handleIncrement = (quantity: number) => {if (quantity !== 99) { setQuantity(quantity + 1); setPrice(price + 500) }};
    const handleCart = (quantity: number) => {if (inCart === 0 && count === 0) { setInCart(inCart + quantity); setInCartPrice(price); } else { setInCart(inCart + quantity); setInCartPrice(inCartPrice + price); }};
    const handleCartDecrement = (quantity: number) => {if (quantity !== 1) { setInCart(inCart - 1); setInCartPrice(inCartPrice - 500)}};
    const handleCartIncrement = (quantity: number) => {if (quantity !== 99) { setInCart(inCart + 1); setInCartPrice(inCartPrice + 500)}};

  return (
    <div className="root-container min-h-dvh font-roboto">
      <NavBar />

      <Cart 
        inCart={inCart}
        inCartPrice={inCartPrice}
        handleCartDecrement={handleCartDecrement}
        handleCartIncrement={handleCartIncrement}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/TableOne" 
              element={
                <TableOne 
                  quantity={quantity}
                  price={price}
                  count={count}
                  handleDecrement={handleDecrement}
                  handleIncrement={handleIncrement}
                  handleCart={handleCart}
                />
              } 
        />

        <Route path="/TableOneReview" element={<TableOneReview />} />
      </Routes>
    </div>
  );
}