import { Group, Burger, Divider } from '@mantine/core';
import { UserMenu } from '../../components/shared/UserMenu';
import { LanguageSelector } from '../../components/shared/LanguageSelector';

interface FullHeaderProps {
  opened: boolean;
  toggle: () => void;
}

export function FullHeader({ opened, toggle }: FullHeaderProps) {

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <div style={{ flex: 1 }} />
      <Group gap="md">
        <LanguageSelector />
        <Divider orientation="vertical" h={20} my="auto" opacity={0.6} />
        <UserMenu />
      </Group>
    </Group>
  );
}
