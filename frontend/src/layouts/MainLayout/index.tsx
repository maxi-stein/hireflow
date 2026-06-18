import { AppShell, useComputedColorScheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function MainLayout() {
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <AppShell
      header={{ height: 64 }}
      padding="md"
      bg={computedColorScheme === 'dark' ? 'dark.8' : 'gray.2'}
      styles={{
        header: {
          backgroundColor: 'light-dark(#112240, rgb(24, 24, 24))',
          borderBottom: 'none',
        },
      }}
    >
      <HeaderContainer>
        <MainHeader />
      </HeaderContainer>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
