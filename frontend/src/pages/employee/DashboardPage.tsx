import { Container, Text, Title, Group, Stack, Progress, SimpleGrid, Card, LoadingOverlay, Button, RingProgress, Center, Box } from '@mantine/core';
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


export const DashboardPage = () => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
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
    return [...(pendingReviewsData?.data || [])].sort((a, b) =>
      new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );
  }, [pendingReviewsData]);

  const upcomingInterviews = useMemo(() => {
    return [...(upcomingInterviewsData?.data || [])].sort((a, b) =>
      new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );
  }, [upcomingInterviewsData]);

  if (isLoading || !metrics) {
    return <LoadingOverlay visible={true} />;
  }

  const stats = [
    { label: t('stats.activeJobOffers'), value: metrics.activeJobOffers, icon: IconBriefcase, color: 'blue' },
    { label: t('stats.applicationsToday'), value: metrics.applicationsToday, icon: IconFileText, color: 'green' },
    { label: t('stats.pendingInterviews'), value: metrics.pendingInterviews, icon: IconCalendarEvent, color: 'orange' },
    { label: t('stats.pendingReviews'), value: metrics.pendingReviews, icon: IconStar, color: 'grape' },
  ];

  const maxCandidates = Math.max(...metrics.candidatesPerJob.map(c => c.count));
  const totalCandidates = metrics.candidatesPerJob.reduce((acc, curr) => acc + curr.count, 0);
  const chartColors = ['blue', 'cyan', 'teal', 'green', 'yellow', 'orange', 'red', 'pink', 'grape', 'violet'];

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="sm">{t('title')}</Title>
          <Text c="dimmed">{t('subtitle')}</Text>
        </div>

        {/* Row 1: Key Metrics */}
        <StatsGrid stats={stats} />

        {/* Row 2: Charts */}
        <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="xl">
          {/* Applications Per Week Chart */}
          <Card withBorder radius="md" p="xl">
            <Title order={3} mb="lg">Postulaciones Recibidas</Title>
            {metrics.applicationsPerWeek && metrics.applicationsPerWeek.length > 0 ? (
              <LineChart
                h={250}
                data={metrics.applicationsPerWeek}
                dataKey="date"
                withDots
                curveType="monotone"
                series={[
                  { name: 'count', color: 'blue.6', label: 'Postulaciones' },
                ]}
              />
            ) : (
              <Text c="dimmed" ta="center" py="xl">No hay datos suficientes</Text>
            )}
          </Card>

          {/* Candidates per Job Chart */}
          <Card withBorder radius="md" p="xl">
            <Title order={3} mb="lg">{t('candidatesPerJob.title')}</Title>
            <Stack gap="sm" justify="center" h="100%">
              {metrics.candidatesPerJob.length > 0 ? metrics.candidatesPerJob.map((item) => (
                <div key={item.jobTitle}>
                  <Group justify="space-between" mb={5}>
                    <Group gap="xs">
                      <Box w={12} h={12} style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-color-blue-6)' }} />
                      <Text size="xs" fw={500} lineClamp={1} style={{ maxWidth: 200 }} title={item.jobTitle}>{item.jobTitle}</Text>
                    </Group>
                    <Text size="xs" fw={500}>{item.count}</Text>
                  </Group>
                  <Progress
                    value={maxCandidates > 0 ? (item.count / maxCandidates) * 100 : 0}
                    size="md"
                    radius="xl"
                    color="blue.6"
                  />
                </div>
              )) : (
                <Text c="dimmed" ta="center">No hay datos suficientes</Text>
              )}
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Rows 3 & 4: Reviews and Interviews */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>{t('pendingReviews.title')}</Title>
              <Button
                variant="light"
                size="xs"
                rightSection={<IconExternalLink size={14} />}
                onClick={() => navigate('/manage/reviews')}
              >
                {t('pendingReviews.viewAll')}
              </Button>
            </Group>

            {pendingReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">{t('pendingReviews.empty')}</Text>
            ) : (
              <Stack gap="xs">
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
          </Card>

          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>{t('upcomingInterviews.title')}</Title>
              <Button
                variant="light"
                size="xs"
                rightSection={<IconCalendarEvent size={14} />}
                onClick={() => navigate('/manage/interviews')}
              >
                {t('upcomingInterviews.viewCalendar')}
              </Button>
            </Group>

            {upcomingInterviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">{t('upcomingInterviews.empty')}</Text>
            ) : (
              <Stack gap="sm">
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
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
