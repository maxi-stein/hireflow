import { NavLink, Stack } from '@mantine/core';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { getNavItemsForUser, getAllRoutes, type RouteConfig } from '../../../router/routes.config';

export function SideNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const allRoutes = getAllRoutes();
  const currentRoute = allRoutes.find(route => matchPath({ path: route.path, end: true }, location.pathname));
  const activeSection = currentRoute?.section;

  // Get navigation items based on user type
  const navItems = getNavItemsForUser(user?.type ?? null);

  const isActive = (item: RouteConfig) => {
    // If item has a section, match against active section
    if (item.section && activeSection && item.section === activeSection) return true;

    // Fallback: match specific path (for items without section)
    if (activeSection) return false; // If we found a section, only match section

    // If no section found (e.g. dashboard), use direct path match
    return !!matchPath({ path: item.path, end: false }, location.pathname);
  };

  return (
    <Stack gap="xs">
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={item.icon}
            onClick={() => !item.children && navigate(item.path)}
            active={active}
            defaultOpened={active}
            variant="subtle"
          >
            {item.children?.filter(child => child.showInNav !== false).map((child) => (
              <NavLink
                key={child.path}
                label={child.label}
                onClick={() => navigate(child.path)}
                active={matchPath({ path: child.path, end: true }, location.pathname) !== null}
                variant="subtle"
              />
            ))}
          </NavLink>
        )
      })}
    </Stack>
  );
}
