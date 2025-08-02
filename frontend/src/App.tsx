import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import DhvaniShilp from "./pages/DhvaniShilp";
import About from "./components/AboutDhvaniShilpContent";
import Contact from "./pages/Contact";
import Blogs from "./pages/Blogs";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QR from "./pages/QR";
import Demo from "./pages/Demo";

import ProductsPage from "./pages/ProductsPage";

import Home from "./pages/Home";

// import Contributor from './pages/Contributor';
import SignInPage from "./pages/auth/signin/SignIn";
import SignUpPage from "./pages/auth/signup/SignUp";
import Recording from "./pages/CrowdSourceRecording";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQs";
import Documentation from "./pages/Documentation";
import Careers from "./pages/Careers";

import CustomCursor from "./components/CustomCursor";
import AnimatedBlobBackground from "./components/Blobbg";

import AboutTatvamPage from "./pages/AboutTatvam";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-background hide-default-cursor  "
        style={{ backgroundColor: "#003642" }}
      >
        <CustomCursor />
        <Navbar />
        <AnimatedBlobBackground />

        {/* --- Main Application Routes --- */}

        <main>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/dhvani-shilp" element={<DhvaniShilp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/about-tatvam" element={<AboutTatvamPage />} />

            {/* 🔐 Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/qr"
              element={
                <ProtectedRoute>
                  <QR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/qr-recording"
              element={
                <ProtectedRoute>
                  <Recording />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 🛂 Auth Routes with Layout */}
            <Route path="/auth" element={<Auth />}>
              <Route path="signin" element={<SignInPage />} />
              <Route path="signup" element={<SignUpPage />} />
            </Route>

            {/* 🔚 Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
