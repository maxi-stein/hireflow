import { Card, Stack, Group, Title, Text, Box } from '@mantine/core';
import type { ReactNode } from 'react';
import type { JobOffer } from '../../../services/job-offer.service';
import { JobOfferMeta } from './JobOfferMeta';
import { JobOfferSkills } from './JobOfferSkills';
import { JobOfferDetails } from './JobOfferDetails';
import { useTranslation } from 'react-i18next';

interface JobOfferCardProps {
  job: JobOffer;
  action?: ReactNode;
  showSensitiveData?: boolean;
}

export const JobOfferCard = ({ job, action, showSensitiveData = false }: JobOfferCardProps) => {
  const { t } = useTranslation('jobs');
  return (
    <Card
      padding="lg"
      radius="md"
      withBorder
      className="job-card-hover"
      style={{
        borderLeft: `4px solid var(--mantine-color-blue-filled)`,
      }}
    >
      {/* Header Section */}
      <Card.Section
        bg="var(--mantine-color-body)"
        withBorder
        inheritPadding
        py="md"
        style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1 }}>
            <Title order={3} size="h4" fw={700}>
              {job.position}
            </Title>
            <JobOfferMeta location={job.location} workMode={job.work_mode} />
          </Stack>

          {/* Action button in header on desktop if desired, but keeping it in body for now as per design */}
        </Group>
      </Card.Section>

      <Group wrap="nowrap" align="flex-start" gap="xl" mt="md">
        {/* Left side - Main content */}
        <Stack gap="sm" style={{ flex: 1 }}>

          {/* Description */}
          <Text c="dimmed" size="sm" lineClamp={2} style={{ lineHeight: 1.6 }}>
            {job.description}
          </Text>

          {/* Details & Skills */}
          <Stack gap="md" mt={4}>
            <JobOfferDetails
              salary={job.salary}
              deadline={job.deadline}
              showSensitiveData={showSensitiveData}
            />
            <JobOfferSkills skills={job.skills || []} />
          </Stack>

        </Stack>

        {/* Right side - Action button */}
        {action && (
          <Box style={{ minWidth: '180px', alignSelf: 'center' }}>
            {action}
          </Box>
        )}
      </Group>

      {/* Benefits Footer */}
      {job.benefits && (
        <Card.Section
          inheritPadding
          py="md"
          mt="lg"
          style={{
            borderTop: '1px solid var(--mantine-color-default-border)',
            backgroundColor: 'var(--mantine-color-gray-light)', // Uses theme light color (gray.0 in light, dark.8 in dark usually)
          }}
          bg="var(--mantine-color-default-hover)"
        >
          <Group gap={8} align="center">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed">{t('benefits')}:</Text>
            <Text size="sm">{job.benefits}</Text>
          </Group>
        </Card.Section>
      )}
    </Card>
  );
};
