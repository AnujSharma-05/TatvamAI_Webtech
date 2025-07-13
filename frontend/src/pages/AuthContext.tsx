import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "../config/axios.ts";

// Define the shape of the user object (customize this to match your backend response)
interface User {
  _id: string;
  name: string;
  email: string;
  // Add more fields as per your user model
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get("/users/current");
      setUser(response.data.data);
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth on mount only if token exists
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      checkAuth();
    }
  }, []);

  // Listen for storage changes (when user logs in/out)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        checkAuth();
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
