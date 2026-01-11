
import { Paper, Title, Grid, TextInput, Badge, Group, Card, Text, Avatar, Stack } from '@mantine/core';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import type { User } from '../../types/models/user.types';

interface EmployeeProfileProps {
    user: User;
}

export const EmployeeProfile = ({ user }: EmployeeProfileProps) => {
    const { employee } = user;

    return (
        <Stack gap="lg">
            <Paper withBorder shadow="sm" p="lg" radius="md">
                <Group justify="space-between" mb="md">
                    <Group>
                        <Avatar size={80} color="blue" radius="xl">
                            {user.first_name[0]}{user.last_name[0]}
                        </Avatar>
                        <Stack gap={0}>
                            <Title order={2}>{user.first_name} {user.last_name}</Title>
                            <Text c="dimmed">{user.email}</Text>
                            <Text fw={500} c="blue">{employee?.position}</Text>
                        </Stack>
                    </Group>
                    <Badge size="lg" variant="light">Employee</Badge>
                </Group>

                <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="First Name"
                            value={user.first_name}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Last Name"
                            value={user.last_name}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Email"
                            value={user.email}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                        <TextInput
                            label="Position"
                            value={employee?.position || 'N/A'}
                            readOnly
                            variant="filled"
                        />
                    </Grid.Col>
                </Grid>
                {employee?.roles && employee.roles.length > 0 && (
                    <Stack mt="md" gap="xs">
                        <Text fw={500} size="sm">Roles</Text>
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
