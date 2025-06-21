import { useAuth } from "../../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, preserve the current location for after login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
