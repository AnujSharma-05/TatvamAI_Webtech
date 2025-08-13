import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * This component automatically scrolls to the top of the page
 * whenever the route changes. It should be placed inside the Router
 * but outside of the Routes component.
 */
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // Optional: smooth scrolling animation
    });
  }, [location.pathname]); // Dependency array includes pathname to trigger on route change

  // This component doesn't render anything
  return null;
};

export default ScrollToTop;
