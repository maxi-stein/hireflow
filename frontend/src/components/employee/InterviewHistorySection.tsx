import { Paper, Group, Title, Stack, Card, Text, Badge, Box } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { type InterviewStatus } from '../../services/interview.service';

interface Interview {
  id: string;
  scheduled_time: string;
  type: string;
  status: InterviewStatus;
  applications: Array<{
    job_offer?: {
      position: string;
    };
  }>;
}

interface InterviewHistorySectionProps {
  interviews: Interview[];
  getStatusColor: (status: InterviewStatus) => string;
}

export function InterviewHistorySection({ interviews, getStatusColor }: InterviewHistorySectionProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group mb="md">
        <IconClock size={20} />
        <Title order={4}>Interview History</Title>
      </Group>

      {interviews.length > 0 ? (
        <Stack gap="md">
          {interviews.map((interview) => (
            <Card key={interview.id} withBorder padding="sm" radius="md">
              <Group justify="space-between">
                <Box>
                  <Text fw={500}>{new Date(interview.scheduled_time).toLocaleString()}</Text>
                  <Text size="xs" c="dimmed">
                    {interview.type} Interview • {interview.applications[0]?.job_offer?.position || 'Unknown Position'}
                  </Text>
                </Box>
                <Badge color={getStatusColor(interview.status)} variant="light">
                  {interview.status}
                </Badge>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Text c="dimmed" size="sm">No interviews scheduled or completed.</Text>
      )}
    </Paper>
  );
}
