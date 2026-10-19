import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Group,
  Anchor,
  Stack,
  Box,
  Divider,
  Text,
} from "@mantine/core";
import { IconBrandGoogle, IconMail, IconLock, IconArrowRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { loginSchema } from "../../schemas/auth.schema";
import { useLoginMutation } from "../../hooks/api/useAuth";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { validateWithJoi } from "../../utils/form-validation";
import type { JwtUser } from "../../types/api/auth.types";
import { useAppStore } from "../../store/useAppStore";

interface LoginFormProps {
  onSuccess?: (user: JwtUser) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const setAuth = useAppStore((state) => state.setAuth);
  const { t } = useTranslation('common');

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateWithJoi(loginSchema),
  });

  const handleSubmit = (values: typeof form.values) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        setAuth(data.user, data.access_token);

        notifications.show({
          title: t("loginForm.notifications.successTitle", "Sesión iniciada"),
          message: t("loginForm.notifications.successMessage", "¡Bienvenido de nuevo a HireFlow!"),
          color: "green",
        });
        if (onSuccess) {
          onSuccess(data.user);
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error: any) => {
        const backendMsg = error.response?.data?.message;
        const localizedError = (backendMsg === 'Invalid credentials' || backendMsg === 'Unauthorized')
          ? t("loginForm.notifications.errorMessage", "Credenciales incorrectas")
          : (backendMsg || t("loginForm.notifications.errorMessage", "Error al iniciar sesión"));

        notifications.show({
          title: t("loginForm.notifications.errorTitle", "Error"),
          message: localizedError,
          color: "red",
        });
      },
    });
  };

  return (
    <Box w="100%" maw={420} mx="auto">
      <Stack gap={6} mb="xl">
        <Title order={1} size="h2" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
          {t("loginForm.title", "Iniciar sesión")}
        </Title>
        <Text c="dimmed" size="sm">
          {t("loginForm.subtitle", "Ingresá tus credenciales para acceder a tus postulaciones y perfil.")}
        </Text>
      </Stack>

      {/* Google OAuth Button */}
      <Button
        fullWidth
        size="md"
        variant="default"
        leftSection={<IconBrandGoogle size={20} />}
        type="button"
        style={{
          borderColor: 'light-dark(#cbd5e1, #334155)',
          fontWeight: 600,
          color: 'light-dark(#334155, #f1f5f9)',
          backgroundColor: 'light-dark(#ffffff, #1e293b)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
        }}
      >
        {t("loginForm.continueWithGoogle", "Continuar con Google")}
      </Button>

      <Divider
        my="lg"
        label={t("loginForm.orEmail", "o continuar con email")}
        labelPosition="center"
        styles={{ label: { color: '#94a3b8', fontSize: '0.8125rem' } }}
      />

      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <TextInput
            label={t("loginForm.emailLabel", "Correo electrónico")}
            placeholder={t("loginForm.emailPlaceholder", "tu@email.com")}
            required
            size="md"
            type="email"
            leftSection={<IconMail size={18} color="#94a3b8" />}
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label={t("loginForm.passwordLabel", "Contraseña")}
            placeholder={t("loginForm.passwordPlaceholder", "••••••••")}
            required
            size="md"
            leftSection={<IconLock size={18} color="#94a3b8" />}
            {...form.getInputProps("password")}
          />

          <Group justify="flex-end" mt={-4}>
            <Anchor component="button" type="button" size="xs" c="blue.6" fw={500} onClick={() => { }}>
              {t("loginForm.forgotPassword", "¿Olvidaste tu contraseña?")}
            </Anchor>
          </Group>

          <Button
            fullWidth
            size="md"
            type="submit"
            color="blue"
            loading={loginMutation.isPending}
            rightSection={<IconArrowRight size={18} />}
            style={{
              fontWeight: 700,
              marginTop: '8px',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            }}
          >
            {t("loginForm.signIn", "Ingresar")}
          </Button>

          <Group justify="center" gap={6} mt="md">
            <Text size="sm" c="dimmed">
              {t("loginForm.noAccount", "¿Todavía no tenés cuenta?")}
            </Text>
            <Anchor
              component="button"
              type="button"
              size="sm"
              fw={700}
              c="blue.6"
              onClick={() => navigate("/register")}
            >
              {t("loginForm.registerFree", "Registrate gratis")}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};
