import { Accordion, Group, Text, Badge, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CompletedReviewCard } from './CompletedReviewCard';
import { StyledAccordion } from './styled';
import type { GroupedCompletedReviews } from './groupCompletedReviews';
import type { InterviewReview } from '../../../services/interview-review.service';

interface CompletedReviewsAccordionProps {
  groups: GroupedCompletedReviews[];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string) => void;
  onCloseReview: () => void;
  isMyReview: (review: InterviewReview) => boolean;
}

export function CompletedReviewsAccordion({
  groups,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
  isMyReview,
}: CompletedReviewsAccordionProps) {
  const { t } = useTranslation(['reviews']);

  if (groups.length === 0) {
    return <Text c="dimmed" size="sm" fs="italic">{t('empty.completed')}</Text>;
  }

  return (
    <StyledAccordion variant="separated">
      {groups.map((group) => {
        const { jobOffer, totalReviews, candidates } = group;

        return (
          <Accordion.Item key={jobOffer.id} value={jobOffer.id}>
            <Accordion.Control>
              <Group justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={500} size="lg">{jobOffer.position}</Text>
                  <Text size="md" c="dimmed" tt="capitalize">{jobOffer.work_mode}</Text>
                </div>
                <Group gap="md" pr="md">
                  <Badge variant="light" color="blue" size='lg'>
                    {candidates.length} {candidates.length === 1 ? t('card.candidateSingular', 'Candidate') : t('card.candidatePlural', 'Candidates')}
                  </Badge>
                  <Badge variant="light" color="green" size='lg'>
                    {totalReviews} {totalReviews === 1 ? t('buttons.reviewSingular') : t('buttons.reviews')}
                  </Badge>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md" mt="sm">
                {candidates.map((candidateGroup) => (
                  <CompletedReviewCard
                    key={candidateGroup.candidateId}
                    candidateGroup={candidateGroup}
                    selectedInterviewId={selectedInterviewId}
                    onReviewClick={onReviewClick}
                    onCloseReview={onCloseReview}
                    isMyReview={isMyReview}
                    jobWorkMode={jobOffer.work_mode}
                  />
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </StyledAccordion>
  );
}
