import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
