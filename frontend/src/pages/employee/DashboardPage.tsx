import { Container, Text, Title, Stack, SimpleGrid, LoadingOverlay, useMantineColorScheme } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { StatsGrid } from '../../components/shared/StatsGrid';
import { useDashboardData } from '../../hooks/domain/useDashboardData';
import { ApplicationsPerWeekChart } from '../../components/dashboard/ApplicationsPerWeekChart';
import { CandidatesPerJobWidget } from '../../components/dashboard/CandidatesPerJobWidget';
import { PendingReviewsWidget } from '../../components/dashboard/PendingReviewsWidget';
import { UpcomingInterviewsWidget } from '../../components/dashboard/UpcomingInterviewsWidget';

export const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    metrics,
    isLoading,
    stats,
    maxCandidates,
    pendingReviews,
    upcomingInterviews,
  } = useDashboardData();

  if (isLoading || !metrics) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb={4}>{t('title')}</Title>
          <Text c="dimmed" size="sm">{t('subtitle')}</Text>
        </div>

        {/* Row 1: Key Metrics */}
        <StatsGrid stats={stats} />

        {/* Row 2: Charts */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          <ApplicationsPerWeekChart
            data={metrics.applicationsPerWeek || []}
            isDark={isDark}
          />
          <CandidatesPerJobWidget
            candidatesPerJob={metrics.candidatesPerJob || []}
            maxCandidates={maxCandidates}
            isDark={isDark}
          />
        </SimpleGrid>

        {/* Rows 3 & 4: Reviews and Interviews */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <PendingReviewsWidget
            pendingReviews={pendingReviews}
            isDark={isDark}
            onViewAll={() => navigate('/manage/reviews')}
          />
          <UpcomingInterviewsWidget
            upcomingInterviews={upcomingInterviews}
            isDark={isDark}
            onViewCalendar={() => navigate('/manage/interviews')}
          />
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
