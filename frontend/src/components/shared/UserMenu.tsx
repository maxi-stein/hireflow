import { Avatar, Menu, UnstyledButton, Text, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAppStore();

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
            <Avatar src={null} alt="User" radius="xl" size={30} color="blue">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>{user.email}</Text>
              <Text c="dimmed" size="xs" tt="capitalize">{user.type}</Text>
            </div>
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item onClick={() => navigate('/profile')}>Profile</Menu.Item>
        <Menu.Item onClick={() => navigate('/settings')}>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="red" onClick={handleLogout}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
