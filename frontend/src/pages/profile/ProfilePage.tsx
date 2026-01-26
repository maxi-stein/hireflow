
import { Container, LoadingOverlay, Paper, Text, Center } from '@mantine/core';
import { EmployeeProfile } from './EmployeeProfile';
import { useProfileQuery } from '../../hooks/api/useAuth';
import { CandidateProfile } from './CandidateProfile';

export const ProfilePage = () => {
    const { data: user, isLoading, refetch } = useProfileQuery();

    if (isLoading) {
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
                <CandidateProfile user={user} refreshProfile={() => refetch()} />
            )}
        </Container>
    );
};
