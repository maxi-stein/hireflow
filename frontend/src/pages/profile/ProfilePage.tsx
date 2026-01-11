
import { useEffect, useState } from 'react';
import { Container, LoadingOverlay, Paper, Text, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { EmployeeProfile } from './EmployeeProfile';
import { authService } from '../../services/auth.service';
import type { User } from '../../types/models/user.types';
import { CandidateProfile } from './CandidateProfile';

export const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userData = await authService.getProfile();
                setUser(userData);
            } catch (error) {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to load profile',
                    color: 'red',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <LoadingOverlay visible={true} />;
    }

    if (!user) {
        return (
            <Center h="100%">
                <Paper p="xl">
                    <Text c="dimmed">Failed to load user profile.</Text>
                </Paper>
            </Center>
        )
    }

    return (
        <Container size="lg" py="xl">
            {user.user_type === 'employee' ? (
                <EmployeeProfile user={user} />
            ) : (
                <CandidateProfile user={user} refreshProfile={async () => {
                    const userData = await authService.getProfile();
                    setUser(userData);
                }} />
            )}
        </Container>
    );
};
