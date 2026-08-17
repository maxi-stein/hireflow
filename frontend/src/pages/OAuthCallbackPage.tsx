import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Center, Loader, Text, Stack } from '@mantine/core';
import { useAppStore } from '../store/useAppStore';
import { authService } from '../services/auth.service';
import type { JwtUser } from '../types/api/auth.types';

export const OAuthCallbackPage = () => {
  const { t } = useTranslation('common');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, setToken } = useAppStore();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }

    const authenticate = async () => {
      try {
        // We set the token temporarily so apiClient sends it
        setToken(accessToken);
        
        // Fetch the user profile using the new token
        const user = await authService.getProfile();
        
        const jwtUser: JwtUser = {
          id: user.employee?.id || user.candidate?.id || user.id,
          email: user.email,
          type: user.user_type,
          employee_roles: user.employee?.roles,
        };

        // Fully log the user in
        setAuth(jwtUser, accessToken);

        // Redirect based on role
        if (jwtUser.type === 'employee') {
          navigate('/manage/dashboard', { replace: true });
        } else {
          navigate('/jobs', { replace: true });
        }
      } catch (error) {
        console.error('Failed to fetch profile during OAuth callback:', error);
        // Clear token on failure
        useAppStore.getState().logout();
        navigate('/login', { replace: true });
      }
    };

    authenticate();
  }, [searchParams, navigate, setAuth, setToken]);

  return (
    <Center h="100vh">
      <Stack align="center">
        <Loader size="lg" />
        <Text size="lg" fw={500}>{t('loginForm.completingAuth')}</Text>
      </Stack>
    </Center>
  );
};
