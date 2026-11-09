import {
  Modal,
  Button,
  Text,
  Stack,
  Group,
  Box,
  Paper,
  Title,
  Divider,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../../services/job-offer.service';
import { IconBriefcase, IconSparkles, IconCheck } from '@tabler/icons-react';
import { useJobApplicationForm } from '../../hooks/domain/useJobApplicationForm';
import { SkillExperienceInputRow } from './SkillExperienceInputRow';

interface JobApplicationModalProps {
  opened: boolean;
  onClose: () => void;
  jobOffer: JobOffer;
  candidateId: string;
  onSuccess: () => void;
}

export const JobApplicationModal = ({
  opened,
  onClose,
  jobOffer,
  candidateId,
  onSuccess,
}: JobApplicationModalProps) => {
  const { t } = useTranslation(['applications', 'common']);

  const { form, submitting, handleSubmit } = useJobApplicationForm({
    jobOffer,
    candidateId,
    onSuccess,
    onClose,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      radius="lg"
      title={
        <Group gap="xs">
          <Box p={6} bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))" style={{ borderRadius: 8, color: '#2563eb' }}>
            <IconBriefcase size={20} />
          </Box>
          <Box>
            <Title order={3} size="h4" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {jobOffer.position}
            </Title>
            <Text size="xs" c="dimmed">
              {t('applications:modal.completeExperience', 'Completar experiencia requerida')}
            </Text>
          </Box>
        </Group>
      }
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Paper p="md" radius="md" bg="light-dark(#f8fafc, #0f172a)" withBorder style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
            <Group gap="xs" align="flex-start" wrap="nowrap">
              <IconSparkles size={20} color="#2563eb" style={{ flexShrink: 0, marginTop: 2 }} />
              <Text size="sm" c="light-dark(#475569, #94a3b8)" lh={1.5}>
                {t(
                  'applications:modal.description',
                  'Indica tus años de experiencia comprobable en cada tecnología solicitada.'
                )}
              </Text>
            </Group>
          </Paper>

          {/* List of skills as interactive rows */}
          <Stack gap="sm">
            {jobOffer.skills.map((skill) => (
              <SkillExperienceInputRow
                key={skill.id}
                skill={skill}
                value={form.values[skill.id] || 0}
                onChange={(val) => form.setFieldValue(skill.id, val)}
                error={form.errors[skill.id] as string}
              />
            ))}
          </Stack>

          <Divider />

          {/* Footer Actions */}
          <Group justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              {t('applications:modal.disclaimer', '* Podrás actualizar tu perfil en cualquier momento.')}
            </Text>
            <Group gap="sm">
              <Button variant="default" onClick={onClose} disabled={submitting}>
                {t('common:actions.cancel', 'Cancelar')}
              </Button>
              <Button
                type="submit"
                color="blue"
                loading={submitting}
                leftSection={<IconCheck size={16} />}
                style={{ fontWeight: 700 }}
              >
                {t('applications:modal.submit', 'Confirmar postulación')}
              </Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};
