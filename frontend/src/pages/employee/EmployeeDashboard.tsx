import { Container, Paper, Text, Title, Group, Stack, Progress, SimpleGrid, Card, LoadingOverlay, Button } from '@mantine/core';
import { IconBriefcase, IconFileText, IconCalendarEvent, IconStar, IconExternalLink, IconVideo } from '@tabler/icons-react';
import { useDashboardMetricsQuery } from '../../hooks/api/useDashboard';
import { useMyPendingReviewsQuery } from '../../hooks/api/useInterviewReviews';
import { useNavigate } from 'react-router-dom';
import { useInterviewsQuery } from '../../hooks/api/useInterviews';
import { InterviewStatus } from '../../services/interview.service';
import { DashboardListItem } from './components/DashboardListItem';
import { useMemo } from 'react';


export const EmployeeDashboard = () => {
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
    { label: 'Active Job Offers', value: metrics.activeJobOffers, icon: IconBriefcase, color: 'blue' },
    { label: 'Applications Today', value: metrics.applicationsToday, icon: IconFileText, color: 'green' },
    { label: 'Pending Interviews', value: metrics.pendingInterviews, icon: IconCalendarEvent, color: 'orange' },
    { label: 'Pending Reviews', value: metrics.pendingReviews, icon: IconStar, color: 'grape' },
  ];

  const maxCandidates = Math.max(...metrics.candidatesPerJob.map(c => c.count));


  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={2} mb="sm">Dashboard</Title>
          <Text c="dimmed">Overview of your recruitment activities</Text>
        </div>

        {/* Row 1: Key Metrics */}
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {stats.map((stat) => (
            <Paper withBorder p="md" radius="md" key={stat.label}>
              <Group>
                <stat.icon size={28} stroke={1.5} color={`var(--mantine-color-${stat.color}-6)`} />
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.label}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </SimpleGrid>

        {/* Row 2: Candidates per Job Chart */}
        <Card withBorder radius="md" p="xl">
          <Title order={3} mb="lg">Candidates per Active Job</Title>
          <Stack gap="md">
            {metrics.candidatesPerJob.map((item) => (
              <div key={item.jobTitle}>
                <Group justify="space-between" mb={5}>
                  <Text size="sm" fw={500}>{item.jobTitle}</Text>
                  <Text size="sm" fw={500}>{item.count}</Text>
                </Group>
                <Progress
                  value={(item.count / maxCandidates) * 100}
                  size="xl"
                  radius="xl"
                  color="blue"
                />
              </div>
            ))}
          </Stack>
        </Card>

        {/* Rows 3 & 4: Reviews and Interviews */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>Pending Reviews</Title>
              <Button
                variant="light"
                size="xs"
                rightSection={<IconExternalLink size={14} />}
                onClick={() => navigate('/manage/reviews')}
              >
                View All
              </Button>
            </Group>

            {pendingReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">No pending reviews</Text>
            ) : (
              <Stack gap="xs">
                {pendingReviews.map((interview, index) => {
                  const candidate = interview.applications?.[0]?.candidate;
                  const jobOffer = interview.applications?.[0]?.job_offer;

                  if (!candidate || !jobOffer) return null;

                  return (
                    <DashboardListItem
                      key={interview.id}
                      date={interview.scheduled_time}
                      candidateName={`${candidate.user?.first_name} ${candidate.user?.last_name}`}
                      candidateId={candidate.id}
                      color='orange'
                      position={jobOffer.position}
                    />
                  );
                })}
              </Stack>
            )}
          </Card>

          <Card withBorder radius="md" p="xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>Upcoming Interviews</Title>
            </Group>

            {upcomingInterviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">No upcoming interviews</Text>
            ) : (
              <Stack gap="sm">
                {upcomingInterviews.map((interview, index) => {
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
                        <Button
                          variant="light"
                          color="blue"
                          size="xs"
                          radius="md"
                          leftSection={<IconVideo size={14} />}
                          onClick={() => window.open(interview.meeting_link, '_blank')}
                        >
                          Join
                        </Button>
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
