import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg dark:bg-slate-900/95 dark:border-slate-700' 
        : 'bg-white/80 backdrop-blur-lg border-b border-slate-100 dark:bg-slate-900/80 dark:border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TatvamAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
              About
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Products</span>
                <span className="text-xs">▼</span>
              </button>
              {isProductsDropdownOpen && (
                <div
                  onMouseEnter={() => setIsProductsDropdownOpen(true)}
                  onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl py-3 z-50 animate-in slide-in-from-top-2 duration-200 dark:bg-slate-800/95 dark:border-slate-700"
                >
                  <Link to="/products" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Voice Datasets
                  </Link>
                  <Link to="/demo" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Live Demo
                  </Link>
                  <Link to="/qr" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    QR Scanner
                  </Link>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Resources</span>
                <span className="text-xs">▼</span>
              </button>
              {isResourcesDropdownOpen && (
                <div
                  onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                  onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl py-3 z-50 animate-in slide-in-from-top-2 duration-200 dark:bg-slate-800/95 dark:border-slate-700"
                >
                  <Link to="/blogs" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Blog
                  </Link>
                  <Link to="/contributor" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Become a Contributor
                  </Link>
                  <Link to="/dashboard" className="block px-6 py-4 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Dashboard
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/auth/signin" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
              Sign In
            </Link>
            <Link to="/auth/signup" className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          >
            {!isMobileMenuOpen ? 'Menu' : 'Close'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200 dark:bg-slate-900/95 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 space-y-6">
            <Link
              to="/about"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/products"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/demo"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              to="/blogs"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contributor"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Contributor
            </Link>
            <Link
              to="/contact"
              className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
              <Link
                to="/auth/signin"
                className="block text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 text-lg transition-colors duration-300"
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