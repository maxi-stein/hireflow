import { Avatar, Menu, UnstyledButton, Text, Group, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSun, IconMoon, IconUser, IconLogout } from '@tabler/icons-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from 'react-i18next';

export function UserMenu() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, logout } = useAppStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) return null;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            {user.type === 'candidate' && (
              <Avatar src={null} alt="User" radius="xl" size={30} color="blue">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            )}
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>{user.email}</Text>
              <Text c="dimmed" size="xs" tt="capitalize">{user.type}</Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconUser size={14} />}
          onClick={() => navigate('/profile')}
        >
          {t('profile')}
        </Menu.Item>

        <Menu.Item
          leftSection={dark ? <IconSun size={14} /> : <IconMoon size={14} />}
          closeMenuOnClick={false}
          onClick={() => toggleColorScheme()}
        >
          {dark ? 'Light Mode' : 'Dark Mode'}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={handleLogout}
        >
          {t('logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
