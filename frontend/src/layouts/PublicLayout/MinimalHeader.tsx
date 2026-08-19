import { Group, Container, Button } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { UserMenu } from '../../components/shared/UserMenu';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { LogoButton } from '../../components/shared/LogoButton.styled';
import { AppLogo } from '../../components/shared/AppLogo';

export function MinimalHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation('common');

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const isLandingPage = location.pathname === '/';

  const content = (
    <Group justify="space-between" h="100%" px={isLandingPage ? 0 : 'md'} py={4} w="100%" wrap="nowrap">
      <Group gap="lg" wrap="nowrap">
        <LogoButton
          onClick={() => {
            if (!user) return navigate('/');
            return navigate(user.type === 'employee' ? '/manage/dashboard' : '/jobs');
          }}
        >
          {isLandingPage && (
            <AppLogo />
          )}
        </LogoButton>
      </Group>

      <Group>
        {user ? (
          <UserMenu />
        ) : (
          <>
            <Button variant="subtle" onClick={handleLogin}>{t('login')}</Button>
            <Button onClick={handleRegister}>{t('register')}</Button>
          </>
        )}
      </Group>
    </Group>
  );

  if (isLandingPage) {
    return (
      <Container size={APP_MAX_WIDTH} h="100%">
        {content}
      </Container>
    );
  }

  return content;
}
