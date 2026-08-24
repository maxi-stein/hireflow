import { Title, Text, Stack, LoadingOverlay, Alert, Box } from '@mantine/core';
import { IconInbox, IconFileText, IconClock, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store/useAppStore';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { useCandidateInterviewsQuery } from '../../hooks/api/useInterviews';
import { UpcomingInterviewsAlert } from '../../components/candidate/UpcomingInterviewsAlert';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { CandidateApplicationCard } from '../../components/candidate/CandidateApplicationCard';
import { StatsGrid } from '../../components/shared/StatsGrid';


export const ApplicationsPage = () => {
    const user = useAppStore((state) => state.user);
    const { t } = useTranslation('applications');

    // Fetch applications for the logged-in candidate
    const { data: applicationsResponse, isLoading: isLoadingApplications } = useAllCandidateApplicationsQuery({
        candidate_id: user?.id,
        limit: 50
    });

    // Fetch all interviews for the candidate
    const { data: interviewsResponse, isLoading: isLoadingInterviews } = useCandidateInterviewsQuery(user?.id || '');

    const applications = applicationsResponse?.data || [];
    const allInterviews = interviewsResponse?.data || [];

    // Helper function to get interviews for a specific application
    const getInterviewsForApplication = (applicationId: string): Interview[] => {
        return allInterviews.filter(interview =>
            interview.applications.some(app => app.id === applicationId)
        );
    };

    // Sort applications by creation date (most recent first)
    const sortedApplications = [...applications].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Get upcoming interviews
    const now = new Date();
    const upcomingInterviews = allInterviews
        .filter(interview =>
            interview.status === InterviewStatus.SCHEDULED &&
            new Date(interview.scheduled_time) > now
        )
        .map(interview => ({
            interview,
            jobPosition: interview.applications[0]?.job_offer?.position || 'Unknown Position'
        }));

    const isLoading = isLoadingApplications || isLoadingInterviews;

    const candidateStats = [
        { label: t('candidate.stats.applications'), value: sortedApplications.length, icon: IconFileText, color: 'blue' },
        { label: t('candidate.stats.inProgress'), value: sortedApplications.filter(a => a.status === 'IN_PROGRESS').length, icon: IconClock, color: 'orange' },
        { label: t('candidate.stats.rejected'), value: sortedApplications.filter(a => a.status === 'REJECTED').length, icon: IconX, color: 'red' },
    ];

    if (isLoading) {
        return <LoadingOverlay visible={true} />;
    }

    return (
        <Box py={{ base: 32, md: 56 }}>
            <Box
                bg="light-dark(#fff, var(--mantine-color-dark-7))"
                style={{
                    borderRadius: 20,
                    boxShadow: 'var(--mantine-shadow-md)',
                    padding: '40px 48px',
                    maxWidth: 1600,
                    margin: '0 auto',
                }}
            >
                <Stack gap="xl">
                    {/* Page Header */}
                    <Box>
                        <Title order={1}>{t('candidate.title')}</Title>
                        <Text c="dimmed" size="lg" mt="xs">
                            {t('candidate.subtitle')}
                        </Text>
                    </Box>

                    {/* Upcoming Interviews Alert */}
                    <UpcomingInterviewsAlert upcomingInterviews={upcomingInterviews} />

                    {/* Stats Grid */}
                    <StatsGrid stats={candidateStats} />

                    {/* Applications List */}
                    {sortedApplications.length > 0 ? (
                        <Stack gap="lg">
                            {sortedApplications.map((application) => (
                                <CandidateApplicationCard
                                    key={application.id}
                                    application={application}
                                    interviews={getInterviewsForApplication(application.id)}
                                />
                            ))}
                        </Stack>
                    ) : (
                        <Alert
                            variant="light"
                            color="blue"
                            title={t('candidate.emptyState.title')}
                            icon={<IconInbox size={20} />}
                        >
                            {t('candidate.emptyState.message')}
                        </Alert>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};
