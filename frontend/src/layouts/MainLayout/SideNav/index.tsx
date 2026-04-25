import { Stack, Title } from '@mantine/core';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { getNavItemsForUser, getAllRoutes, type RouteConfig } from '../../../router/routes.config';
import { StyledNavLink } from './styled';
import { useTranslation } from 'react-i18next';

interface SideNavProps {
  onNavigate?: () => void;
}

export function SideNav({ onNavigate }: SideNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation(['common', 'navigation']);

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

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.(); // Close mobile menu after navigation
  };

  return (
    <Stack gap="md" p="md" h="100%">
      <Title
        order={3}
        onClick={() => {
          if (!user) return navigate('/');
          return navigate(user.type === 'employee' ? '/manage/dashboard' : '/jobs');
        }}
        c="white"
        style={{ cursor: 'pointer', userSelect: 'none' }}
        px="xs"
      >
        HireFlow
      </Title>
      <Stack gap="xs">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <StyledNavLink
              key={item.path}
              label={item.label ? t(item.label) : ''}
              leftSection={item.icon}
              onClick={() => !item.children && handleNavigate(item.path)}
              active={active}
              defaultOpened={active}
              variant="subtle"
              c={active ? "white" : "blue.1"}
              style={{ transition: 'background-color 0.2s ease' }}
            >
              {item.children?.filter(child => child.showInNav !== false).map((child) => {
                const isChildActive = matchPath({ path: child.path, end: false }, location.pathname) !== null;

                return (
                  <StyledNavLink
                    key={child.path}
                    label={child.label ? t(child.label) : ''}
                    onClick={() => handleNavigate(child.path)}
                    active={isChildActive}
                    variant="subtle"
                    c={isChildActive ? "white" : "blue.2"}
                    style={{ transition: 'background-color 0.2s ease' }}
                  />
                );
              })}
            </StyledNavLink>
          )
        })}
      </Stack>
    </Stack>
  );
}
