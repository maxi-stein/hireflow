import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = useAppStore((state) => state.user);
  const location = useLocation();

  if (!user || !allowedRoles.includes(user.type)) {
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
