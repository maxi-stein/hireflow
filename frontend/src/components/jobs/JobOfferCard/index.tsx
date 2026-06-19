import { Stack, Text, Box } from '@mantine/core';
import type { ReactNode } from 'react';
import type { JobOffer } from '../../../services/job-offer.service';
import { JobOfferMeta } from './JobOfferMeta';
import { JobOfferSkills } from './JobOfferSkills';
import { useTranslation } from 'react-i18next';
import { StyledJobCard } from './styled';

interface JobOfferCardProps {
  job: JobOffer;
  action?: ReactNode;
  showSensitiveData?: boolean;
}

export const JobOfferCard = ({ job, action = false }: JobOfferCardProps) => {
  const { t } = useTranslation('jobs');

  return (
    <StyledJobCard padding="lg" radius="md" withBorder>
      <Stack gap={12}>
        {/* Workmode */}
        <JobOfferMeta location={job.location} workMode={job.work_mode} />

        {/* Job Title*/}
        <Text
          fw={700}
          size="xl"
          c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-white))"
        >
          {job.position}
        </Text>

        {/* Job Description */}
        <Text
          size="lg"
          c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-1))"
          lineClamp={2}
          style={{ lineHeight: 1.6 }}
        >
          {job.description}
        </Text>

        {/* Salary */}
        {job.salary && (
          <Text fw={700} size="xl" c="blue.7" style={{ marginTop: '16px', marginBottom: '16px' }}>
            AR$ {job.salary}
            <Text component="span" size="xl" c="dimmed" fw={400}> /mes</Text>
          </Text>
        )}

        {/* Skills */}
        <JobOfferSkills skills={job.skills || []} />

        {/* Benefits */}
        {job.benefits && (
          <Box style={{ marginTop: '16px' }}>
            <Text size="md" fw={700} tt="uppercase" c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-5))" mb={4}>
              {t('benefits')}
            </Text>
            <Text size="lg" c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-1))">
              {job.benefits}
            </Text>
          </Box>
        )}

        {/* Action */}
        {action && (
          <Box mt={4}>
            {action}
          </Box>
        )}
      </Stack>
    </StyledJobCard>
  );
};
