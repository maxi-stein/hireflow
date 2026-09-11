import { Paper, Group, Box, Text, Button, Badge, Stack, Collapse, useMantineColorScheme } from '@mantine/core';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { ScoreBadge } from '../../shared/ScoreBadge';
import { InterviewReviewForm } from './InterviewReviewForm';
import type { InterviewReview } from '../../../services/interview-review.service';
import { useTranslation } from 'react-i18next';

interface CompletedReviewCardProps {
  candidateId: string;
  reviews: InterviewReview[];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string) => void;
  onCloseReview: () => void;
  isMyReview: (review: InterviewReview) => boolean;
}

/**
 * Renders a candidate card with their completed reviews.
 * Shows candidate info, review list with scores, and expandable review details.
 */
export function CompletedReviewCard({
  candidateId,
  reviews,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
  isMyReview,
}: CompletedReviewCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(['reviews']);

  const firstReview = reviews[0];
  const candidate = firstReview.candidate_application?.candidate;

  return (
    <Paper withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'} p="sm">
      <Group justify="space-between" mb="xs">
        <Group gap="sm">
          <CandidateAvatar
            candidateId={candidateId}
            firstName={candidate?.user?.first_name}
            lastName={candidate?.user?.last_name}
            size={32}
          />
          <Text fw={600} size="sm">{candidate?.user?.first_name} {candidate?.user?.last_name}</Text>
        </Group>
        <Badge variant="light">{reviews.length} {reviews.length > 1 ? t('buttons.reviews') : t('buttons.reviewSingular')}</Badge>
      </Group>
      <Stack gap={0} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
        {reviews.map(review => (
          <Box key={review.id} p="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
            <Group justify="space-between" align="flex-start">
              <Box>
                <Group gap="xs">
                  <Text size="sm" fw={500}>{review.employee?.user.first_name} {review.employee?.user.last_name}</Text>
                  <ScoreBadge score={review.score} size="xs" />
                </Group>
                <Text size="xs" c="dimmed">
                  {new Date(review.created_at).toLocaleDateString()}
                </Text>
              </Box>
              <Button
                variant="subtle"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick(review.interview_id);
                }}
              >
                {selectedInterviewId === review.interview_id ? t('buttons.close') : t('buttons.details')}
              </Button>
            </Group>
            <Collapse in={selectedInterviewId === review.interview_id} mt="xs">
              {selectedInterviewId === review.interview_id && (
                <InterviewReviewForm
                  interviewId={review.interview_id}
                  reviewId={review.id}
                  readOnly={!isMyReview(review)}
                  onSuccess={onCloseReview}
                />
              )}
            </Collapse>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
