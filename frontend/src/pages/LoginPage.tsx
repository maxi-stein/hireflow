import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Box, Button, Image, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { LoginForm } from "../components/auth/LoginForm";
import { useAppStore } from "../store/useAppStore";
import { ROUTES } from "../router/routes.config";
import cgLogo from "../assets/cg-logo.jpg";
import styled from "styled-components";

const Background = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  /* Gradiente principal */
  background: linear-gradient(
    to bottom right,
    #0ea5e9 0%,
    #2563eb 50%,
    #1e40af 100%
  );

  /* Gradientes radiales superpuestos */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background-image:
      radial-gradient(
        circle at 20% 20%,
        rgba(255, 255, 255, 1) 0%,
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 70%,
        #7dd3fc 0%,
        transparent 45%
      );
  }

  /* Blob superior izquierdo */
  &::after {
    content: "";
    position: absolute;
    width: 24rem;
    height: 24rem;
    top: -8rem;
    left: -8rem;
    border-radius: 9999px;
    background: rgba(125, 211, 252, 0.3);
    filter: blur(64px);
  }
`;

const BackgroundBlob = styled.div`
  position: absolute;
  width: 28rem;
  height: 28rem;
  bottom: -10rem;
  right: -5rem;
  border-radius: 9999px;
  background: rgba(96, 165, 250, 0.3);
  filter: blur(64px);
`;


export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);

  // Retrieve the page the user was trying to access before being redirected to login.
  const fromLocation = (location.state as any)?.from;
  const fromPath = fromLocation?.pathname;
  // This will catch the hash (/jobs/:id) or query params
  const from = fromPath ? `${fromPath}${fromLocation.search || ""}${fromLocation.hash || ""}` : undefined;

  // If the user is already logged in, redirect to the appropriate dashboard.
  if (user) {
    const pathToRedirect =
      from && fromPath !== ROUTES.PUBLIC.HOME.path ? from : user.type === "candidate"
        ? ROUTES.PUBLIC.JOBS.path : ROUTES.EMPLOYEE.DASHBOARD.path;
    return <Navigate to={pathToRedirect} replace />;
  }

  return (
    <Box style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* Left Column (70%) - Hidden on mobile */}
      <Box
        display={{ base: 'none', md: 'flex' }}
        style={{
          flex: '0 0 70%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <Background />
        <BackgroundBlob />

        <Stack
          align="center"
          gap="xl"
          style={{
            position: 'relative',
            zIndex: 1,
            background: 'white',
            padding: '2rem',
            borderRadius: '1rem',
          }}
        >
          <Image
            src={cgLogo}
            alt="Consultoría Global"
            w="auto"
            h={180}
            fit="contain"
          />

          <Button
            variant="subtle"
            color="blue"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate('/')}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Box>

      {/* Right Column (30% on desktop, 100% on mobile) */}
      <Box
        style={{
          flex: '1',
          backgroundColor: '#ffffff',
          borderLeft: '1px solid light-dark(#e2e8f0, var(--mantine-color-dark-4))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}
      >
        <Box w="100%" maw={420}>
          <LoginForm
            onSuccess={(loggedInUser) => {
              // Always redirect to previous page if it's not the home page.
              // Otherwise, redirect to the Jobs page for candidates or the Dashboard for employees.
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