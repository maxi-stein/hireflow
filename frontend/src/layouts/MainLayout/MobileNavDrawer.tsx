import { Drawer, ScrollArea } from '@mantine/core';
import { SideNav } from './SideNav';

interface MobileNavDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ opened, onClose }: MobileNavDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="xs"
      padding={0}
      withCloseButton={false}
      styles={{
        content: { backgroundColor: '#112240' },
        body: { padding: 0, height: '100%' },
      }}
    >
      <ScrollArea h="100%">
        <SideNav onNavigate={onClose} />
      </ScrollArea>
    </Drawer>
  );
}

