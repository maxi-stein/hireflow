import { Stack, Text, Box, Button, Modal, Title, Group, Badge, Divider, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import type { ReactNode } from 'react';
import type { JobOffer } from '../../../services/job-offer.service';
import { JobOfferMeta } from './JobOfferMeta';
import { JobOfferSkills } from './JobOfferSkills';
import { useTranslation } from 'react-i18next';
import { StyledJobCard } from './styled';
import { IconCurrencyDollar, IconEye, IconGift, IconChecklist } from '@tabler/icons-react';

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
            {/* Top row: Work Mode & Location badges (without briefcase icon) */}
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

      {/* Comprehensive Details Modal */}
      {!isModal && (
        <Modal
          opened={opened}
          onClose={close}
          title={
              <Title order={3} size="h3" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {t('jobCard.modal.title', 'Detalles de la oferta')}
            </Title>
          }
          size={780}
          radius="xl"
          padding="xl"
        >
          <Stack gap="xl" py="xs">
            {/* Header info */}
            <Box>
              <Title order={2} size="h2" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
                {job.position}
              </Title>
              <Box mt="xs">
                <JobOfferMeta location={job.location} workMode={job.work_mode} />
              </Box>
            </Box>

            {job.salary && (
              <Paper p="md" radius="lg" bg="light-dark(#f8fafc, #1e293b)" withBorder style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
                <Group gap="xs">
                  <Text size="sm" fw={600} c="dimmed">
                    {t('jobCard.modal.salaryOffered', 'Remuneración ofrecida:')}
                  </Text>
                  <Text size="lg" fw={800} c="blue.7">
                    AR$ {job.salary} <Text component="span" size="xs" c="dimmed" fw={400}>{t('jobCard.perMonth', '/mes')}</Text>
                  </Text>
                </Group>
              </Paper>
            )}

            <Divider />

            {/* Description */}
            <Paper p="lg" radius="lg" bg="light-dark(#ffffff, #1e293b)" withBorder style={{ borderColor: 'light-dark(#e2e8f0, #334155)', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)' }}>
              <Group gap="xs" mb="sm">
                <IconChecklist size={20} color="#2563eb" />
                <Text fw={700} size="sm" c="light-dark(#0f172a, #f8fafc)" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                  {t('jobCard.modal.roleDescription', 'Descripción de la posición')}
                </Text>
              </Group>
              <Text size="md" c="light-dark(#334155, #cbd5e1)" style={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {job.description}
              </Text>
            </Paper>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Box>
                <Text fw={700} size="sm" c="light-dark(#0f172a, #f8fafc)" tt="uppercase" mb="xs" style={{ letterSpacing: '0.5px' }}>
                  {t('jobCard.modal.skillsTitle', 'Habilidades requeridas')}
                </Text>
                <JobOfferSkills skills={job.skills} hideTitle />
              </Box>
            )}

            {/* Benefits */}
            {job.benefits && (
              <Paper p="lg" radius="lg" bg="light-dark(#f0fdf4, rgba(16, 185, 129, 0.08))" style={{ border: '1px solid light-dark(#bbf7d0, rgba(16, 185, 129, 0.25))', boxShadow: '0 1px 3px rgba(16, 185, 129, 0.05)' }}>
                <Group gap="xs" mb="sm">
                  <IconGift size={20} color="#10b981" />
                  <Text fw={700} size="sm" c="light-dark(#166534, #6ee7b7)" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    {t('jobCard.modal.benefitsTitle', 'Beneficios')}
                  </Text>
                </Group>
                <Text size="md" c="light-dark(#166534, #a7f3d0)" style={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {job.benefits}
                </Text>
              </Paper>
            )}

            {/* Action inside modal */}
            {action && (
              <Box mt="md" pt="md" style={{ borderTop: '1px solid light-dark(#e2e8f0, #334155)' }}>
                {action}
              </Box>
            )}
          </Stack>
        </Modal>
      )}
    </>
  );
};
