import React from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { Box, Card } from "@mantine/core";
import { LoginForm } from "../components/auth/LoginForm";
import { useAppStore } from "../store/useAppStore";
import { ROUTES } from "../router/routes.config";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore((state) => state.user);

  // Retrieve the page the user was trying to access before being redirected to login.
  const from = (location.state as any)?.from?.pathname;

  // If the user is already logged in, redirect to the appropriate dashboard.
  if (user) {
    const pathToRedirect =
      from && from !== ROUTES.PUBLIC.HOME.path ? from : user.type === "candidate"
        ? ROUTES.PUBLIC.JOBS.path : ROUTES.EMPLOYEE.DASHBOARD.path;
    return <Navigate to={pathToRedirect} replace />;
  }

  return (
    <Box>
      <Card>
        <LoginForm
          onSuccess={(loggedInUser) => {
            // Always redirect to previous page if it's not the home page.
            // Otherwise, redirect to the Jobs page for candidates or the Dashboard for employees.
            const pathToRedirect =
              from && from !== ROUTES.PUBLIC.HOME.path ? from :
                loggedInUser.type === "candidate"
                  ? ROUTES.PUBLIC.JOBS.path : ROUTES.EMPLOYEE.DASHBOARD.path;
            navigate(pathToRedirect, { replace: true });
          }}
        />
      </Card>
    </Box>
  );
};
