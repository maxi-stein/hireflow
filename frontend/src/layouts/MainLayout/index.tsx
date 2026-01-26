import { AppShell, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import { FullHeader } from './FullHeader';
import { SideNav } from './SideNav';

import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function MainLayout() {
  const [opened, { toggle, close }] = useDisclosure();
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <AppShell
      header={{ height: 60 }}
      layout='alt'
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      bg={computedColorScheme === 'dark' ? 'dark.8' : 'gray.2'}
    >
      <HeaderContainer>
        <FullHeader opened={opened} toggle={toggle} />
      </HeaderContainer>

      <AppShell.Navbar
        style={{
          backgroundColor: 'light-dark(#112240, rgb(24 24 24))',
          borderRight: 'none',
        }}
      >
        <SideNav onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
