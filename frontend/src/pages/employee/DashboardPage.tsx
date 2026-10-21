import { Container, Text, Title, Group, Stack, Progress, SimpleGrid, Button, Box, useMantineColorScheme } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { IconBriefcase, IconFileText, IconCalendarEvent, IconStar, IconExternalLink } from '@tabler/icons-react';
import { useDashboardMetricsQuery } from '../../hooks/api/useDashboard';
import { useMyPendingReviewsQuery } from '../../hooks/api/useInterviewReviews';
import { useNavigate } from 'react-router-dom';
import { useInterviewsQuery } from '../../hooks/api/useInterviews';
import { InterviewStatus } from '../../services/interview.service';
import { DashboardListItem } from './components/DashboardListItem';
import { StatsGrid } from '../../components/shared/StatsGrid';
import { JoinMeetingButton } from '../../components/shared/JoinMeetingButton';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { LoadingOverlay } from '@mantine/core';


export const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { data: metrics, isLoading } = useDashboardMetricsQuery();
  const { data: pendingReviewsData } = useMyPendingReviewsQuery(1, 10);

  // Memoize the start date to prevent infinite refetching loops
  const startDate = useMemo(() => new Date().toISOString(), []);

  const { data: upcomingInterviewsData } = useInterviewsQuery({
    limit: 10,
    status: [InterviewStatus.SCHEDULED, InterviewStatus.RESCHEDULED],
    start_date: startDate
  });

  const pendingReviews = useMemo(() => {
    return [...(pendingReviewsData?.data || [])]
      .filter((interview) => interview.applications?.some(app => app.candidate && app.job_offer))
      .sort((a, b) =>
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      );
  }, [pendingReviewsData]);

  const upcomingInterviews = useMemo(() => {
    return [...(upcomingInterviewsData?.data || [])]
      .filter((interview) => interview.applications?.[0]?.candidate && interview.applications?.[0]?.job_offer)
      .sort((a, b) =>
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      );
  }, [upcomingInterviewsData]);

  if (isLoading || !metrics) {
    return <LoadingOverlay visible={true} />;
  }

  const stats = [
    { label: t('stats.activeJobOffers'), value: metrics.activeJobOffers, icon: IconBriefcase, color: 'blue' },
    { label: t('stats.applicationsToday'), value: metrics.applicationsToday, icon: IconFileText, color: 'teal' },
    { label: t('stats.pendingInterviews'), value: metrics.pendingInterviews, icon: IconCalendarEvent, color: 'violet' },
    { label: t('stats.pendingReviews'), value: metrics.pendingReviews, icon: IconStar, color: 'amber' },
  ];

  const maxCandidates = Math.max(...metrics.candidatesPerJob.map(c => c.count));

  const panelStyle = {
    borderRadius: 16,
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: isDark
      ? 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)'
      : '#ffffff',
    boxShadow: isDark
      ? '0 4px 20px rgba(0,0,0,0.3)'
      : '0 4px 20px rgba(15,23,42,0.05)',
    padding: '24px',
  };

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
          {/* Applications Per Week Chart */}
          <Box style={panelStyle}>
            <Title order={4} mb="lg" fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {t('applicationsPerWeek.title')}
            </Title>
            {metrics.applicationsPerWeek && metrics.applicationsPerWeek.length > 0 ? (
              <LineChart
                h={220}
                data={metrics.applicationsPerWeek}
                dataKey="date"
                withDots
                curveType="monotone"
                gridAxis="y"
                withXAxis
                withYAxis
                series={[
                  { name: 'count', color: 'blue.5', label: t('applicationsPerWeek.label') },
                ]}
                styles={{
                  root: { fontFamily: 'inherit' },
                }}
              />
            ) : (
              <Text c="dimmed" ta="center" py="xl">{t('applicationsPerWeek.empty')}</Text>
            )}
          </Box>

          {/* Candidates per Job Chart */}
          <Box style={panelStyle}>
            <Title order={4} mb="lg" fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {t('candidatesPerJob.title')}
            </Title>
            <Stack gap="md" justify="center" h="100%">
              {metrics.candidatesPerJob.length > 0 ? metrics.candidatesPerJob.map((item, i) => {
                const barColors = ['blue', 'violet', 'teal', 'orange', 'pink', 'indigo'];
                const col = barColors[i % barColors.length];
                return (
                  <div key={item.jobTitle}>
                    <Group justify="space-between" mb={6}>
                      <Text size="sm" fw={500} lineClamp={1} style={{ maxWidth: 200 }} title={item.jobTitle}>
                        {item.jobTitle}
                      </Text>
                      <Text size="xs" fw={700} c={`${col}.6`}>{item.count}</Text>
                    </Group>
                    <Progress
                      value={maxCandidates > 0 ? (item.count / maxCandidates) * 100 : 0}
                      size="sm"
                      radius="xl"
                      color={col}
                    />
                  </div>
                );
              }) : (
                <Text c="dimmed" ta="center">No hay datos suficientes</Text>
              )}
            </Stack>
          </Box>
        </SimpleGrid>

        {/* Rows 3 & 4: Reviews and Interviews */}
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Box style={panelStyle}>
            <Group justify="space-between" mb="lg">
              <Title order={4} fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {t('pendingReviews.title')}
              </Title>
              <Button
                variant="subtle"
                size="xs"
                rightSection={<IconExternalLink size={13} />}
                onClick={() => navigate('/manage/reviews')}
                style={{ fontWeight: 600 }}
              >
                {t('pendingReviews.viewAll')}
              </Button>
            </Group>

            {pendingReviews.length === 0 ? (
              <Box
                py="xl"
                style={{
                  textAlign: 'center',
                  borderRadius: 12,
                  border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
                }}
              >
                <Text c="dimmed" size="sm">{t('pendingReviews.empty')}</Text>
              </Box>
            ) : (
              <Stack gap={2}>
                {pendingReviews.flatMap((interview) => {
                  return (interview.applications || []).map((app) => {
                    const candidate = app.candidate;
                    const jobOffer = app.job_offer;

                    if (!candidate || !jobOffer) return null;

                    return (
                      <DashboardListItem
                        key={`${interview.id}-${app.id}`}
                        date={interview.scheduled_time}
                        candidateName={`${candidate.user?.first_name} ${candidate.user?.last_name}`}
                        candidateId={candidate.id}
                        color='orange'
                        position={jobOffer.position}
                      />
                    );
                  });
                })}
              </Stack>
            )}
          </Box>

          <Box style={panelStyle}>
            <Group justify="space-between" mb="lg">
              <Title order={4} fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {t('upcomingInterviews.title')}
              </Title>
              <Button
                variant="subtle"
                size="xs"
                rightSection={<IconCalendarEvent size={13} />}
                onClick={() => navigate('/manage/interviews')}
                style={{ fontWeight: 600 }}
              >
                {t('upcomingInterviews.viewCalendar')}
              </Button>
            </Group>

            {upcomingInterviews.length === 0 ? (
              <Box
                py="xl"
                style={{
                  textAlign: 'center',
                  borderRadius: 12,
                  border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
                }}
              >
                <Text c="dimmed" size="sm">{t('upcomingInterviews.empty')}</Text>
              </Box>
            ) : (
              <Stack gap={2}>
                {upcomingInterviews.map((interview) => {
                  const candidate = interview.applications?.[0]?.candidate;
                  const jobOffer = interview.applications?.[0]?.job_offer;
                  if (!candidate || !jobOffer) return null;

                  return (
                    <DashboardListItem
                      key={interview.id}
                      date={interview.scheduled_time}
                      candidateName={`${candidate.user?.first_name} ${candidate.user?.last_name}`}
                      candidateId={candidate.id}
                      position={jobOffer.position}
                      action={
                        interview.meeting_link ? (
                          <JoinMeetingButton meetingLink={interview.meeting_link} />
                        ) : undefined
                      }
                    />
                  );
                })}
              </Stack>
            )}
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
