import { Stack, Group, Title, Button, Text, Box, ThemeIcon } from '@mantine/core';
import { IconExternalLink, IconClock, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { Interview } from '../../../services/interview.service';
import { InterviewStatus } from '../../../services/interview.service';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationTimeline } from './ApplicationTimeline';
import { StyledJobCard } from '../../jobs/JobOfferCard/styled';
import { JobOfferMeta } from '../../jobs/JobOfferCard/JobOfferMeta';

interface CandidateApplicationCardProps {
  application: CandidateApplication;
  interviews: Interview[];
}

export const CandidateApplicationCard = ({ application, interviews }: CandidateApplicationCardProps) => {
  const { t } = useTranslation('applications');
  const { job_offer } = application;
  const navigate = useNavigate();

  const hasScheduledInterview = interviews.some(i => i.status === InterviewStatus.SCHEDULED);
  const isRejected = application.status === 'REJECTED';

  const formattedDate = new Date(application.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <StyledJobCard padding="lg" radius="md" withBorder>
      <Stack gap={12}>
        <Group justify="space-between" align="flex-start">
          <JobOfferMeta location={job_offer.location} workMode={job_offer.work_mode} />
          <Text size="xs" c="dimmed" fw={500}>
            Applied: {formattedDate}
          </Text>
        </Group>

        <Text
          fw={700}
          size="xl"
          c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white))"
        >
          {job_offer.position}
        </Text>

        <Box>
          <ApplicationStatusBadge status={application.status} hasScheduledInterview={hasScheduledInterview} />
        </Box>

        <Stack gap="lg" mt="sm">
          {interviews.length > 0 ? (
            <ApplicationTimeline interviews={interviews} />
          ) : isRejected ? (
            <Box
              p="lg"
              bg="var(--mantine-color-red-light)"
              style={{
                borderRadius: '8px',
                border: '1px solid var(--mantine-color-red-light-color)'
              }}
            >
              <Group align="center" gap="md">
                <ThemeIcon size="lg" radius="xl" variant="white" color="red">
                  <IconX size={20} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} c="red.9">{t('card.rejected')}</Text>
                  <Text size="sm" c="red.8" lh={1.4}>
                    {t('card.rejectedMessage')}
                  </Text>
                </Box>
              </Group>
            </Box>
          ) : (
            <Box
              p="lg"
              bg="var(--mantine-color-blue-light)"
              style={{
                borderRadius: '8px',
                border: '1px solid var(--mantine-color-blue-light-color)'
              }}
            >
              <Group align="center" gap="md">
                <ThemeIcon size="lg" radius="xl" variant="white" color="blue">
                  <IconClock size={20} />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={600} c="blue.9">{t('card.underReview')}</Text>
                  <Text size="sm" c="blue.8" lh={1.4}>
                    {t('card.underReviewMessage')}
                  </Text>
                </Box>
              </Group>
            </Box>
          )}
        </Stack>

        <Box mt={4}>
          <Button
            variant="subtle"
            color="gray"
            size="sm"
            fullWidth
            rightSection={<IconExternalLink size={16} />}
            onClick={() => navigate(`/jobs?highlight=${job_offer.id}`)}
          >
            {t('card.viewOriginalJob')}
          </Button>
        </Box>
      </Stack>
    </StyledJobCard>
  );
};

