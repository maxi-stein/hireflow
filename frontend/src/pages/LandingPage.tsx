import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const LandingPage = () => {
  const user = useAppStore((state) => state.user);

  if (user?.type === 'employee') {
    return <Navigate to="/manage/dashboard" replace />;
  }

  return <div>LandingPage</div>;
};
