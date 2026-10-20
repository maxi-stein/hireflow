import {
  Modal,
  Button,
  Text,
  Stack,
  NumberInput,
  Group,
  Box,
  Paper,
  Title,
  Divider,
  ActionIcon,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../../services/job-offer.service';
import { candidateApplicationService } from '../../services/candidate-application.service';
import {
  IconBriefcase,
  IconSparkles,
  IconCheck,
  IconPlus,
  IconMinus,
  IconCode,
} from '@tabler/icons-react';

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
  const [submitting, setSubmitting] = useState(false);

  // Dynamic initial values based on skills
  const initialValues: Record<string, number> = {};
  jobOffer.skills.forEach((skill) => {
    initialValues[skill.id] = 0;
  });

  const form = useForm({
    initialValues,
    validate: (values) => {
      const errors: Record<string, string> = {};
      jobOffer.skills.forEach((skill) => {
        if (
          values[skill.id] === undefined ||
          values[skill.id] === null ||
          values[skill.id] < 0
        ) {
          errors[skill.id] = t('applications:modal.validationError', 'Ingresá un valor válido (0 o más)');
        }
      });
      return errors;
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true);
    try {
      const skillAnswers = Object.entries(values).map(([skillId, years]) => ({
        job_offer_skill_id: skillId,
        years_of_experience: Number(years) || 0,
      }));

      await candidateApplicationService.create({
        candidate_id: candidateId,
        job_offer_id: jobOffer.id,
        skill_answers: skillAnswers,
      });

      notifications.show({
        title: t('applications:modal.successTitle', '¡Postulación enviada con éxito!'),
        message: t(
          'applications:modal.successMessage',
          'Recibimos tus respuestas. Podrás seguir el avance desde tu panel de postulaciones.'
        ),
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      notifications.show({
        title: t('applications:modal.errorTitle', 'Error al postular'),
        message:
          error.response?.data?.message ||
          t('applications:modal.errorMessage', 'Ocurrió un error al registrar la postulación'),
        color: 'red',
      });
    } finally {
      setSubmitting(false);
    }
  };

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

          {/* List of skills as interactive cards */}
          <Stack gap="sm">
            {jobOffer.skills.map((skill) => {
              const currentVal = form.values[skill.id] || 0;

              return (
                <Paper
                  key={skill.id}
                  p="md"
                  radius="md"
                  withBorder
                  style={{
                    backgroundColor: 'light-dark(#ffffff, #1e293b)',
                    borderColor: currentVal > 0 ? '#bfdbfe' : 'light-dark(#e2e8f0, #334155)',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <Group justify="space-between" align="center" wrap="wrap" gap="md">
                    <Box style={{ flex: 1, minWidth: 200 }}>
                      <Group gap="xs">
                        <IconCode size={18} color="#2563eb" />
                        <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
                          {skill.skill_name}
                        </Text>
                      </Group>
                    </Box>

                    {/* Stepper & input controls */}
                    <Group gap="xs" align="center">
                      <ActionIcon
                        size="md"
                        variant="default"
                        radius="md"
                        disabled={currentVal <= 0}
                        onClick={() => form.setFieldValue(skill.id, Math.max(0, currentVal - 1))}
                      >
                        <IconMinus size={14} />
                      </ActionIcon>

                      <NumberInput
                        min={0}
                        max={40}
                        step={1}
                        w={80}
                        size="sm"
                        styles={{ input: { textAlign: 'center', fontWeight: 700 } }}
                        {...form.getInputProps(skill.id)}
                      />

                      <ActionIcon
                        size="md"
                        variant="default"
                        radius="md"
                        onClick={() => form.setFieldValue(skill.id, currentVal + 1)}
                      >
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              );
            })}
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
