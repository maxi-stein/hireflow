import { Accordion, Group, Text, Badge, Stack, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { CompletedReviewCard } from './CompletedReviewCard';
import { StyledAccordion } from './styled';
import type { GroupedCompletedReviews } from './groupCompletedReviews';
import type { InterviewReview } from '../../../services/interview-review.service';
import { IconBriefcase } from '@tabler/icons-react';

interface CompletedReviewsAccordionProps {
  groups: GroupedCompletedReviews[];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string, reviewId?: string) => void;
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
    <StyledAccordion variant="separated" radius="lg">
      {groups.map((group) => {
        const { jobOffer, totalReviews, candidates } = group;

        return (
          <Accordion.Item key={jobOffer.id} value={jobOffer.id} style={{ borderRadius: 12 }}>
            <Accordion.Control style={{ borderRadius: 12 }}>
              <Group justify="space-between" wrap="nowrap">
                <Group gap="sm" align="center">
                  <Box
                    p={8}
                    bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
                    style={{ borderRadius: 8, color: '#2563eb' }}
                  >
                    <IconBriefcase size={18} />
                  </Box>
                  <div>
                    <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
                      {jobOffer.position}
                    </Text>
                    <Text size="xs" c="dimmed" tt="capitalize">
                      {jobOffer.work_mode}
                    </Text>
                  </div>
                </Group>
                <Group gap="sm" pr="xs">
                  <Badge variant="light" color="blue" size="md" radius="md">
                    {candidates.length} {candidates.length === 1 ? t('card.candidateSingular', 'Candidato') : t('card.candidatePlural', 'Candidatos')}
                  </Badge>
                  <Badge variant="light" color="teal" size="md" radius="md">
                    {totalReviews} {totalReviews === 1 ? t('buttons.reviewSingular', 'evaluación') : t('buttons.reviews', 'evaluaciones')}
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
