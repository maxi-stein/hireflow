import { Paper, Group, Box, Text, Button, Badge, Stack, Collapse, useMantineColorScheme } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { ScoreBadge } from '../../shared/ScoreBadge';
import { InterviewReviewForm } from './InterviewReviewForm';
import type { InterviewReview } from '../../../services/interview-review.service';
import type { GroupedCompletedReviews } from './groupCompletedReviews';
import { useTranslation } from 'react-i18next';

interface CompletedReviewCardProps {
  candidateGroup: GroupedCompletedReviews['candidates'][0];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string) => void;
  onCloseReview: () => void;
  isMyReview: (review: InterviewReview) => boolean;
  jobWorkMode: string;
}

/**
 * Renders a candidate card with their completed reviews grouped by interview.
 */
export function CompletedReviewCard({
  candidateGroup,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
  jobWorkMode,
}: CompletedReviewCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const { t } = useTranslation(['reviews']);

  const { candidateId, candidateData, interviews } = candidateGroup;
  const candidateUser = candidateData?.user;

  return (
    <Paper withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.7' : 'white'} p="md">
      <Group justify="space-between" mb="md">
        <Group gap="md">
          <CandidateAvatar
            candidateId={candidateId}
            firstName={candidateUser?.first_name}
            lastName={candidateUser?.last_name}
            size={48}
          />
          <Text fw={600} size="md">{candidateUser?.first_name} {candidateUser?.last_name}</Text>
        </Group>
      </Group>

      <Stack gap="md">
        {interviews.map(({ interviewData, reviews }) => (
          <Paper key={interviewData.id} withBorder radius="md" p="lg" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}>
            {/* Interview Header */}
            <Group justify="space-between" align="center" mb="sm" pb="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
              <Group gap="xs">
                <Badge variant="filled" color="blue">
                  {interviewData.title || interviewData.type}
                </Badge>
                <Badge variant="light" color="grape" tt="capitalize">
                  {jobWorkMode}
                </Badge>
              </Group>
              <Group gap="xs" align="center" c="dimmed">
                <IconCalendarEvent size={16} />
                <Text size="sm">{new Date(interviewData.scheduled_time).toLocaleDateString()}</Text>
              </Group>
            </Group>

            {/* Reviews List */}
            <Stack gap={0}>
              {reviews.map(review => (
                <Box key={review.id} py="xs" style={{ borderBottom: '1px solid var(--mantine-color-default-border)', '&:last-of-type': { borderBottom: 'none' } }}>
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
                      size="compact-md"
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
                        onSuccess={onCloseReview}
                      />
                    )}
                  </Collapse>
                </Box>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
