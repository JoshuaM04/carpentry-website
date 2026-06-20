import Home from './pages/Home'
import About from './pages/About'
import NavBar from './components/navigation';
import { Routes, Route } from 'react-router-dom';

export default function App() {

  return (
    <div className="root-container min-h-dvh">
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}