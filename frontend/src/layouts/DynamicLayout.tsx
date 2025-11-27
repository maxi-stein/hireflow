import { useAppStore } from '../store/useAppStore';
import { MainLayout } from './MainLayout';
import { PublicLayout } from './PublicLayout';

/**
 * DynamicLayout automatically switches between MainLayout and PublicLayout
 * based on user authentication status.
 * 
 * - If user is logged in → renders MainLayout (with sidebar, full header, etc.)
 * - If user is NOT logged in → renders PublicLayout (minimal header)
 */
export function DynamicLayout() {
  const user = useAppStore((state) => state.user);

  return user ? <MainLayout /> : <PublicLayout />;
}
