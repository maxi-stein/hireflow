import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { AppShell, Box, Card, Group } from "@mantine/core";
import { LoginForm } from "../components/auth/LoginForm";
import { useAppStore } from "../store/useAppStore";
import { ROUTES } from "../router/routes.config";
import cgLogo from "../assets/cg-logo.jpg";
import { LogoButton, LogoImage, LogoText } from "../components/shared/LogoButton.styled";

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
    <AppShell header={{ height: 60 }} padding="md" bg="oklch(99% .005 240)">
      <AppShell.Header
        withBorder={false}
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', zIndex: 100 }}
      >
        <Group justify="center" h="100%" px="md">
          <LogoButton onClick={() => navigate('/')}>
            <LogoImage src={cgLogo} alt="Consultoría Global" />
            <LogoText>Consultoría Global</LogoText>
          </LogoButton>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box>
          <Card>
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
          </Card>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};
