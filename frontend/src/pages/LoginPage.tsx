import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Box, Button, Stack, Title, Text, Badge, Group } from "@mantine/core";
import { IconArrowLeft, IconSparkles } from "@tabler/icons-react";
import { LoginForm } from "../components/auth/LoginForm";
import { useAppStore } from "../store/useAppStore";
import { ROUTES } from "../router/routes.config";
import { AppLogo } from "../components/shared/AppLogo";
import { candidateService } from "../services/candidate.service";

import { useTranslation } from "react-i18next";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);

  // Retrieve the page the user was trying to access before being redirected to login.
  const fromLocation = (location.state as { from?: { pathname?: string; search?: string; hash?: string } } | null)?.from;
  const fromPath = fromLocation?.pathname;
  const from = fromPath ? `${fromPath}${fromLocation.search || ""}${fromLocation.hash || ""}` : undefined;

  // If the user is already logged in, redirect to the appropriate dashboard.
  if (user) {
    const pathToRedirect =
      from && fromPath !== ROUTES.PUBLIC.HOME.path ? from : user.type === "candidate"
        ? ROUTES.PUBLIC.JOBS.path : ROUTES.EMPLOYEE.DASHBOARD.path;
    return <Navigate to={pathToRedirect} replace />;
  }

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'light-dark(#f8fafc, #0b0f19)', overflow: 'hidden' }}>

      {/* Left Column (50% on desktop, hidden on mobile) */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        style={{
          flex: '0 0 50%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #0b132b 0%, #1c2541 50%, #1e3a8a 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3.5rem',
          color: '#ffffff',
        }}
      >
        {/* Ambient background glows */}
        <Box
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-15%',
            width: '600px',
            height: '600px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '9999px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top bar with logo and back button */}
        <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 2 }}>
          <Box
            style={{
              backgroundColor: '#ffffff',
              padding: '6px 14px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'inline-flex',
            }}
          >
            <AppLogo h={36} />
          </Box>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            leftSection={<IconArrowLeft size={16} />}
            style={{ color: '#cbd5e1' }}
            onClick={() => navigate('/')}
          >
            {t('loginPage.backToHome', 'Volver al inicio')}
          </Button>
        </Group>

        {/* Center showcase with mockup card */}
        <Stack gap="xl" maw={480} my="auto" style={{ position: 'relative', zIndex: 2 }}>
          <Badge
            size="lg"
            radius="xl"
            color="blue"
            variant="filled"
            leftSection={<IconSparkles size={14} />}
            style={{ width: 'fit-content' }}
          >
            {t('loginPage.showcaseBadge', 'Talento Tech & Consultoría')}
          </Badge>

          <Title
            order={1}
            style={{
              fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {t('loginPage.showcaseTitle', 'Tu próximo gran desafío profesional está en Consultoría Global.')}
          </Title>
        </Stack>

        {/* Footer note */}
        <Text size="xs" c="gray.4" style={{ position: 'relative', zIndex: 2 }}>
          {t('loginPage.copyright', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} HireFlow · Consultoría Global. Todos los derechos reservados.` })}
        </Text>
      </Box>

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
        }}
      >
        {/* Mobile top logo and back */}
        <Box display={{ base: 'block', md: 'none' }} w="100%" maw={420} mb="xl">
          <Group justify="space-between">
            <AppLogo h={32} />
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => navigate('/')}
            >
              {t('loginPage.backToHome', 'Inicio')}
            </Button>
          </Group>
        </Box>

        <Box w="100%" maw={440}>
          <LoginForm
            onSuccess={async (loggedInUser) => {
              if (loggedInUser.type === 'candidate') {
                try {
                  const profile = await candidateService.getById(loggedInUser.id);
                  const hasWorkExp = profile.work_experiences && profile.work_experiences.length > 0;
                  const hasEdu = profile.educations && profile.educations.length > 0;

                  if (!hasWorkExp && !hasEdu) {
                    navigate(ROUTES.COMMON.PROFILE.path, { replace: true });
                    return;
                  }
                } catch {
                  // Fallback
                }
              }

              const pathToRedirect =
                from && fromPath !== ROUTES.PUBLIC.HOME.path ? from :
                  loggedInUser.type === "candidate"
                    ? ROUTES.PUBLIC.JOBS.path : ROUTES.EMPLOYEE.DASHBOARD.path;
              navigate(pathToRedirect, { replace: true });
            }}
          />
        </Box>
      </Box>

    </Box>
  );
};
