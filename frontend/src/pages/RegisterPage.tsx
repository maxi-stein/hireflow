import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import {
  Box,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Group,
  Anchor,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconArrowLeft,
  IconSparkles,
  IconUser,
  IconMail,
  IconLock,
  IconArrowRight,
  IconBriefcase,
  IconShieldCheck,
  IconClock,
} from "@tabler/icons-react";
import { useAppStore } from "../store/useAppStore";
import { useRegisterMutation } from "../hooks/api/useAuth";
import { authService } from "../services/auth.service";
import { validateWithJoi } from "../utils/form-validation";
import { registerSchema } from "../schemas/auth.schema";
import { ROUTES } from "../router/routes.config";
import { AppLogo } from "../components/shared/AppLogo";

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
          try {
            const authResponse = await authService.login({
              email: values.email,
              password: values.password,
            });
            setAuth(authResponse.user, authResponse.access_token);

            notifications.show({
              title: t("registerForm.notifications.successTitle", "¡Cuenta creada exitosamente!"),
              message: t("registerForm.notifications.successMessage", "Completá tu perfil para potenciar tus postulaciones."),
              color: "green",
              icon: <IconCheck size={16} />,
            });

            navigate(ROUTES.COMMON.PROFILE.path, { replace: true });
          } catch {
            notifications.show({
              title: t("registerForm.notifications.successTitle", "Cuenta creada"),
              message: t("registerForm.notifications.successMessage", "Ingresá con tus credenciales para continuar."),
              color: "green",
              icon: <IconCheck size={16} />,
            });
            navigate(ROUTES.PUBLIC.LOGIN.path, { replace: true });
          }
        },
        onError: (error) => {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const backendMsg = axiosError.response?.data?.message;
          notifications.show({
            title: t("registerForm.notifications.errorTitle", "Error"),
            message: backendMsg || t("registerForm.notifications.errorMessage", "No se pudo registrar la cuenta"),
            color: "red",
            icon: <IconX size={16} />,
          });
        },
      }
    );
  };

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

        {/* Top bar with logo and back */}
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
            {t('registerPage.backToHome', 'Volver al inicio')}
          </Button>
        </Group>

        {/* Showcase benefits */}
        <Stack gap="xl" maw={480} my="auto" style={{ position: 'relative', zIndex: 2 }}>
          <Badge
            size="lg"
            radius="xl"
            color="blue"
            variant="filled"
            leftSection={<IconSparkles size={14} />}
            style={{ width: 'fit-content' }}
          >
            {t('registerPage.showcaseBadge', 'Registro de Candidato')}
          </Badge>

          <Title
            order={1}
            style={{
              fontSize: 'clamp(2rem, 3vw, 2.6rem)',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#ffffff',
            }}
          >
            {t('registerPage.showcaseTitle', 'Sumate al equipo de Consultoría Global.')}
          </Title>

          <Stack gap="md" mt="sm">
            <Group gap="md" align="flex-start" wrap="nowrap">
              <ThemeIcon size={36} radius="md" color="blue" variant="light">
                <IconBriefcase size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="sm" c="#ffffff">
                  {t('registerPage.perk1Title', 'Perfil profesional unificado')}
                </Text>
                <Text size="xs" c="gray.3" lh={1.5}>
                  {t('registerPage.perk1Desc', 'Cargá tus datos personales, foto y CV en un solo lugar para el equipo de Consultoría Global.')}
                </Text>
              </Box>
            </Group>

            <Group gap="md" align="flex-start" wrap="nowrap">
              <ThemeIcon size={36} radius="md" color="teal" variant="light">
                <IconShieldCheck size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="sm" c="#ffffff">
                  {t('registerPage.perk2Title', 'Evaluación justa y transparente')}
                </Text>
                <Text size="xs" c="gray.3" lh={1.5}>
                  {t('registerPage.perk2Desc', 'Completás tus años reales de experiencia por cada habilidad requerida por el puesto.')}
                </Text>
              </Box>
            </Group>

            <Group gap="md" align="flex-start" wrap="nowrap">
              <ThemeIcon size={36} radius="md" color="violet" variant="light">
                <IconClock size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={700} size="sm" c="#ffffff">
                  {t('registerPage.perk3Title', 'Seguimiento en tiempo real')}
                </Text>
                <Text size="xs" c="gray.3" lh={1.5}>
                  {t('registerPage.perk3Desc', 'Conocé el avance de cada proceso y recibí enlaces directos a tus entrevistas programadas.')}
                </Text>
              </Box>
            </Group>
          </Stack>
        </Stack>

        <Text size="xs" c="gray.4" style={{ position: 'relative', zIndex: 2 }}>
          {t('registerPage.copyright', { year: new Date().getFullYear(), defaultValue: `© ${new Date().getFullYear()} HireFlow · Consultoría Global. Todos los derechos reservados.` })}
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

        <Box w="100%" maw={460}>
          <Stack gap={6} mb="xl">
            <Title order={1} size="h2" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {t("registerForm.title", "Crear cuenta")}
            </Title>
            <Text c="dimmed" size="sm">
              {t("registerForm.subtitle", "Completá tus datos para acceder a las ofertas de empleo.")}
            </Text>
          </Stack>

          <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label={t("registerForm.firstNameLabel", "Nombre")}
                  placeholder={t("registerForm.firstNamePlaceholder", "Juan")}
                  required
                  size="md"
                  leftSection={<IconUser size={18} color="#94a3b8" />}
                  autoComplete="given-name"
                  {...form.getInputProps("first_name")}
                />
                <TextInput
                  label={t("registerForm.lastNameLabel", "Apellido")}
                  placeholder={t("registerForm.lastNamePlaceholder", "Pérez")}
                  required
                  size="md"
                  autoComplete="family-name"
                  {...form.getInputProps("last_name")}
                />
              </Group>

              <TextInput
                label={t("registerForm.emailLabel", "Correo electrónico")}
                placeholder={t("registerForm.emailPlaceholder", "juan.perez@email.com")}
                required
                size="md"
                type="email"
                leftSection={<IconMail size={18} color="#94a3b8" />}
                autoComplete="email"
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label={t("registerForm.passwordLabel", "Contraseña")}
                placeholder={t("registerForm.passwordPlaceholder", "••••••••")}
                required
                size="md"
                leftSection={<IconLock size={18} color="#94a3b8" />}
                autoComplete="new-password"
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label={t("registerForm.confirmPasswordLabel", "Confirmar contraseña")}
                placeholder={t("registerForm.confirmPasswordPlaceholder", "••••••••")}
                required
                size="md"
                leftSection={<IconLock size={18} color="#94a3b8" />}
                autoComplete="new-password"
                {...form.getInputProps("confirmPassword")}
              />

              <Button
                type="submit"
                fullWidth
                size="md"
                color="blue"
                mt="sm"
                loading={registerMutation.isPending}
                rightSection={<IconArrowRight size={18} />}
                style={{
                  fontWeight: 700,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                {t("registerForm.submit", "Registrarme")}
              </Button>

              <Group justify="center" gap={6} mt="md">
                <Text size="sm" c="dimmed">
                  {t("registerPage.hasAccount", "¿Ya tenés una cuenta?")}
                </Text>
                <Anchor
                  component="button"
                  type="button"
                  size="sm"
                  fw={700}
                  c="blue.6"
                  onClick={() => navigate("/login")}
                >
                  {t("registerForm.loginLink", "Iniciá sesión")}
                </Anchor>
              </Group>
            </Stack>
          </form>
        </Box>
      </Box>

    </Box>
  );
};
