import { AppShell } from '@mantine/core';
import type { ReactNode } from 'react';

interface HeaderContainerProps {
  children: ReactNode;
}

export function HeaderContainer({ children }: HeaderContainerProps) {
  return (
    <AppShell.Header
      withBorder={false}
      style={{ 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        zIndex: 100 
      }}
    >
      {children}
    </AppShell.Header>
  );
}
