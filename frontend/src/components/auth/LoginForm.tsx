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
} from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";
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
          title: t("loginForm.notifications.successTitle"),
          message: t("loginForm.notifications.successMessage"),
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
          ? t("loginForm.notifications.errorMessage")
          : (backendMsg || t("loginForm.notifications.errorMessage"));

        notifications.show({
          title: t("loginForm.notifications.errorTitle"),
          message: localizedError,
          color: "red",
        });
      },
    });
  };

  return (
    <Box w="100%" maw={420} mx="auto">
      <Title ta="center" className="font-greycliff" mb={30}>
        {t("loginForm.title")}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <TextInput
            label={t("loginForm.emailLabel")}
            placeholder={t("loginForm.emailPlaceholder")}
            required
            type="email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label={t("loginForm.passwordLabel")}
            placeholder={t("loginForm.passwordPlaceholder")}
            required
            mt="md"
            {...form.getInputProps("password")}
          />
        </Stack>

        <Group justify="space-between" mt="lg">
          <Anchor component="button" type="button" size="sm" onClick={() => { }}>
            {t("loginForm.forgotPassword")}
          </Anchor>
        </Group>

        <Stack mt="xl" gap="md">
          <Button
            fullWidth
            type="submit"
            loading={loginMutation.isPending}
          >
            {t("loginForm.signIn")}
          </Button>

          <Button
            fullWidth
            variant="default"
            leftSection={<IconBrandGoogle size={20} />}
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
            }}
          >
            {t("loginForm.continueWithGoogle")}
          </Button>

          <Button
            fullWidth
            variant="outline"
            color="blue"
            type="button"
            onClick={() => navigate("/register")}
          >
            {t("register")}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
