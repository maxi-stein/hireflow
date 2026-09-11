import { Paper, Group, Box, Text, Button, Badge, Stack, Collapse, useMantineColorScheme } from '@mantine/core';
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
 * Renders a candidate card with their pending interview reviews.
 * Shows candidate info, interview title, job position, and expandable review forms.
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
    <Paper withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.7' : 'white'} p="md">
      <Group justify="space-between" mb="md" style={{ cursor: 'default' }}>
        <Group gap="md">
          <CandidateAvatar
            candidateId={candidateId}
            firstName={candidate?.user?.first_name}
            lastName={candidate?.user?.last_name}
            size={48}
          />
          <Text fw={600} size="md">{candidate?.user?.first_name} {candidate?.user?.last_name}</Text>
        </Group>
      </Group>
      <Stack gap="md">
        {interviews.map(interview => (
          <Paper key={interview.id} withBorder radius="md" p="lg" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}>
            <Group justify="space-between" align="center">
              <Box>
                <Badge variant="filled" color="blue" size='lg' mb="md">
                  {interview.title || interview.applications[0]?.job_offer?.position || t('card.unknownPosition')}
                </Badge>
                <Text size="md">
                  {interview.applications[0]?.job_offer?.position || t('card.unknownPosition')}
                </Text>
              </Box>
              <Button
                variant={selectedInterviewId === interview.id ? "filled" : "light"}
                size="compact-md"
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick(interview.id);
                }}
              >
                {selectedInterviewId === interview.id ? t('buttons.close') : t('buttons.review')}
              </Button>
            </Group>
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
        ))}
      </Stack>
    </Paper>
  );
}
