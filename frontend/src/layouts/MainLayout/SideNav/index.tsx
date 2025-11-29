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
          onClick={() => !item.children && navigate(item.path)}
          active={item.children ? undefined : active === item.path}
          defaultOpened={item.children ? item.children.some(child => child.path === active) : undefined}
          variant="light"
        >
          {item.children?.map((child) => (
            <NavLink
              key={child.path}
              label={child.label}
              onClick={() => navigate(child.path)}
              active={active === child.path}
              variant="light"
            />
          ))}
        </NavLink>
      ))}
    </Stack>
  );
}
