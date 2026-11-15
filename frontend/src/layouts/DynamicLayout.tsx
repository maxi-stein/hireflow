import { useAppStore } from '../store/useAppStore';
import { MainLayout } from './MainLayout';
import { PublicLayout } from './PublicLayout';


export function DynamicLayout() {
  const user = useAppStore((state) => state.user);

  // If authenticated, MainLayout. Else, PublicLayout
  return user ? <MainLayout /> : <PublicLayout />;
}
