
import { Button, PasswordInput, Stack, Paper, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { authService } from '../../services/auth.service';
import { validateWithJoi } from '../../utils/form-validation';
import { changePasswordSchema } from '../../schemas/profile.schema';

export const ChangePasswordForm = () => {
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
                errorMessage = error.response.data.message;
                if (Array.isArray(errorMessage)) {
                    errorMessage = errorMessage.join(', ');
                }
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

    return (
        <Paper withBorder shadow="md" p="md" radius="md">
            <Title order={4} mb="md">{t('password.title')}</Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <PasswordInput
                        label={t('password.current')}
                        placeholder={t('password.currentPlaceholder')}
                        required
                        {...form.getInputProps('oldPassword')}
                    />
                    <PasswordInput
                        label={t('password.new')}
                        placeholder={t('password.newPlaceholder')}
                        required
                        {...form.getInputProps('newPassword')}
                    />
                    <PasswordInput
                        label={t('password.confirm')}
                        placeholder={t('password.confirmPlaceholder')}
                        required
                        {...form.getInputProps('confirmPassword')}
                    />
                    <Button type="submit" loading={false}>
                        {t('password.update')}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};
