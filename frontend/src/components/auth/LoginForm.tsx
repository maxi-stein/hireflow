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
import type { User } from "../../types/models/user.types";
import { validateWithJoi } from "../../utils/form-validation";

interface LoginFormProps {
  onSuccess?: (user: User) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

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
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@mantine.dev"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              mt="md"
              {...form.getInputProps("password")}
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
