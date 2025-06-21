import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Dashboard from './pages/Dashboard';
import QR from './pages/QR';
import Demo from './pages/Demo';
import Auth from './pages/Auth';
import Contributor from './pages/Contributor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* <Navbar /> */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qr" element={<QR />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/contributor" element={<Contributor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
