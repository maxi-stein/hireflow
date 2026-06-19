import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Group,
  Anchor,
  Text,
  Stack,
} from "@mantine/core";
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
    <Container size={420} my={40}>
      <Title ta="center" className="font-greycliff">
        {t("loginForm.title")}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {t("loginForm.noAccount")}{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/register")}>
          {t("loginForm.createAccount")}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack>
            <TextInput
              label={t("loginForm.emailLabel")}
              placeholder={t("loginForm.emailPlaceholder")}
              required
              type="email"
              {...form.getInputProps("email")} // Binds value, onChange, and error props automatically
            />
            <PasswordInput
              label={t("loginForm.passwordLabel")}
              placeholder={t("loginForm.passwordPlaceholder")}
              required
              mt="md"
              {...form.getInputProps("password")} // Binds value, onChange, and error props automatically
            />
          </Stack>

          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm" onClick={() => { }}>
              {t("loginForm.forgotPassword")}
            </Anchor>
          </Group>

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loginMutation.isPending}
          >
            {t("loginForm.signIn")}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
