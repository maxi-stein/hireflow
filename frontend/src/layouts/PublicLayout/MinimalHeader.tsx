import { Group, Button, TextInput, Title, Text } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserMenu } from '../../components/shared/UserMenu';

export function MinimalHeader() {
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
          <Text size="sm" fw={500} c="dimmed">Explore</Text>
          <TextInput 
            placeholder="Find Job Postings..." 
            leftSection={<IconSearch size={16} />}
            style={{ width: '400px' }}
            radius="xl"
          />
        </Group>
      </Group>

      <Group>
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
