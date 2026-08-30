import {
  Group,
  Menu,
  Text,
  Title,
  Divider,
  Burger,
  Drawer,
  ScrollArea,
  Container,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';
import { useLocation, useNavigate, matchPath } from 'react-router-dom';
import { IconChevronDown } from '@tabler/icons-react';
import { useAppStore } from '../../store/useAppStore';
import { getNavItemsForUser, getAllRoutes, type RouteConfig } from '../../router/routes.config';
import { useTranslation } from 'react-i18next';
import { UserMenu } from '../../components/shared/UserMenu';
import { LanguageSelector } from '../../components/shared/LanguageSelector';
import { SideNav } from './SideNav';
import { NavButton } from './MainHeader.styled';

export function MainHeader() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const isMobile = useMediaQuery('(max-width: 1885px)');

  useEffect(() => {
    if (!isMobile && drawerOpened) {
      closeDrawer();
    }
  }, [isMobile, drawerOpened, closeDrawer]);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation(['common', 'navigation']);

  const allRoutes = getAllRoutes();
  const currentRoute = allRoutes.find((r) =>
    matchPath({ path: r.path, end: true }, location.pathname)
  );
  const activeSection = currentRoute?.section;

  const navItems = getNavItemsForUser(user?.type ?? null);

  const isActive = (item: RouteConfig): boolean => {
    if (item.section && activeSection && item.section === activeSection) return true;
    if (activeSection) return false;
    return !!matchPath({ path: item.path, end: false }, location.pathname);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  const handleLogoClick = () => {
    if (!user) return navigate('/');
    navigate(user.type === 'employee' ? '/manage/dashboard' : '/jobs');
  };

  return (
    <>
      <Container fluid h="100%" px="md" mx={isMobile ? 0 : 190} >
        <Group h="100%" justify="space-between" wrap="nowrap">
          {/* ── Left: burger (mobile) + logo + nav items ── */}
          <Group gap={4} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {/* Burger — only on mobile */}
            {isMobile && (
              <Burger
                opened={drawerOpened}
                onClick={toggleDrawer}
                size="sm"
                color="white"
                mr={4}
              />
            )}

            <Title
              order={4}
              c="white"
              mr="lg"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}
            >
              Consultoría Global
            </Title>

            {/* Nav items — hidden on mobile */}
            {!isMobile && (
              <Group gap={4} wrap="nowrap">
                {navItems.map((item) => {
                  const active = isActive(item);
                  const visibleChildren = item.children?.filter((c) => c.showInNav !== false) ?? [];
                  const hasChildren = visibleChildren.length > 0;

                  if (hasChildren) {
                    return (
                      <Menu
                        key={item.path}
                        trigger="hover"
                        openDelay={60}
                        closeDelay={180}
                        withinPortal
                        shadow="md"
                        radius="md"
                        offset={4}
                      >
                        <Menu.Target>
                          <NavButton $active={active}>
                            {item.icon}
                            <Text size="sm" fw={active ? 600 : 400} c="inherit" component="span">
                              {item.label ? t(item.label) : ''}
                            </Text>
                            <IconChevronDown size={13} style={{ opacity: 0.75, marginLeft: 2 }} />
                          </NavButton>
                        </Menu.Target>

                        <Menu.Dropdown>
                          {visibleChildren.map((child) => {
                            const childActive =
                              matchPath({ path: child.path, end: true }, location.pathname) !== null;
                            return (
                              <Menu.Item
                                key={child.path}
                                onClick={() => handleNavigate(child.path)}
                                fw={childActive ? 600 : 400}
                                bg={childActive ? 'var(--mantine-color-blue-7)' : undefined}
                                c={childActive ? 'white' : undefined}
                                leftSection={child.icon}
                              >
                                {child.label ? t(child.label) : ''}
                              </Menu.Item>
                            );
                          })}
                        </Menu.Dropdown>
                      </Menu>
                    );
                  }

                  // Simple item (no children)
                  return (
                    <NavButton
                      key={item.path}
                      $active={active}
                      onClick={() => handleNavigate(item.path)}
                    >
                      {item.icon}
                      <Text size="sm" fw={active ? 600 : 400} c="inherit" component="span">
                        {item.label ? t(item.label) : ''}
                      </Text>
                    </NavButton>
                  );
                })}
              </Group>
            )}
          </Group>

          {/* ── Right: language + user ── */}
          <Group gap="md" wrap="nowrap">
            <LanguageSelector />
            <Divider orientation="vertical" h={20} my="auto" opacity={0.4} />
            <UserMenu />
          </Group>
        </Group>
      </Container>

      {/* ── Mobile Drawer ── */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="xs"
        padding={0}
        withCloseButton={false}
        styles={{
          content: { backgroundColor: '#112240' },
          body: { padding: 0, height: '100%' },
        }}
      >
        <ScrollArea h="100%">
          <SideNav onNavigate={closeDrawer} />
        </ScrollArea>
      </Drawer>
    </>
  );
}
