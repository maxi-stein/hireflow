import { Stack, Text, Box, Button, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
  isModal?: boolean;
}

export const JobOfferCard = ({ job, action = false, isModal = false }: JobOfferCardProps) => {
  const { t } = useTranslation('jobs');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
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

          {/* Salary */}
          {job.salary && (
            <Text fw={700} size="lg" c="blue.7" style={{ marginTop: '4px', marginBottom: '4px' }}>
              AR$ {job.salary}
              <Text component="span" size="sm" c="dimmed" fw={400}> /mes</Text>
            </Text>
          )}

          {/* Job Description */}
          <Text
            size="md"
            c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-1))"
            lineClamp={isModal ? undefined : 2}
            style={{ lineHeight: 1.6, marginBottom: '24px' }}
          >
            {job.description}
          </Text>

          {/* Skills */}
          <JobOfferSkills skills={job.skills || []} />

          {/* Benefits */}
          {job.benefits && (
            <Box style={{ marginTop: '16px' }}>
              <Text size="sm" fw={700} tt="uppercase" c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-5))" mb={4}>
                {t('benefits')}
              </Text>
              <Text
                size="sm"
                c="light-dark(var(--mantine-color-dimmed), var(--mantine-color-gray-1))"
                lineClamp={isModal ? undefined : 2}
              >
                {job.benefits}
              </Text>
            </Box>
          )}

          {/* Ver más Button */}
          {!isModal && (
            <Button variant="subtle" onClick={open} fullWidth mt="sm">
              Ver más
            </Button>
          )}

          {/* Action */}
          {action && (
            <Box mt={4}>
              {action}
            </Box>
          )}
        </Stack>
      </StyledJobCard>

      {!isModal && (
        <Modal
          opened={opened}
          onClose={close}
          title={<Title order={3}>{t('list.viewModal.title', 'Detalles de la oferta')}</Title>}
          size="lg"
        >
          <JobOfferCard job={job} isModal showSensitiveData />
        </Modal>
      )}
    </>
  );
};
