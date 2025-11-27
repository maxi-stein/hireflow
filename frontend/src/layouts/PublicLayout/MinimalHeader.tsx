import { Group, Button, TextInput, useMantineColorScheme, Title, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserMenu } from '../../components/shared/UserMenu';

export function MinimalHeader() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Group justify="space-between" h="100%" px="md" py="xs">
      <Group gap="lg">
        <Title 
          order={3} 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          HireFlow
        </Title>
        
        <Group gap="xs">
          <TextInput 
            placeholder="Find Job Postings..." 
            leftSection={<IconSearch size={16} />}
            style={{ width: '1000px' }}
            radius="xl"
          />
        </Group>
      </Group>

      <Group>
        <Button
          variant="light"
          color={dark ? 'yellow' : 'blue'}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </Button>
        
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Button variant="subtle" onClick={handleLogin}>Login</Button>
            <Button onClick={handleRegister}>Register</Button>
          </>
        )}
      </Group>
    </Group>
  );
}
