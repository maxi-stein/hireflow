import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { FullHeader } from './FullHeader';
import { SideNav } from './SideNav';

import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function MainLayout() {
  const [opened, { toggle, close }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <HeaderContainer>
        <FullHeader opened={opened} toggle={toggle} />
      </HeaderContainer>

      <AppShell.Navbar p="md">
        <SideNav onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
