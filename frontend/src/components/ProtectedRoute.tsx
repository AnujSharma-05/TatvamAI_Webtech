import { ReactElement } from "react";
import { useAuth } from "../pages/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
