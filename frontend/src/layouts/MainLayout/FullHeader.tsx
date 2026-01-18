import { Group, Burger } from '@mantine/core';
import { UserMenu } from '../../components/shared/UserMenu';

interface FullHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function FullHeader({ opened, toggle }: FullHeaderProps) {

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <div style={{ flex: 1 }} />
      <UserMenu />
    </Group>
  );
}
