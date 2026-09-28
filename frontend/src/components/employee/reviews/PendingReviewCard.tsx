import { Paper, Group, Box, Text, Button, Badge, Stack, Collapse, useMantineColorScheme, Divider } from '@mantine/core';
import { IconCalendarEvent, IconVideo, IconUser, IconClock, IconAlertTriangle, IconPencil } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { InterviewReviewForm } from './InterviewReviewForm';
import type { Interview } from '../../../services/interview.service';
import { useTranslation } from 'react-i18next';

interface PendingReviewCardProps {
  candidateId: string;
  interviews: Interview[];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string) => void;
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

/**
 * Formats interview type into a display-friendly badge label.
 */
function getInterviewTypeLabel(type: string): string {
  switch (type) {
    case 'INDIVIDUAL':
      return 'Individual';
    case 'GROUP':
      return 'Grupal';
    default:
      return type;
  }
}

/**
 * Renders a candidate card with their pending interview reviews.
 * Shows candidate info with headline, interview metadata, days-without-review counter,
 * and an expandable review form.
 */
export function PendingReviewCard({
  candidateId,
  interviews,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
}: PendingReviewCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(['reviews']);

  const firstInterview = interviews[0];
  const candidate = firstInterview?.applications?.[0]?.candidate;

  return (
    <Stack gap="md">
      {interviews.map(interview => {
        const daysPending = getDaysSince(interview.scheduled_time);
        const isOverdue = daysPending >= 5;
        const interviewDate = new Date(interview.scheduled_time).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const interviewerNames = interview.interviewers
          ?.filter(i => i && i.user)
          .map(i => `${i.user.first_name} ${i.user.last_name}`)
          .join(', ');

        return (
          <Paper
            key={interview.id}
            withBorder
            radius="md"
            p="lg"
            bg={colorScheme === 'dark' ? 'dark.6' : isOverdue ? 'red.0' : 'white'}
            style={isOverdue ? { borderColor: 'var(--mantine-color-red-3)' } : undefined}
          >
            {/* Main content row */}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              {/* Left: Avatar + info */}
              <Group gap="md" align="flex-start" wrap="nowrap" style={{ flex: 1 }}>
                <CandidateAvatar
                  candidateId={candidateId}
                  firstName={candidate?.user?.first_name}
                  lastName={candidate?.user?.last_name}
                  size="xl"
                />
                <Box style={{ flex: 1 }}>
                  {/* Candidate name + badges */}
                  <Group gap="sm" mb={4} align="center">
                    <Text fw={700} size="md">
                      {candidate?.user?.first_name} {candidate?.user?.last_name}
                    </Text>
                    <Badge variant="light" color="violet" size="lg">
                      {interview.title || t('card.unknownPosition')}
                    </Badge>
                    <Badge variant="light" color="blue" size="lg" leftSection={<IconUser size={12} />}>
                      {getInterviewTypeLabel(interview.type)}
                    </Badge>
                  </Group>

                  {/* Headline */}
                  {candidate?.headline && (
                    <Text size="sm" c="dimmed" mb={6}>
                      {candidate.headline}
                    </Text>
                  )}

                  {/* Interview metadata row */}
                  <Group gap="lg" mt="xs">
                    <Group gap={6}>
                      <IconCalendarEvent size={14} style={{ opacity: 0.6 }} />
                      <Text size="xs" c="dimmed">
                        {t('card.interviewDate', { date: interviewDate })}
                      </Text>
                    </Group>

                    {interview.meeting_link && (
                      <Group gap={6}>
                        <IconVideo size={14} style={{ opacity: 0.6 }} />
                        <Text size="xs" c="dimmed">
                          {t('card.googleMeet')}
                        </Text>
                      </Group>
                    )}

                    {interviewerNames && (
                      <Group gap={6}>
                        <IconUser size={14} style={{ opacity: 0.6 }} />
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
                  size="lg"
                  leftSection={<IconClock size={14} />}
                >
                  {daysPending === 1
                    ? t('card.daysWithoutReview', { count: daysPending })
                    : t('card.daysWithoutReview_plural', { count: daysPending })}
                </Badge>
                <Button
                  variant="filled"
                  color="blue"
                  size="compact-md"
                  leftSection={<IconPencil size={14} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReviewClick(interview.id);
                  }}
                >
                  {selectedInterviewId === interview.id ? t('buttons.close') : t('buttons.review')}
                </Button>
              </Stack>
            </Group>

            {/* Overdue warning */}
            {isOverdue && (
              <>
                <Divider my="sm" color="red.2" />
                <Group gap="xs">
                  <IconAlertTriangle size={16} color="var(--mantine-color-red-6)" />
                  <Text size="sm" c="red.7" fw={500}>
                    {t('card.priorityWarning', { count: daysPending })}
                  </Text>
                </Group>
              </>
            )}

            {/* Expandable review form */}
            <Collapse in={selectedInterviewId === interview.id}>
              <Box pt="md">
                {selectedInterviewId === interview.id && (
                  <InterviewReviewForm
                    interviewId={interview.id}
                    onSuccess={onCloseReview}
                  />
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Stack>
  );
}
