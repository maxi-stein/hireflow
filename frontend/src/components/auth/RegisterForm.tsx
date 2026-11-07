import React, { createElement } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconX,
  IconUser,
  IconMail,
  IconLock,
  IconArrowRight,
} from '@tabler/icons-react';
import { useAppStore } from '../../store/useAppStore';
import { useRegisterMutation } from '../../hooks/api/useAuth';
import { authService } from '../../services/auth.service';
import { validateWithJoi } from '../../utils/form-validation';
import { registerSchema } from '../../schemas/auth.schema';
import { ROUTES } from '../../router/routes.config';

export interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const setAuth = useAppStore((state) => state.setAuth);
  const registerMutation = useRegisterMutation();
  const { t } = useTranslation('common');

  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: validateWithJoi(registerSchema),
  });

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
              title: t('registerForm.notifications.successTitle', '¡Cuenta creada exitosamente!'),
              message: t(
                'registerForm.notifications.successMessage',
                'Completá tu perfil para potenciar tus postulaciones.'
              ),
              color: 'green',
              icon: createElement(IconCheck, { size: 16 }),
            });

            if (onSuccess) {
              onSuccess();
            } else {
              navigate(ROUTES.COMMON.PROFILE.path, { replace: true });
            }
          } catch {
            notifications.show({
              title: t('registerForm.notifications.successTitle', 'Cuenta creada'),
              message: t(
                'registerForm.notifications.successMessage',
                'Ingresá con tus credenciales para continuar.'
              ),
              color: 'green',
              icon: createElement(IconCheck, { size: 16 }),
            });
            navigate(ROUTES.PUBLIC.LOGIN.path, { replace: true });
          }
        },
        onError: (error) => {
          const axiosError = error as { response?: { data?: { message?: string } } };
          const backendMsg = axiosError.response?.data?.message;
          notifications.show({
            title: t('registerForm.notifications.errorTitle', 'Error'),
            message: backendMsg || t('registerForm.notifications.errorMessage', 'No se pudo registrar la cuenta'),
            color: 'red',
            icon: createElement(IconX, { size: 16 }),
          });
        },
      }
    );
  };

  return (
    <Box w="100%" maw={460}>
      <Stack gap={6} mb="xl">
        <Title order={1} size="h2" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
          {t('registerForm.title', 'Crear cuenta')}
        </Title>
        <Text c="dimmed" size="sm">
          {t('registerForm.subtitle', 'Completá tus datos para acceder a las ofertas de empleo.')}
        </Text>
      </Stack>

      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Group grow>
            <TextInput
              label={t('registerForm.firstNameLabel', 'Nombre')}
              placeholder={t('registerForm.firstNamePlaceholder', 'Juan')}
              required
              size="md"
              leftSection={<IconUser size={18} color="#94a3b8" />}
              autoComplete="given-name"
              {...form.getInputProps('first_name')}
            />
            <TextInput
              label={t('registerForm.lastNameLabel', 'Apellido')}
              placeholder={t('registerForm.lastNamePlaceholder', 'Pérez')}
              required
              size="md"
              autoComplete="family-name"
              {...form.getInputProps('last_name')}
            />
          </Group>

          <TextInput
            label={t('registerForm.emailLabel', 'Correo electrónico')}
            placeholder={t('registerForm.emailPlaceholder', 'juan.perez@email.com')}
            required
            size="md"
            type="email"
            leftSection={<IconMail size={18} color="#94a3b8" />}
            autoComplete="email"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label={t('registerForm.passwordLabel', 'Contraseña')}
            placeholder={t('registerForm.passwordPlaceholder', '••••••••')}
            required
            size="md"
            leftSection={<IconLock size={18} color="#94a3b8" />}
            autoComplete="new-password"
            {...form.getInputProps('password')}
          />

          <PasswordInput
            label={t('registerForm.confirmPasswordLabel', 'Confirmar contraseña')}
            placeholder={t('registerForm.confirmPasswordPlaceholder', '••••••••')}
            required
            size="md"
            leftSection={<IconLock size={18} color="#94a3b8" />}
            autoComplete="new-password"
            {...form.getInputProps('confirmPassword')}
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
            {t('registerForm.submit', 'Registrarme')}
          </Button>

          <Group justify="center" gap={6} mt="md">
            <Text size="sm" c="dimmed">
              {t('registerPage.hasAccount', '¿Ya tenés una cuenta?')}
            </Text>
            <Anchor
              component="button"
              type="button"
              size="sm"
              fw={700}
              c="blue.6"
              onClick={() => navigate('/login')}
            >
              {t('registerForm.loginLink', 'Iniciá sesión')}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Box>
  );
};

