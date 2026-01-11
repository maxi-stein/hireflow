import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

export const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = useAppStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    // Pass the current location in state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    // User is logged in but doesn't have permission. Redirect to their dashboard.
    const redirectPath = user.type === 'candidate' ? '/jobs' : '/manage/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
