"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container-premium">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="heading-sm font-light gradient-text">
              TatvamAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-12">
            <Link href="/about" className="body-sm text-gray-600 hover:text-black transition-colors duration-300">
              About
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsDropdownOpen(true)}
                onMouseLeave={() => setIsProductsDropdownOpen(false)}
                className="body-sm text-gray-600 hover:text-black transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Products</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isProductsDropdownOpen && (
                <div
                  onMouseEnter={() => setIsProductsDropdownOpen(true)}
                  onMouseLeave={() => setIsProductsDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-lg py-4 z-50"
                >
                  <Link href="/products" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Voice Datasets
                  </Link>
                  <Link href="/demo" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Live Demo
                  </Link>
                  <Link href="/qr" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
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
                className="body-sm text-gray-600 hover:text-black transition-colors duration-300 flex items-center space-x-1"
              >
                <span>Resources</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isResourcesDropdownOpen && (
                <div
                  onMouseEnter={() => setIsResourcesDropdownOpen(true)}
                  onMouseLeave={() => setIsResourcesDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 shadow-lg py-4 z-50"
                >
                  <Link href="/blogs" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Blog
                  </Link>
                  <Link href="/contributor" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Become a Contributor
                  </Link>
                  <Link href="/dashboard" className="block px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Dashboard
                  </Link>
                </div>
              )}
            </div>

            <Link href="/contact" className="body-sm text-gray-600 hover:text-black transition-colors duration-300">
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/auth/signin" className="body-sm text-gray-600 hover:text-black transition-colors duration-300">
              Sign In
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-black transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {!isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <div className="container-premium py-6 space-y-4">
            <Link
              href="/about"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/products"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/demo"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <Link
              href="/blogs"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/contributor"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Become a Contributor
            </Link>
            <Link
              href="/contact"
              className="block body-sm text-gray-600 hover:text-black transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <Link
                href="/auth/signin"
                className="block body-sm text-gray-600 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary inline-block"
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
} 