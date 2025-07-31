import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // 1. Import useLocation
import { FaCoins } from "react-icons/fa";
import { isAuthenticated, logout } from "../utils/auth";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 2. Get the current location object

  const COLORS = {
    midnightGreen: "#003642",
    teaGreen: "#d0e6a5",
    lightYellow: "#ffffe3",
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await fetch(
            "https://tatvamai-webtech.onrender.com/api/v1/users/current",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.ok) {
            const userData = await response.json();
            setUser({
              name: userData.data.name,
              tokens: userData.data.rewardTokens || 0,
            });
          } else {
            setUser({ name: "User", tokens: 0 });
          }
        } catch (error) {
          setUser({ name: "User", tokens: 0 });
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Only check scroll if not on the homepage
      if (location.pathname !== '/') {
        setIsScrolled(window.scrollY > 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]); // Re-run effect if path changes

  const navLinkClasses = "text-white font-medium hover:text-opacity-80 transition-opacity duration-300";
  const dropdownLinkClasses = "block px-4 py-2 text-white hover:bg-opacity-10 hover:bg-white rounded-md";

  // 3. Conditional Rendering Logic
  // If the current path is the homepage, render nothing.
  if (location.pathname === "/") {
    return null;
  }

  // Otherwise, render the full navbar.
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-opacity-100 shadow-lg" : "bg-opacity-0"
      }`}
      // When not scrolled, the navbar is transparent.
      // We set an explicit background color when scrolled.
      style={{ backgroundColor: isScrolled ? COLORS.midnightGreen : "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TatvamAI Logo" className="w-9 h-9" />
              <span className="text-xl font-bold text-white">TatvamAI</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex lg:justify-center lg:flex-1 lg:space-x-8">
            <Link to="/about" className={navLinkClasses}>About</Link>
            
            <div className="relative group">
              <button className={`${navLinkClasses} flex items-center`}>
                Products <span className="ml-1 text-xs">▼</span>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <Link to="/products" className={dropdownLinkClasses}>Our Models</Link>
                <Link to="/qr" className={dropdownLinkClasses}>DhvaniShilp</Link>
              </div>
            </div>

            <div className="relative group">
              <button className={`${navLinkClasses} flex items-center`}>
                Resources <span className="ml-1 text-xs">▼</span>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                <Link to="/blogs" className={dropdownLinkClasses}>Blog</Link>
                <Link to="/qr-recording" className={dropdownLinkClasses}>Become a Contributor</Link>
                <Link to="/dashboard" className={dropdownLinkClasses}>Dashboard</Link>
              </div>
            </div>

            <Link to="/contact" className={navLinkClasses}>Contact</Link>
          </div>

          {/* User Actions & Mobile Menu Button */}
          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link to="/auth/signin" className={navLinkClasses}>Sign In</Link>
                  <Link to="/auth/signup" className="px-5 py-2 text-base font-medium text-black bg-white rounded-full hover:bg-opacity-90 transition-colors">
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-yellow-400 font-bold">
                    <FaCoins className="mr-1.5" />
                    <span>{user.tokens || 0}</span>
                  </div>
                  <button onClick={() => navigate("/profile")} className={`${navLinkClasses} flex items-center`}>
                    {user.name}
                  </button>
                  <button onClick={() => { logout(); setUser(null); }} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              )}
            </div>

            <div className="lg:hidden ml-4">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-white hover:bg-gray-700">
                {isMobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 bg-opacity-95 backdrop-blur-lg absolute top-20 left-0 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-white">About</Link>
            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Products</h3>
              <div className="mt-2 space-y-1">
                <Link to="/products" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">Our Models</Link>
                <Link to="/qr" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">DhvaniShilp</Link>
              </div>
            </div>
            <div className="px-3 py-2">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resources</h3>
              <div className="mt-2 space-y-1">
                <Link to="/blogs" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">Blog</Link>
                <Link to="/qr-recording" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">Become a Contributor</Link>
                <Link to="/dashboard" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white rounded-md">Dashboard</Link>
              </div>
            </div>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-white">Contact</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {!user ? (
              <div className="px-2 space-y-2">
                 <Link to="/auth/signup" className="block w-full text-center px-4 py-2 text-base font-medium text-black bg-white rounded-full hover:bg-opacity-90">
                    Get Started
                  </Link>
                <Link to="/auth/signin" className="block w-full text-center px-4 py-2 text-base font-medium text-white hover:bg-gray-700 rounded-full">Sign In</Link>
              </div>
            ) : (
              <div className="px-5">
                <p className="text-base font-medium text-white">{user.name}</p>
                <div className="flex items-center text-sm text-yellow-400 font-bold mt-1">
                  <FaCoins className="mr-1.5" />
                  <span>{user.tokens || 0}</span>
                </div>
                <button onClick={() => { logout(); setUser(null); setIsMobileMenuOpen(false); }} className="mt-3 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};