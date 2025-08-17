import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaCoins } from "react-icons/fa";
import { isAuthenticated, logout } from "../utils/auth";
import { COLORS } from "../config/theme";
import axios from "../config/axios";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await axios.get("/users/current");
          const userData = response.data;
          setUser({
            name: userData.data.name,
            tokens: userData.data.rewardTokens || 0,
            role: userData.data.role || "user",
          });
        } catch (error) {
          setUser({ name: "User", tokens: 0, role: "user" });
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    // Listen for storage changes from other tabs
    window.addEventListener("storage", checkAuth);

    // Listen for custom authentication events (for same-tab updates)
    window.addEventListener("authStateChanged", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authStateChanged", checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== "/") {
        setIsScrolled(window.scrollY > 10);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const navLinkClasses =
    "text-white font-medium hover:text-opacity-80 transition-opacity duration-300";
  const dropdownLinkClasses =
    "block px-4 py-2 text-white hover:bg-opacity-10 hover:bg-white rounded-md";

  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-opacity-100 shadow-lg" : "bg-opacity-0"
      }`}
      style={{
        backgroundColor: isScrolled ? COLORS.midnightGreen : "transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">TatvamAI</span>
            </Link>
          </div>

          <div className="hidden lg:flex lg:justify-center lg:flex-1 lg:space-x-8">
            <Link to="/about-tatvam" className={navLinkClasses}>
              About
            </Link>
            <Link to="/products" className={navLinkClasses}>
              Our Products
            </Link>
            <Link to="/careers" className={navLinkClasses}>
              Careers
            </Link>
            <Link to="/contact" className={navLinkClasses}>
              Contact
            </Link>
          </div>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link to="/auth/signin" className={navLinkClasses}>
                    Sign In
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="px-5 py-2 text-base font-medium text-black bg-white rounded-full hover:bg-opacity-90 transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* --- DASHBOARD LINK ADDED FOR LOGGED-IN USERS (DESKTOP) --- */}
                  <Link to="/dashboard" className={navLinkClasses}>
                    Dashboard
                  </Link>
                  {/* --- ADMIN DASHBOARD LINK FOR ADMIN USERS (DESKTOP) --- */}
                  {user.role === "admin" && (
                    <Link to="/admin" className={navLinkClasses}>
                      Admin
                    </Link>
                  )}
                  <div className="flex items-center text-yellow-400 font-bold">
                    <FaCoins className="mr-1.5" />
                    <span>{user.tokens || 0}</span>
                  </div>
                  <button
                    onClick={() => navigate("/profile")}
                    className={`${navLinkClasses} flex items-center`}
                  >
                    {user.name}
                  </button>
                  {/* <button onClick={() => { logout(); setUser(null); }} className="text-sm text-gray-400 hover:text-white transition-colors">
                    Logout
                  </button> */}
                </div>
              )}
            </div>

            <div className="lg:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white hover:bg-gray-700"
              >
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 bg-opacity-95 backdrop-blur-lg absolute top-20 left-0 w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/about-tatvam"
              className="block px-3 py-2 rounded-md text-base font-medium text-white"
            >
              About
            </Link>
            <Link
              to="/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-white"
            >
              Our Products
            </Link>
            <Link
              to="/careers"
              className="block px-3 py-2 rounded-md text-base font-medium text-white"
            >
              Careers
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium text-white"
            >
              Contact
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {!user ? (
              <div className="px-2 space-y-2">
                <Link
                  to="/auth/signup"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-black bg-white rounded-full hover:bg-opacity-90"
                >
                  Get Started
                </Link>
                <Link
                  to="/auth/signin"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-white hover:bg-gray-700 rounded-full"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="px-5">
                <p className="text-base font-medium text-white">{user.name}</p>
                <div className="flex items-center text-sm text-yellow-400 font-bold mt-1">
                  <FaCoins className="mr-1.5" />
                  <span>{user.tokens || 0}</span>
                </div>
                {/* --- DASHBOARD LINK ADDED FOR LOGGED-IN USERS (MOBILE) --- */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-3 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                {/* --- ADMIN DASHBOARD LINK FOR ADMIN USERS (MOBILE) --- */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-3 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setUser(null);
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-3 w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
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
