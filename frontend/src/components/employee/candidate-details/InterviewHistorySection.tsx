import { Paper, Group, Title, Stack, Card, Text, Badge, Box } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { TimeDisplay } from '../../shared/TimeDisplay';


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
                <Group gap="sm">
                  <TimeDisplay
                    date={interview.scheduled_time}
                    variant="date-time"
                    color="blue"
                    size="sm"
                  />
                  <Box>
                    <Text fw={500}>{interview.type} Interview</Text>
                    <Text size="xs" c="dimmed">
                      {interview.applications[0]?.job_offer?.position || 'Unknown Position'}
                    </Text>
                  </Box>
                </Group>
                <Badge
                  color={getStatusColor(getEffectiveInterviewStatus(interview))}
                  variant="light"
                >
                  {getEffectiveInterviewStatus(interview)}
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
