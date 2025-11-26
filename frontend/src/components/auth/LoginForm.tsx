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
import { loginSchema } from "../../schemas/auth.schema";
import { useLoginMutation } from "../../hooks/api/useAuth";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { validateWithJoi } from "../../utils/form-validation";
import type { JwtUser } from "../../types/api/auth.types";
import { useAppStore } from "../../store/useAppStore";

interface LoginFormProps {
  onSuccess?: (user: JwtUser ) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const setAuth = useAppStore((state) => state.setAuth);

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
          title: "Welcome back!",
          message: "You have successfully logged in",
          color: "green",
        });
        if (onSuccess) {
          onSuccess(data.user);
        } else {
            navigate("/dashboard");
        }
      },
      onError: (error: any) => {
        notifications.show({
          title: "Login failed",
          message: error.response?.data?.message || "Invalid credentials",
          color: "red",
        });
      },
    });
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="font-greycliff">
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button" onClick={() => navigate("/register")}>
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              type="email"
              {...form.getInputProps("email")} // Binds value, onChange, and error props automatically
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")} // Binds value, onChange, and error props automatically
            />
          </Stack>
          
          <Group justify="space-between" mt="lg">
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          
          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};
