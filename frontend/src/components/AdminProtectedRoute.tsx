import { ReactElement, useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import axios from "../config/axios";
import { COLORS } from "@/config/theme";

interface AdminProtectedRouteProps {
  children: ReactElement;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!authenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/users/current");
        const user = response.data.data;
        setIsAdmin(user.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [authenticated]);

  if (!authenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  if (loading) {
    return (
      <div
        style={{ background: "transparent" }}
        className="min-h-screen flex items-center justify-center p-8"
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: COLORS.teaGreen }}
          ></div>
          <p style={{ color: COLORS.cadetGray }}>Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
