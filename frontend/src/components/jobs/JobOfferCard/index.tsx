import { Stack, Text, Box, Button, Title, Group, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import type { JobOffer } from '../../../services/job-offer.service';
import { JobOfferMeta } from './JobOfferMeta';
import { JobOfferSkills } from './JobOfferSkills';
import { useTranslation } from 'react-i18next';
import { StyledJobCard } from './styled';
import { IconCurrencyDollar, IconEye } from '@tabler/icons-react';
import { JobOfferDetailsModal } from '../JobOfferDetailsModal';

interface JobOfferCardProps {
  job: JobOffer;
  action?: ReactNode;
  showSensitiveData?: boolean;
  isModal?: boolean;
}

export const JobOfferCard = ({ job, action = false, isModal = false }: JobOfferCardProps) => {
  const { t } = useTranslation('jobs');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <StyledJobCard padding="lg">
        <Stack gap="md" style={{ height: '100%', justifyContent: 'space-between' }}>
          <Stack gap="sm">
            {/* Top row: Work Mode & Location badges */}
            <Group justify="flex-start" align="center" wrap="wrap">
              <JobOfferMeta location={job.location} workMode={job.work_mode} />
            </Group>

            {/* Job Title */}
            <Title
              order={3}
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'light-dark(#0f172a, #f8fafc)',
                lineHeight: 1.3,
                marginTop: '4px',
              }}
            >
              {job.position}
            </Title>

            {/* Salary Highlight Badge */}
            {job.salary && (
              <Badge
                size="lg"
                radius="md"
                variant="light"
                color="blue"
                leftSection={<IconCurrencyDollar size={15} />}
                style={{
                  width: 'fit-content',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                AR$ {job.salary}
                <Text component="span" size="xs" c="dimmed" fw={500} ml={4}>
                  {t('jobCard.perMonth', '/mes')}
                </Text>
              </Badge>
            )}

            {/* Job Description (Clamped) */}
            <Text
              size="sm"
              c="light-dark(#475569, #cbd5e1)"
              lineClamp={isModal ? undefined : 3}
              style={{ lineHeight: 1.6 }}
            >
              {job.description}
            </Text>

            {/* Skills */}
            <JobOfferSkills skills={job.skills || []} />
          </Stack>

          {/* Footer Card Actions */}
          <Box pt="xs" style={{ borderTop: '1px solid light-dark(#f1f5f9, #334155)', marginTop: 'auto' }}>
            <Group justify="space-between" align="center" gap="sm">
              {!isModal && (
                <Button
                  variant="subtle"
                  color="gray"
                  size="sm"
                  leftSection={<IconEye size={16} />}
                  onClick={open}
                  style={{ color: 'light-dark(#475569, #94a3b8)', fontWeight: 600 }}
                >
                  {t('jobCard.viewDetails', 'Ver detalles')}
                </Button>
              )}

              {action && (
                <Box style={{ flex: 1 }}>
                  {action}
                </Box>
              )}
            </Group>
          </Box>
        </Stack>
      </StyledJobCard>

      {!isModal && (
        <JobOfferDetailsModal
          opened={opened}
          onClose={close}
          job={job}
          action={action}
        />
      )}
    </>
  );
};
