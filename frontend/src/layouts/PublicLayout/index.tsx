import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { MinimalHeader } from './MinimalHeader';
import { Footer } from './Footer';

export function PublicLayout() {
  console.log('PublicLayout!');
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <MinimalHeader />
      </AppShell.Header>

      <AppShell.Main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}
