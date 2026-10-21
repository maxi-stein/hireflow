import { Paper, Group, Box, Text, Button, Badge, Stack, useMantineColorScheme } from '@mantine/core';
import { IconCalendarEvent, IconVideo, IconUser, IconClock, IconAlertTriangle, IconPencil } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import type { Interview } from '../../../services/interview.service';
import { useTranslation } from 'react-i18next';

interface PendingReviewCardProps {
  candidateId: string;
  interviews: Interview[];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string, reviewId?: string, interview?: Interview) => void;
  onCloseReview: () => void;
}

/**
 * Calculates the number of full days between a given date and now.
 */
function getDaysSince(dateStr: string): number {
  const then = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function PendingReviewCard({
  candidateId,
  interviews,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
}: PendingReviewCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t, i18n } = useTranslation(['reviews', 'calendar']);

  const firstInterview = interviews[0];
  const candidate = firstInterview?.applications?.[0]?.candidate;

  const getInterviewTypeLabel = (type: string): string => {
    switch (type) {
      case 'INDIVIDUAL':
        return t('modal.types.individual', { ns: 'calendar', defaultValue: 'Individual' });
      case 'GROUP':
        return t('modal.types.group', { ns: 'calendar', defaultValue: 'Grupal' });
      default:
        return type;
    }
  };

  return (
    <Stack gap="md">
      {interviews.map(interview => {
        const daysPending = getDaysSince(interview.scheduled_time);
        const isOverdue = daysPending >= 5;
        const interviewDate = new Date(interview.scheduled_time).toLocaleDateString(i18n.language, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const interviewerNames = interview.interviewers
          ?.filter(i => i && i.user)
          .map(i => `${i.user.first_name} ${i.user.last_name}`)
          .join(', ');

        const isSelected = selectedInterviewId === interview.id;

        return (
          <Paper
            key={interview.id}
            withBorder
            radius="lg"
            p="lg"
            bg={
              isOverdue
                ? isDark
                  ? 'rgba(239, 68, 68, 0.08)'
                  : '#fff8f8'
                : isDark
                ? '#1e293b'
                : '#ffffff'
            }
            style={{
              borderColor: isOverdue
                ? isDark
                  ? 'rgba(239, 68, 68, 0.4)'
                  : '#fecaca'
                : isDark
                ? '#334155'
                : '#e2e8f0',
              boxShadow: isDark
                ? '0 2px 10px rgba(0, 0, 0, 0.3)'
                : '0 2px 10px rgba(15, 23, 42, 0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {/* Main content row */}
            <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
              {/* Left: Avatar + info */}
              <Group gap="md" align="flex-start" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                <CandidateAvatar
                  candidateId={candidateId}
                  firstName={candidate?.user?.first_name}
                  lastName={candidate?.user?.last_name}
                  size="xl"
                />
                <Box style={{ flex: 1, minWidth: 0 }}>
                  {/* Candidate name + badges */}
                  <Group gap="sm" mb={4} align="center" wrap="wrap">
                    <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
                      {candidate?.user?.first_name} {candidate?.user?.last_name}
                    </Text>
                    <Badge variant="light" color="violet" size="md" radius="md">
                      {interview.title || t('card.unknownPosition')}
                    </Badge>
                    <Badge variant="light" color="blue" size="md" radius="md" leftSection={<IconUser size={12} />}>
                      {getInterviewTypeLabel(interview.type)}
                    </Badge>
                  </Group>

                  {/* Headline */}
                  {candidate?.headline && (
                    <Text size="sm" c="dimmed" mb={6} lineClamp={1}>
                      {candidate.headline}
                    </Text>
                  )}

                  {/* Interview metadata row */}
                  <Group gap="lg" mt="xs" wrap="wrap">
                    <Group gap={6}>
                      <IconCalendarEvent size={15} color={isDark ? '#94a3b8' : '#64748b'} />
                      <Text size="xs" c="dimmed">
                        {t('card.interviewDate', { date: interviewDate })}
                      </Text>
                    </Group>

                    {interview.meeting_link && (
                      <Group gap={6}>
                        <IconVideo size={15} color={isDark ? '#94a3b8' : '#64748b'} />
                        <Text
                          size="xs"
                          c="dimmed"
                          component="a"
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'underline dotted', cursor: 'pointer' }}
                        >
                          {t('card.meetingLink')}
                        </Text>
                      </Group>
                    )}

                    {interviewerNames && (
                      <Group gap={6}>
                        <IconUser size={15} color={isDark ? '#94a3b8' : '#64748b'} />
                        <Text size="xs" c="dimmed">
                          {t('card.interviewedBy')} {interviewerNames}
                        </Text>
                      </Group>
                    )}
                  </Group>
                </Box>
              </Group>

              {/* Right: days counter + action button */}
              <Stack gap="xs" align="flex-end" style={{ flexShrink: 0 }}>
                <Badge
                  variant="light"
                  color={isOverdue ? 'red' : 'orange'}
                  size="md"
                  radius="md"
                  leftSection={<IconClock size={13} />}
                >
                  {daysPending === 1
                    ? t('card.daysWithoutReview', { count: daysPending })
                    : t('card.daysWithoutReview_plural', { count: daysPending })}
                </Badge>
                <Button
                  variant="filled"
                  color="blue"
                  size="xs"
                  radius="md"
                  leftSection={<IconPencil size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewClick(interview.id, undefined, interview);
                  }}
                  style={{ fontWeight: 600 }}
                >
                  {t('buttons.review')}
                </Button>
              </Stack>
            </Group>

            {/* Overdue warning banner */}
            {isOverdue && (
              <Box
                mt="md"
                p="xs"
                bg={isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'}
                style={{
                  borderRadius: 8,
                  border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`,
                }}
              >
                <Group gap="xs">
                  <IconAlertTriangle size={16} color="var(--mantine-color-red-6)" />
                  <Text size="xs" c={isDark ? '#fca5a5' : '#b91c1c'} fw={600}>
                    {t('card.priorityWarning', { count: daysPending })}
                  </Text>
                </Group>
              </Box>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
}
