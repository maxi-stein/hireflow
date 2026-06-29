import { AppShell, useComputedColorScheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function MainLayout() {
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <AppShell
      header={{ height: 64 }}
      bg={computedColorScheme === 'dark' ? 'dark.8' : 'oklch(99% .005 240)'}
      styles={{
        header: {
          backgroundColor: 'light-dark(#112240, rgb(24, 24, 24))',
          borderBottom: 'none',
        },
        main: {
          width: '100%',
          maxWidth: '1340px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }
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
