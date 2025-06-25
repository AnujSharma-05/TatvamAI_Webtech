import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#101729] backdrop-blur-xl'
          : 'bg-[#101729]/90 backdrop-blur-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 flex items-center hover:scale-105 transition-transform duration-300 mr-8"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TatvamAI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="flex-1 hidden lg:flex items-center justify-center space-x-8">
            <Link
              to="/about"
              className="text-white hover:text-blue-400 font-medium transition-colors duration-300"
            >
              About
            </Link>

            {/* Products Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white font-medium hover:text-blue-400 transition-colors duration-300">
                <span>Products</span>
                <span className="text-xs">▼</span>
              </button>
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-slate-700 shadow-xl rounded-2xl py-3 z-50
                  opacity-0 scale-95 transform transition duration-200 ease-in-out pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
              >
                <Link to="/products" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">Voice Datasets</Link>
                <Link to="/demo" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">Live Demo</Link>
                <Link to="/qr" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">QR Scanner</Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white font-medium hover:text-blue-400 transition-colors duration-300">
                <span>Resources</span>
                <span className="text-xs">▼</span>
              </button>
              <div
                className="absolute top-full left-0 mt-2 w-56 bg-[#1e293b] border border-slate-700 shadow-xl rounded-2xl py-3 z-50
                  opacity-0 scale-95 transform transition duration-200 ease-in-out pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
              >
                <Link to="/blogs" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">Blog</Link>
                <Link to="/contributor" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">Become a Contributor</Link>
                <Link to="/dashboard" className="block px-6 py-3 text-sm text-white hover:bg-slate-700">Dashboard</Link>
              </div>
            </div>

            <Link
              to="/contact"
              className="text-white hover:text-blue-400 font-medium transition-colors duration-300"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6 ml-8">
            <Link
              to="/auth/signin"
              className="text-white hover:text-blue-400 font-medium transition-colors duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-white hover:text-blue-400 rounded-xl hover:bg-slate-800 transition-all duration-200 ml-auto"
          >
            {!isMobileMenuOpen ? 'Menu' : 'Close'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#101729] backdrop-blur-xl border-t border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">
            <Link
              to="/about"
              className="block text-white hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div>
              <p className="font-semibold text-sm text-white mb-1">Products</p>
              <Link to="/products" className="block text-sm text-white hover:text-blue-400 py-1">Voice Datasets</Link>
              <Link to="/demo" className="block text-sm text-white hover:text-blue-400 py-1">Live Demo</Link>
              <Link to="/qr" className="block text-sm text-white hover:text-blue-400 py-1">QR Scanner</Link>
            </div>
            <div>
              <p className="font-semibold text-sm text-white mb-1">Resources</p>
              <Link to="/blogs" className="block text-sm text-white hover:text-blue-400 py-1">Blog</Link>
              <Link to="/contributor" className="block text-sm text-white hover:text-blue-400 py-1">Become a Contributor</Link>
              <Link to="/dashboard" className="block text-sm text-white hover:text-blue-400 py-1">Dashboard</Link>
            </div>
            <Link
              to="/contact"
              className="block text-white hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-6 border-t border-slate-700 space-y-6">
              <Link
                to="/auth/signin"
                className="block text-white hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
