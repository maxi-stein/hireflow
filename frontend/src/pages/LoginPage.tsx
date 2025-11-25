import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Card } from "@mantine/core";
import { LoginForm } from "../components/auth/LoginForm";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve the page the user was trying to access before being redirected to login.
  // If they came directly to /login, default to "/" (home).
  const from = (location.state as any)?.from?.pathname || "/";

  return (
    <Box>
      <Card>
        <LoginForm
          onSuccess={(user) => {
            const redirectTo =
              user.user_type === "candidate"
                ? from === "/"
                  ? "/jobs"
                  : from
                : "/employee/dashboard";
            navigate(redirectTo, { replace: true });
          }}
        />
      </Card>
    </Box>
  );
};
