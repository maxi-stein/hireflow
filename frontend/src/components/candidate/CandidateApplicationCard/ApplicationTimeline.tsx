import { Timeline, Text, Group, Badge, Stack, Box, ThemeIcon } from '@mantine/core';
import { IconCheck, IconX, IconClock, IconVideo, IconUsers, IconUser } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Interview, Interviewer } from '../../../services/interview.service';
import { InterviewStatus, InterviewType } from '../../../services/interview.service';
import { getInterviewStatusColor } from '../../../utils/application.utils';

interface ApplicationTimelineProps {
  interviews: Interview[];
}

const getInterviewStatusIcon = (status: InterviewStatus) => {
  switch (status) {
    case InterviewStatus.COMPLETED: return IconCheck;
    case InterviewStatus.CANCELLED: return IconX;
    case InterviewStatus.SCHEDULED: return IconClock;
    case InterviewStatus.RESCHEDULED: return IconClock;
    default: return IconClock;
  }
};

export const ApplicationTimeline = ({ interviews }: ApplicationTimelineProps) => {
  const { t, i18n } = useTranslation('applications');

  if (!interviews || interviews.length === 0) return null;

  const sortedInterviews = [...interviews].sort((a, b) =>
    new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
  );

  return (
    <Box pl={{ base: 0, sm: 'xs' }}>
      <Group justify="space-between" align="center" mb="lg">
        <Text size="sm" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
          {t('timeline.title')}
        </Text>
        <Text size="sm" fw={700} c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white))">
          {sortedInterviews.length}
        </Text>
      </Group>

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
                  <Text size="sm" fw={600}>
                    {interview.title}
                  </Text>
                  <Badge size="xs" variant="light" color={getInterviewStatusColor(interview.status)}>
                    {t(`timeline.statuses.${interview.status}`)}
                  </Badge>
                </Group>
              }
            >
              <Stack gap="xs" mt={4}>
                <Text size="xs" c="dimmed">
                  {t('timeline.dateTimeFormat', {
                    date: new Date(interview.scheduled_time).toLocaleDateString(i18n.language, {
                      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                    }),
                    time: new Date(interview.scheduled_time).toLocaleTimeString(i18n.language, {
                      hour: '2-digit', minute: '2-digit'
                    })
                  })}
                </Text>

                {interview.meeting_link && isUpcoming && interview.status === InterviewStatus.SCHEDULED && (
                  <Group gap={6}>
                    <ThemeIcon size="xs" color="blue" variant="light" radius="xl">
                      <IconVideo size={10} />
                    </ThemeIcon>
                    <Text size="xs" component="a" href={interview.meeting_link} target="_blank" c="blue" td="underline">
                      {t('timeline.joinMeeting')}
                    </Text>
                  </Group>
                )}

                <Stack gap={4} mt={8}>
                  <Group gap={6} align="center">
                    <ThemeIcon size="xs" color="gray" variant="transparent">
                      {interview.type === InterviewType.INDIVIDUAL ? <IconUser size={14} /> : <IconUsers size={14} />}
                    </ThemeIcon>
                    <Text size="xs" fw={600} c="dark.3">
                      {t(`timeline.interviewTypes.${interview.type}`)}
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed" lh={1.4} pl={20}>
                    {interview.interviewers.length > 0
                      ? interview.interviewers.map((i: Interviewer) => `${i.user.first_name} ${i.user.last_name}${i.position ? ` (${i.position})` : ''}`).join(', ')
                      : t('timeline.noInterviewers')}
                  </Text>
                </Stack>
              </Stack>
            </Timeline.Item>
          );
        })}
      </Timeline>
    </Box>
  );
};
