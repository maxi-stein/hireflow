import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Stack,
  Group,
  Anchor,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAppStore } from "../store/useAppStore";
import { useRegisterMutation } from "../hooks/api/useAuth";
import { authService } from "../services/auth.service";
import { validateWithJoi } from "../utils/form-validation";
import { registerSchema } from "../schemas/auth.schema";
import { ROUTES } from "../router/routes.config";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setAuth = useAppStore((state) => state.setAuth);
  const registerMutation = useRegisterMutation();
  const { t } = useTranslation("common");

  const form = useForm({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: validateWithJoi(registerSchema),
  });

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    return (
      <Navigate
        to={user.type === "candidate" ? ROUTES.COMMON.PROFILE.path : ROUTES.EMPLOYEE.DASHBOARD.path}
        replace
      />
    );
  }

  const handleSubmit = (values: typeof form.values) => {
    registerMutation.mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          // Auto-login after successful registration
          try {
            const authResponse = await authService.login({
              email: values.email,
              password: values.password,
            });
            setAuth(authResponse.user, authResponse.access_token);

            notifications.show({
              title: t("registerForm.notifications.successTitle"),
              message: t("registerForm.notifications.successMessage"),
              color: "green",
              icon: <IconCheck size={16} />,
            });

            // Redirect to profile so the candidate can fill in their experience and education
            navigate(ROUTES.COMMON.PROFILE.path, { replace: true });
          } catch {
            // Registration succeeded but auto-login failed — send to login page
            notifications.show({
              title: t("registerForm.notifications.successTitle"),
              message: t("registerForm.notifications.successMessage"),
              color: "green",
              icon: <IconCheck size={16} />,
            });
            navigate(ROUTES.PUBLIC.LOGIN.path, { replace: true });
          }
        },
        onError: (error: any) => {
          const backendMsg = error.response?.data?.message;
          notifications.show({
            title: t("registerForm.notifications.errorTitle"),
            message: backendMsg || t("registerForm.notifications.errorMessage"),
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };

  return (
    <Box>
      <Card>
        <Container size={420} my={40}>
          <Title ta="center">{t("registerForm.title")}</Title>
          <Text c="dimmed" size="sm" ta="center" mt={5}>
            {t("registerForm.subtitle")}{" "}
            <Anchor size="sm" component="button" onClick={() => navigate("/login")}>
              {t("registerForm.loginLink")}
            </Anchor>
          </Text>

          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
              <Stack>
                <Group grow>
                  <TextInput
                    label={t("registerForm.firstNameLabel")}
                    placeholder={t("registerForm.firstNamePlaceholder")}
                    withAsterisk
                    autoComplete="given-name"
                    {...form.getInputProps("first_name")}
                  />
                  <TextInput
                    label={t("registerForm.lastNameLabel")}
                    placeholder={t("registerForm.lastNamePlaceholder")}
                    withAsterisk
                    autoComplete="family-name"
                    {...form.getInputProps("last_name")}
                  />
                </Group>

                <TextInput
                  label={t("registerForm.emailLabel")}
                  placeholder={t("registerForm.emailPlaceholder")}
                  withAsterisk
                  type="email"
                  autoComplete="email"
                  {...form.getInputProps("email")}
                />

                <PasswordInput
                  label={t("registerForm.passwordLabel")}
                  placeholder={t("registerForm.passwordPlaceholder")}
                  withAsterisk
                  autoComplete="new-password"
                  {...form.getInputProps("password")}
                />

                <PasswordInput
                  label={t("registerForm.confirmPasswordLabel")}
                  placeholder={t("registerForm.confirmPasswordPlaceholder")}
                  withAsterisk
                  autoComplete="new-password"
                  {...form.getInputProps("confirmPassword")}
                />

                <Button
                  type="submit"
                  fullWidth
                  mt="xl"
                  loading={registerMutation.isPending}
                >
                  {t("registerForm.submit")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Card>
    </Box>
  );
};
