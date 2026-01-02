import { Container, Paper, Text, Title, Group, Badge, Stack, Progress, SimpleGrid, Card, LoadingOverlay } from '@mantine/core';
import { IconBriefcase, IconFileText, IconCalendarEvent, IconStar } from '@tabler/icons-react';
import { useDashboardMetricsQuery } from '../../hooks/api/useDashboard';

export const EmployeeDashboard = () => {
  const { data: metrics, isLoading } = useDashboardMetricsQuery();

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
              <Group justify="space-between">
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    {stat.label}
                  </Text>
                  <Text fw={700} size="xl">
                    {stat.value}
                  </Text>
                </div>
                <stat.icon size={28} stroke={1.5} color={stat.color} />
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

        {/* Rows 3 & 4: Placeholders */}
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <Card withBorder radius="md" p="xl" h={300}>
            <Group justify="space-between" mb="md">
              <Title order={3}>Pending Reviews</Title>
              <Badge>Coming Soon</Badge>
            </Group>
            <Text c="dimmed" ta="center" mt={100}>No pending reviews detail available yet.</Text>
          </Card>

          <Card withBorder radius="md" p="xl" h={300}>
            <Group justify="space-between" mb="md">
              <Title order={3}>Upcoming Interviews</Title>
              <Badge>Coming Soon</Badge>
            </Group>
            <Text c="dimmed" ta="center" mt={100}>No interviews detail available yet.</Text>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
};
