
import { Button, PasswordInput, Stack, Paper, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { authService } from '../../services/auth.service';
import { validateWithJoi } from '../../utils/form-validation';
import { changePasswordSchema } from '../../schemas/profile.schema';

export const ChangePasswordForm = () => {
    const form = useForm({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validate: validateWithJoi(changePasswordSchema),
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            await authService.changePassword({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
            notifications.show({
                title: 'Success',
                message: 'Password changed successfully',
                color: 'green',
            });
            form.reset();
        } catch (error: any) {
            let errorMessage = 'Failed to change password';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
                if (Array.isArray(errorMessage)) {
                    errorMessage = errorMessage.join(', ');
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            notifications.show({
                title: 'Error',
                message: errorMessage,
                color: 'red',
            });
        }
    };

    return (
        <Paper withBorder shadow="md" p="md" radius="md">
            <Title order={4} mb="md">Change Password</Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <PasswordInput
                        label="Current Password"
                        placeholder="Your current password"
                        required
                        {...form.getInputProps('oldPassword')}
                    />
                    <PasswordInput
                        label="New Password"
                        placeholder="New password"
                        required
                        {...form.getInputProps('newPassword')}
                    />
                    <PasswordInput
                        label="Confirm New Password"
                        placeholder="Confirm new password"
                        required
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Button type="submit" loading={false}>
                        Update Password
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};
