import { Menu, UnstyledButton, Text, Group, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconSun, IconMoon, IconUser, IconLogout } from '@tabler/icons-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/auth.service';
import { queryClient } from '../../services/queryClient';
import { useProfileQuery } from '../../hooks/api/useAuth';
import { CandidateAvatar } from './candidate-display/CandidateAvatar';

const capitalize = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export function UserMenu() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { user, logout } = useAppStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { data: profile } = useProfileQuery();

  const displayName = profile
    ? `${capitalize(profile.first_name)} ${capitalize(profile.last_name)}`
    : user?.email ?? '';

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      queryClient.clear();
      logout();
      navigate('/');
    }
  };

  if (!user) return null;

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap={7}>
            {user.type === 'candidate' && (
              <CandidateAvatar
                candidateId={user.id}
                firstName={profile?.first_name}
                lastName={profile?.last_name}
                alt="User"
                size={30}
              >
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </CandidateAvatar>
            )}
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500} c="white">{displayName}</Text>
              <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{user.email}</Text>
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
          {dark ? t('theme.light') : t('theme.dark')}
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
