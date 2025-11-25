import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
