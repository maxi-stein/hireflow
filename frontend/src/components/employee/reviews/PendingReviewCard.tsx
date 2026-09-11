import { Paper, Group, Box, Text, Button, Stack, Collapse, useMantineColorScheme } from '@mantine/core';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { TimeDisplay } from '../../shared/TimeDisplay';
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
 * Renders a candidate card with their pending interview reviews.
 * Shows candidate info, interview list with dates, and expandable review forms.
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
  const candidate = firstInterview.applications[0].candidate;

  return (
    <Paper withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'} p="sm">
      <Group justify="space-between" mb="xs" style={{ cursor: 'default' }}>
        <Group gap="sm">
          <CandidateAvatar
            candidateId={candidateId}
            firstName={candidate?.user?.first_name}
            lastName={candidate?.user?.last_name}
            size={32}
          />
          <Text fw={600} size="sm">{candidate?.user?.first_name} {candidate?.user?.last_name}</Text>
        </Group>
      </Group>
      <Stack gap={0} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        {interviews.map(interview => (
          <Box key={interview.id} p="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
            <Group justify="space-between">
              <Group gap="sm">
                <TimeDisplay
                  date={interview.scheduled_time}
                  variant="date-time"
                  color="orange"
                  size="sm"
                />
                <Box>
                  <Text size="sm" fw={500}>{interview.type} Interview</Text>
                  <Text size="xs" c="dimmed">
                    {interview.applications[0]?.job_offer?.position || t('card.unknownPosition')}
                  </Text>
                </Box>
              </Group>
              <Button
                variant={selectedInterviewId === interview.id ? "filled" : "light"}
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick(interview.id);
                }}
              >
                {selectedInterviewId === interview.id ? t('buttons.close') : t('buttons.review')}
              </Button>
            </Group>
            <Collapse in={selectedInterviewId === interview.id}>
              <Box p="md">
                {selectedInterviewId === interview.id && (
                  <InterviewReviewForm
                    interviewId={interview.id}
                    onSuccess={onCloseReview}
                  />
                )}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
