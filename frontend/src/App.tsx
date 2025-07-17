import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import Home from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Dashboard from './pages/Dashboard';
import QR from './pages/QR';
import Demo from './pages/Demo';
import Contributor from './pages/Contributor';
import SignInPage from './pages/auth/signin/SignIn';
import SignUpPage from './pages/auth/signup/SignUp';
import Recording from './pages/CrowdSourceRecording';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound'; // Optional 404
import Profile from './pages/Profile'; // Create this page if not present
import FAQ from './pages/FAQs';
import Documentation from './pages/Documentation';
import Careers from './pages/Careers';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/careers" element={<Careers />} />

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
              path="/contributor"
              element={
                <ProtectedRoute>
                  <Contributor />
                </ProtectedRoute>
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
