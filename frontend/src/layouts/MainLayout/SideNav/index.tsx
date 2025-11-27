import { NavLink, Stack } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { getNavItemsForUser } from '../../../router/routes.config';

export function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const active = location.pathname;

  // Get navigation items based on user type
  const navItems = getNavItemsForUser(user?.type ?? null);

  return (
    <Stack gap="xs">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          label={item.label}
          leftSection={item.icon}
          onClick={() => navigate(item.path)}
          active={active === item.path}
          variant="light"
        />
      ))}
    </Stack>
  );
}
