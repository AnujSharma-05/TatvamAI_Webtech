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

  // Helper to handle dropdown open/close
  const handleDropdown = (setter: (v: boolean) => void, value: boolean) => {
    setter(value);
  };

  return (
    <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 ${
      isScrolled
        ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg dark:bg-slate-900/95 dark:border-slate-700'
        : 'bg-white/80 backdrop-blur-lg border-b border-slate-100 dark:bg-slate-900/80 dark:border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center hover:scale-105 transition-transform duration-300 mr-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TatvamAI
            </span>
          </Link>

          {/* Centered Navigation */}
          <div className="flex-1 hidden lg:flex items-center justify-center space-x-8">
            <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300">
              About
            </Link>
            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleDropdown(setIsProductsDropdownOpen, true)}
              onMouseLeave={() => handleDropdown(setIsProductsDropdownOpen, false)}
            >
              <button
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 flex items-center space-x-1"
                aria-haspopup="true"
                aria-expanded={isProductsDropdownOpen}
                tabIndex={0}
              >
                <span>Products</span>
                <span className="text-xs">▼</span>
              </button>
              {isProductsDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl py-3 z-50 dark:bg-slate-800/95 dark:border-slate-700"
                  onMouseEnter={() => handleDropdown(setIsProductsDropdownOpen, true)}
                  onMouseLeave={() => handleDropdown(setIsProductsDropdownOpen, false)}
                >
                  <Link to="/products" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Voice Datasets
                  </Link>
                  <Link to="/demo" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Live Demo
                  </Link>
                  <Link to="/qr" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    QR Scanner
                  </Link>
                </div>
              )}
            </div>
            {/* Resources Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => handleDropdown(setIsResourcesDropdownOpen, true)}
              onMouseLeave={() => handleDropdown(setIsResourcesDropdownOpen, false)}
            >
              <button
                className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 flex items-center space-x-1"
                aria-haspopup="true"
                aria-expanded={isResourcesDropdownOpen}
                tabIndex={0}
              >
                <span>Resources</span>
                <span className="text-xs">▼</span>
              </button>
              {isResourcesDropdownOpen && (
                <div
                  className="absolute top-full left-0 mt-3 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl py-3 z-50 dark:bg-slate-800/95 dark:border-slate-700"
                  onMouseEnter={() => handleDropdown(setIsResourcesDropdownOpen, true)}
                  onMouseLeave={() => handleDropdown(setIsResourcesDropdownOpen, false)}
                >
                  <Link to="/blogs" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Blog
                  </Link>
                  <Link to="/contributor" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
                    Become a Contributor
                  </Link>
                  <Link to="/dashboard" className="block px-6 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-blue-400">
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
          <div className="hidden lg:flex items-center space-x-6 ml-8">
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
            className="lg:hidden p-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ml-auto"
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
            <div>
              <p className="font-semibold text-sm text-foreground mb-1">Products</p>
              <Link to="/products" className="block text-sm text-muted-foreground">Voice Datasets</Link>
              <Link to="/demo" className="block text-sm text-muted-foreground">Live Demo</Link>
              <Link to="/qr" className="block text-sm text-muted-foreground">QR Scanner</Link>
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground mb-1">Resources</p>
              <Link to="/blogs" className="block text-sm text-muted-foreground">Blog</Link>
              <Link to="/contributor" className="block text-sm text-muted-foreground">Become a Contributor</Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground">Dashboard</Link>
            </div>
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