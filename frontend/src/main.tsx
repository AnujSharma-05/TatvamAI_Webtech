import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './App.css';
import { AuthProvider } from './pages/AuthContext'; // adjust path if needed

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
