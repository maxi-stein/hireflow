import { Button, PasswordInput, Stack, Paper, Title, Text, Group, ThemeIcon } from '@mantine/core';
import { IconLockPassword } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { authService } from '../../services/auth.service';
import { validateWithJoi } from '../../utils/form-validation';
import { changePasswordSchema } from '../../schemas/profile.schema';

interface ChangePasswordFormProps {
    withPaper?: boolean;
}

export const ChangePasswordForm = ({ withPaper = true }: ChangePasswordFormProps) => {
    const { t } = useTranslation('profile');

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
                title: t('candidate.notifications.successTitle'),
                message: t('password.success'),
                color: 'green',
            });

            form.reset();
        } catch (error: any) {
            let errorMessage = t('password.failed');

            if (error.response?.data?.message) {
                errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message.join(', ')
                    : error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            notifications.show({
                title: t('candidate.notifications.errorTitle'),
                message: errorMessage,
                color: 'red',
            });
        }
    };

    const content = (
        <Stack gap="lg">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="sm">
                    <PasswordInput
                        label={t('password.current')}
                        placeholder={t('password.currentPlaceholder')}
                        size="sm"
                        required
                        {...form.getInputProps('oldPassword')}
                    />

                    <PasswordInput
                        label={t('password.new')}
                        placeholder={t('password.newPlaceholder')}
                        size="sm"
                        required
                        {...form.getInputProps('newPassword')}
                    />

                    <PasswordInput
                        label={t('password.confirm')}
                        placeholder={t('password.confirmPlaceholder')}
                        size="sm"
                        required
                        {...form.getInputProps('confirmPassword')}
                    />

                    <Button type="submit" fullWidth mt="xs">
                        {t('password.update')}
                    </Button>
                </Stack>
            </form>
        </Stack>
    );

    if (!withPaper) {
        return content;
    }

    return (
        <Paper withBorder p="lg" radius="md">
            {content}
        </Paper>
    );
};