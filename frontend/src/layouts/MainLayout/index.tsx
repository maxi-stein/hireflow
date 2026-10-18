import { AppShell, useComputedColorScheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MainHeader } from './MainHeader';
import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function MainLayout() {
  const computedColorScheme = useComputedColorScheme('light');

  return (
    <AppShell
      header={{ height: 64 }}
      bg={computedColorScheme === 'dark' ? '#0b1120' : '#f8fafc'}
      styles={{
        header: {
          backgroundColor: 'light-dark(#112240, rgb(24, 24, 24))'
        },
        main: {
          width: '100%',
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
