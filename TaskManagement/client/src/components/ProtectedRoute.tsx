import { Navigate, useLocation } from "react-router";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading?: boolean;
  children: ReactNode;
  roles?: string[]; // Optional: If you need role-based access control
  userRole?: string; // Optional: The role of the current user
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  isLoading = false,
  children,
  roles,
  userRole,
}) => {
  const location = useLocation();

  // Show a loader while verifying authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Check for role-based access (if roles are provided)
  if (roles && !roles.includes(userRole || "")) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
