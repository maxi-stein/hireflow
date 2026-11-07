import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Box, Button, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { ROUTES } from '../router/routes.config';
import { AppLogo } from '../components/shared/AppLogo';
import { RegisterShowcaseBanner } from '../components/auth/RegisterShowcaseBanner';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation('common');

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    return (
      <Navigate
        to={user.type === 'candidate' ? ROUTES.COMMON.PROFILE.path : ROUTES.EMPLOYEE.DASHBOARD.path}
        replace
      />
    );
  }

  return (
      <Box
        style={{
          display: 'flex',
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: 'light-dark(#f8fafc, #0b0f19)',
          overflow: 'hidden',
        }}
      >
        {/* Left Column (50% on desktop, hidden on mobile) */}
          <RegisterShowcaseBanner />

        {/* Right Column (50% on desktop, 100% on mobile) */}
        <Box
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2.5rem 1.5rem',
            position: 'relative',
            backgroundColor: 'light-dark(#ffffff, #0f172a)',
            overflowY: 'auto',
          }}
        >
          {/* Mobile top logo and back */}
          <Box display={{ base: 'block', md: 'none' }} w="100%" maw={460} mb="xl">
            <Group justify="space-between">
              <AppLogo h={32} />
              <Button
                variant="subtle"
                size="xs"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/')}
              >
                {t('registerPage.backToHome', 'Inicio')}
              </Button>
            </Group>
          </Box>

          <RegisterForm />
        </Box>
      </Box>
      );
};
