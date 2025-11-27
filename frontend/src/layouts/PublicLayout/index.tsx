import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MinimalHeader } from './MinimalHeader';
import { Footer } from './Footer';

import { HeaderContainer } from '../../components/shared/HeaderContainer';

export function PublicLayout() {
  console.log('PublicLayout!');
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <HeaderContainer>
        <MinimalHeader />
      </HeaderContainer>

      <AppShell.Main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
