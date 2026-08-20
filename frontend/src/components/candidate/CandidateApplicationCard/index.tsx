import { Grid, Stack, Group, Button, Text, Box, ThemeIcon, Card, Divider, Badge } from '@mantine/core';
import { IconExternalLink, IconClock, IconX, IconCalendarEvent } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import type { Interview } from '../../../services/interview.service';
import { InterviewStatus } from '../../../services/interview.service';
import { ApplicationStatusBadge } from './ApplicationStatusBadge';
import { ApplicationTimeline } from './ApplicationTimeline';
import { JobOfferMeta } from '../../jobs/JobOfferCard/JobOfferMeta';
import { JobOfferSkills } from '../../jobs/JobOfferCard/JobOfferSkills';

const StyledApplicationCard = styled(Card as any)`
  background: light-dark(#ffffff, var(--mantine-color-dark-6));
  border: 1px solid light-dark(#dce8f5, var(--mantine-color-dark-4)) !important;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease !important;
  overflow: hidden !important;

  &:hover {
    transform: translateY(-4px) !important;
    box-shadow:
      0 12px 24px -10px rgba(0, 0, 0, 0.15),
      0 8px 16px -8px rgba(0, 0, 0, 0.1) !important;
  }
`;

interface CandidateApplicationCardProps {
  application: CandidateApplication;
  interviews: Interview[];
}

export const CandidateApplicationCard = ({ application, interviews }: CandidateApplicationCardProps) => {
  const { t, i18n } = useTranslation('applications');
  const { job_offer } = application;
  const navigate = useNavigate();

  const hasScheduledInterview = interviews.some(i => i.status === InterviewStatus.SCHEDULED);
  const isRejected = application.status === 'REJECTED';

  const formattedDate = new Date(application.created_at).toLocaleDateString(i18n.language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <StyledApplicationCard
      padding="xl"
      radius="md"
      withBorder
    >
      <Grid gutter="xl">
        {/* Left Column (70%) */}
        <Grid.Col span={{ base: 12, md: 8 }} style={{ display: 'flex', flexDirection: 'column' }}>
          <Stack gap={12} style={{ flexGrow: 1 }}>
            {/* Header row: Workmode & Status badge */}
            <Group justify="space-between" align="flex-start" style={{ width: '100%' }}>
              <JobOfferMeta location={job_offer.location} workMode={job_offer.work_mode} />
              <ApplicationStatusBadge status={application.status} hasScheduledInterview={hasScheduledInterview} />
            </Group>

            {/* Job Title */}
            <Text
              fw={700}
              size="xl"
              c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white))"
            >
              {job_offer.position}
            </Text>

            {/* Job Description */}
            <Text
              size="md"
              c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-1))"
              style={{ lineHeight: 1.6, wordBreak: 'break-word' }}
            >
              {job_offer.description}
            </Text>

            {/* Salary & Applied Date */}
            <Group gap="xl" align="center" style={{ marginTop: '8px', marginBottom: '8px' }}>
              {job_offer.salary && (
                <Text fw={700} size="xl" c="blue.7">
                  AR$ {job_offer.salary}
                  <Text component="span" size="sm" c="dimmed" fw={400}> /mes</Text>
                </Text>
              )}
              <Group gap="xs">
                <IconCalendarEvent size={20} color="var(--mantine-color-gray-5)" />
                <Text size="sm" c="dimmed">{t('card.appliedOn')} <Text component="span" fw={700} c="dark">{formattedDate}</Text></Text>
              </Group>
            </Group>

            {/* Skills */}
            <JobOfferSkills skills={job_offer.skills || []} />

            {/* Action (Pushed to bottom) */}
            <Box mt="auto" pt="md">
              <Button
                variant="light"
                color="blue"
                size="md"
                rightSection={<IconExternalLink size={18} />}
                onClick={() => navigate(`/jobs?highlight=${job_offer.id}`)}
              >
                {t('card.viewOriginalJob')}
              </Button>
            </Box>
          </Stack>
        </Grid.Col>

        {/* Right Column (30%) */}
        <Grid.Col span={{ base: 12, md: 4 }} style={{ borderLeft: '1px solid var(--mantine-color-gray-2)' }}>
          <Stack gap="lg" h="100%">
            {interviews.length > 0 ? (
              <ApplicationTimeline interviews={interviews} />
            ) : isRejected ? (
              <Box
                p="lg"
                bg="var(--mantine-color-red-light)"
                style={{
                  borderRadius: '8px',
                  border: '1px solid var(--mantine-color-red-light-color)',
                  height: '100%'
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
                bg="var(--mantine-color-body)"
                style={{
                  borderRadius: '12px',
                  border: '1px solid var(--mantine-color-gray-3)',
                  height: '100%',
                }}
              >
                <Stack gap="lg" justify="space-between" h="100%">
                  <Group gap="sm" wrap="nowrap" align="center">
                    <ThemeIcon size={42} radius="xl" color="blue" variant="light">
                      <IconClock size={21} />
                    </ThemeIcon>

                    <Box>
                      <Badge color="blue" variant="light" size="sm" mb={4}>
                        EN REVISIÓN
                      </Badge>

                      <Text size="sm" fw={700} c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white-7))">
                        {t('card.underReview')}
                      </Text>
                    </Box>
                  </Group>

                  <Text size="sm" c="dimmed" lh={1.6}>
                    {t('card.underReviewMessage')}
                  </Text>

                  <Box>
                    <Divider mb="sm" />

                    <Group gap={7} c="dimmed" wrap="nowrap">
                      <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                        <IconClock size={11} />
                      </ThemeIcon>
                      <Text size="xs">
                        Te notificaremos por email cuando haya novedades.
                      </Text>
                    </Group>
                  </Box>
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </StyledApplicationCard>
  );
};
