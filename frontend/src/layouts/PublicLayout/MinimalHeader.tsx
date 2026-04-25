import { Group, Button, Title, Container } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { UserMenu } from '../../components/shared/UserMenu';
import { LANDING_MAX_WIDTH } from '../../pages/LandingPage';

export function MinimalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const isLandingPage = location.pathname === '/';

  const content = (
    <Group justify="space-between" h="100%" px={isLandingPage ? 0 : 'md'} py="xs">
      <Group gap="lg">
        <Title
          order={3}
          onClick={() => {
            if (!user) return navigate('/');
            return navigate(user.type === 'employee' ? '/manage/dashboard' : '/jobs');
          }}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          HireFlow
        </Title>

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

  if (isLandingPage) {
    return (
      <Container size={LANDING_MAX_WIDTH} h="100%">
        {content}
      </Container>
    );
  }

  return content;
}
