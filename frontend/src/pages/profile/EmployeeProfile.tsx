
import { Paper, Title, Grid, TextInput, Badge, Group, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import type { User } from '../../types/models/user.types';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';

interface EmployeeProfileProps {
    user: User;
}

export const EmployeeProfile = ({ user }: EmployeeProfileProps) => {
    const { t } = useTranslation('profile');
    const { employee } = user;

    return (
        <Stack gap="lg">
            <Paper withBorder shadow="sm" p="lg" radius="md">
                <Group justify="space-between" mb="md">
                    <Group>
                        <CandidateAvatar
                            firstName={user.first_name}
                            lastName={user.last_name}
                        />
                        <Stack gap={0}>
                            <Title order={2}>{user.first_name} {user.last_name}</Title>
                            <Text c="dimmed">{user.email}</Text>
                            <Text fw={500} c="blue">{employee?.position}</Text>
                        </Stack>
                    </Group>
                    <Badge size="lg" variant="light">{t('employee.badge')}</Badge>
                </Group>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label={t('employee.firstName')}
                            value={user.first_name}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label={t('employee.lastName')}
                            value={user.last_name}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label={t('employee.email')}
                            value={user.email}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label={t('employee.position')}
                            value={employee?.position || t('employee.na')}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                </Grid>
                {employee?.roles && employee.roles.length > 0 && (
                    <Stack mt="md" gap="xs">
                        <Text fw={500} size="sm">{t('employee.roles')}</Text>
                        <Group gap="xs">
                            {employee.roles.map((role) => (
                                <Badge key={role} variant="outline">{role}</Badge>
                            ))}
                        </Group>
                    </Stack>
                )}

            </Paper>

            <ChangePasswordForm />
        </Stack>
    );
};
