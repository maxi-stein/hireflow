import { Timeline, Text, Group, Badge, Stack, Box, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX, IconClock, IconVideo, IconUsers } from '@tabler/icons-react';
import type { Interview, Interviewer } from '../../../services/interview.service';
import { InterviewStatus } from '../../../services/interview.service';
import { getInterviewStatusColor } from '../../../utils/application.utils';

interface ApplicationTimelineProps {
  interviews: Interview[];
}

const getInterviewStatusIcon = (status: InterviewStatus) => {
  switch (status) {
    case InterviewStatus.COMPLETED: return IconCheck;
    case InterviewStatus.CANCELLED: return IconX;
    case InterviewStatus.SCHEDULED: return IconClock;
    case InterviewStatus.RESCHEDULED: return IconClock; // Changed to Clock for Rescheduled as well
    default: return IconClock;
  }
};

export const ApplicationTimeline = ({ interviews }: ApplicationTimelineProps) => {
  if (!interviews || interviews.length === 0) return null;

  const sortedInterviews = [...interviews].sort((a, b) =>
    new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
  );

  return (
    <Box mt="md" pl={{ base: 0, sm: 'xs' }}>
      <Text size="sm" fw={700} mb="lg" c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
        Interview Process
      </Text>

      <Timeline active={sortedInterviews.length} bulletSize={26} lineWidth={2}>
        {sortedInterviews.map((interview) => {
          const StatusIcon = getInterviewStatusIcon(interview.status);
          const isUpcoming = new Date(interview.scheduled_time) > new Date();

          return (
            <Timeline.Item
              key={interview.id}
              bullet={<StatusIcon size={14} />}
              color={getInterviewStatusColor(interview.status)}
              title={
                <Group gap="apart" wrap="nowrap">
                  <Text size="sm" fw={600} style={{ textTransform: 'capitalize' }}>
                    {interview.type.toLowerCase().replace('_', ' ')} Interview
                  </Text>
                  <Badge size="xs" variant="light" color={getInterviewStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                </Group>
              }
            >
              <Stack gap="xs" mt={4}>
                <Text size="xs" c="dimmed">
                  {new Date(interview.scheduled_time).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                  {' • '}
                  {new Date(interview.scheduled_time).toLocaleTimeString('en-US', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </Text>

                {interview.meeting_link && isUpcoming && interview.status === InterviewStatus.SCHEDULED && (
                  <Group gap={6}>
                    <ThemeIcon size="xs" color="blue" variant="light" radius="xl">
                      <IconVideo size={10} />
                    </ThemeIcon>
                    <Text size="xs" component="a" href={interview.meeting_link} target="_blank" c="blue" td="underline">
                      Join Meeting Link
                    </Text>
                  </Group>
                )}

                <Group gap={6} align="flex-start">
                  <ThemeIcon size="xs" color="gray" variant="light" radius="xl" mt={2}>
                    <IconUsers size={10} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" lh={1.4}>
                    {interview.interviewers.map((i: Interviewer) => `${i.user.first_name} ${i.user.last_name}`).join(', ')}
                  </Text>
                </Group>
              </Stack>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Box>
  );
};
