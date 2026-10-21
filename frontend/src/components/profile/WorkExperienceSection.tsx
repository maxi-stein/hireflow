import { useState } from 'react';
import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  Text,
  Modal,
  TextInput,
  Textarea,
  Checkbox,
  ActionIcon,
  Timeline,
  Box,
  Badge,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { DateInput } from '@mantine/dates';
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { WorkExperience } from '../../services/work-experience.service';
import { workExperienceService } from '../../services/work-experience.service';
import dayjs from 'dayjs';
import { validateWithJoi } from '../../utils/form-validation';
import { workExperienceSchema } from '../../schemas/profile.schema';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';

interface WorkExperienceSectionProps {
  candidateId: string;
  experiences: WorkExperience[];
  onUpdate: () => void;
}

const formatExperienceDuration = (
  start: string,
  end?: string | null,
  t?: (key: string, options?: any) => string
) => {
  const startDate = dayjs(start);
  const endDate = end ? dayjs(end) : dayjs();
  const monthsDiff = endDate.diff(startDate, 'month') + 1;
  const years = Math.floor(monthsDiff / 12);
  const months = monthsDiff % 12;

  const parts = [];
  if (years > 0) {
    parts.push(
      t
        ? (years === 1 ? t('experience.durationYear', '1 año') : t('experience.durationYears', { count: years, defaultValue: `${years} años` }))
        : `${years} ${years === 1 ? 'año' : 'años'}`
    );
  }
  if (months > 0) {
    parts.push(
      t
        ? (months === 1 ? t('experience.durationMonth', '1 mes') : t('experience.durationMonths', { count: months, defaultValue: `${months} meses` }))
        : `${months} ${months === 1 ? 'mes' : 'meses'}`
    );
  }
  return parts.length > 0
    ? parts.join(' ')
    : (t ? t('experience.durationLessMonth', 'Menos de un mes') : 'Menos de un mes');
};

export const WorkExperienceSection = ({
  candidateId,
  experiences,
  onUpdate,
}: WorkExperienceSectionProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      company: '',
      position: '',
      description: '',
      start_date: null as Date | null,
      end_date: null as Date | null,
    },
    validate: validateWithJoi(workExperienceSchema),
  });

  const handleOpen = (experience?: WorkExperience) => {
    if (experience) {
      setEditingId(experience.id);
      form.setValues({
        company: experience.company_name,
        position: experience.position,
        description: experience.description,
        start_date: parseLocalDate(experience.start_date),
        end_date: parseLocalDate(experience.end_date),
      });
    } else {
      setEditingId(null);
      form.reset();
    }
    setOpened(true);
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (!values.start_date) {
        throw new Error('Start date is required');
      }

      const payload = {
        company_name: values.company,
        position: values.position,
        description: values.description,
        start_date: formatLocalDate(values.start_date)!,
        end_date: formatLocalDate(values.end_date) || null,
      };

      if (editingId) {
        await workExperienceService.update(editingId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('experience.notifications.updated', 'Experiencia actualizada'),
          color: 'green',
        });
      } else {
        await workExperienceService.create(candidateId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('experience.notifications.added', 'Experiencia agregada'),
          color: 'green',
        });
      }
      onUpdate();
      setOpened(false);
    } catch (error) {
      console.error('Error saving work experience:', error);
      const errorMessage =
        error instanceof Error ? error.message : t('experience.notifications.failedSave', 'Error al guardar');
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await workExperienceService.delete(itemToDelete);
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('experience.notifications.deleted', 'Experiencia eliminada'),
        color: 'green',
      });
      onUpdate();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('experience.notifications.failedDelete', 'Error al eliminar'),
        color: 'red',
      });
    }
  };

  return (
    <Paper withBorder shadow="xs" p="xl" radius="lg" bg="light-dark(#ffffff, #1e293b)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
      <Group justify="space-between" align="center" mb="lg">
        <Group gap="xs">
          <Box p={8} bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))" style={{ borderRadius: 10, color: '#2563eb' }}>
            <IconBriefcase size={22} />
          </Box>
          <Box>
            <Title order={3} size="h3" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {t('experience.title', 'Experiencia Laboral')}
            </Title>
            <Text size="sm" c="dimmed">
              {t('experience.subtitle', 'Historial de posiciones, responsabilidades y logros profesionales')}
            </Text>
          </Box>
        </Group>

        <Button
          leftSection={<IconPlus size={16} />}
          variant="filled"
          color="blue"
          onClick={() => handleOpen()}
        >
          {t('experience.add', 'Agregar experiencia')}
        </Button>
      </Group>

      {experiences.length === 0 ? (
        <Paper
          p="2.5rem"
          radius="md"
          ta="center"
          style={{
            border: '2px dashed light-dark(#e2e8f0, #334155)',
            backgroundColor: 'light-dark(#f8fafc, #0f172a)',
          }}
        >
          <Box
            p={12}
            bg="light-dark(#ffffff, #1e293b)"
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              margin: '0 auto 12px',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              color: 'light-dark(#94a3b8, #64748b)',
            }}
          >
            <IconBriefcase size={28} color='light-dark(#0f172a, #f8fafc)' />
          </Box>
          <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
            {t('experience.emptyTitle', 'Aún no agregaste experiencia laboral')}
          </Text>
          <Text size="sm" c="dimmed" maw={440} mx="auto" mt={4} mb="md">
            {t('experience.emptyDesc', 'Incluí tus empleos actuales y anteriores para que los reclutadores conozcan tu trayectoria y responsabilidades.')}
          </Text>
          <Button
            variant="light"
            color="blue"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpen()}
          >
            {t('experience.emptyButton', 'Agregar mi primer trabajo')}
          </Button>
        </Paper>
      ) : (
        <Timeline
          active={experiences.length}
          bulletSize={36}
          lineWidth={2}
          pl="xs"
          pt="sm"
          color="blue"
        >
          {[...experiences]
            .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
            .map((exp) => {
              const isCurrent = !exp.end_date;
              const duration = formatExperienceDuration(exp.start_date, exp.end_date, t);

              return (
                <Timeline.Item
                  key={exp.id}
                  bullet={<IconBriefcase size={18} color="#2563eb" />}
                  title={
                    <Group justify="space-between" align="flex-start" wrap="nowrap" w="100%">
                      <Box>
                        <Group gap="xs" align="center" wrap="wrap">
                          <Text fw={700} size="lg" c="light-dark(#0f172a, #f8fafc)">
                            {exp.position}
                          </Text>
                          {isCurrent && (
                            <Badge size="xs" color="teal" variant="light">
                              {t('experience.currentBadge', 'Puesto actual')}
                            </Badge>
                          )}
                        </Group>
                        <Group gap={6} mt={2} align="center">
                          <IconBuilding size={15} color="#64748b" />
                          <Text fw={600} size="sm" c="blue.7">
                            {exp.company_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            · {duration}
                          </Text>
                        </Group>
                      </Box>

                      <Group gap={4}>
                        <Tooltip label={t('common:actions.edit', 'Editar')}>
                          <ActionIcon variant="subtle" color="blue" onClick={() => handleOpen(exp)}>
                            <IconPencil size={18} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label={t('common:actions.delete', 'Eliminar')}>
                          <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(exp.id)}>
                            <IconTrash size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  }
                >
                  <Group gap="xs" mt={4} mb="xs">
                    <IconCalendar size={14} color="#94a3b8" />
                    <Text size="xs" c="dimmed">
                      {dayjs(exp.start_date).format('MMMM YYYY')} –{' '}
                      {isCurrent ? t('experience.present', 'Presente') : dayjs(exp.end_date).format('MMMM YYYY')}
                    </Text>
                  </Group>

                  {exp.description && (
                    <Paper p="sm" radius="md" bg="light-dark(#f8fafc, #0f172a)" withBorder style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }} mt="xs">
                      <Text size="sm" c="light-dark(#334155, #cbd5e1)" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                        {exp.description}
                      </Text>
                    </Paper>
                  )}
                </Timeline.Item>
              );
            })}
        </Timeline>
      )}

      {/* Add / Edit Experience Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="lg"
        radius="lg"
        title={
          <Group gap="xs">
            <Box p={6} bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))" style={{ borderRadius: 8, color: '#2563eb' }}>
              <IconBriefcase size={20} />
            </Box>
            <Title order={3} size="h4" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {editingId ? t('experience.edit', 'Editar experiencia') : t('experience.add', 'Agregar experiencia')}
            </Title>
          </Group>
        }
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={t('experience.company', 'Empresa / Organización')}
              placeholder="Ej. Mercado Libre, Globant, Startup..."
              required
              leftSection={<IconBuilding size={16} />}
              {...form.getInputProps('company')}
            />

            <TextInput
              label={t('experience.position', 'Puesto / Cargo')}
              placeholder="Ej. Senior Frontend Developer"
              required
              leftSection={<IconBriefcase size={16} />}
              {...form.getInputProps('position')}
            />

            <Group grow align="flex-start">
              <DateInput
                label={t('experience.startDate', 'Fecha de inicio')}
                placeholder="Seleccionar fecha"
                required
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('start_date')}
              />
              <DateInput
                label={t('experience.endDate', 'Fecha de finalización')}
                placeholder="Seleccionar fecha"
                disabled={form.values.end_date === null}
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('end_date')}
              />
            </Group>

            <Checkbox
              label={t('experience.current', 'Trabajo actualmente en este puesto')}
              checked={form.values.end_date === null}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                form.setFieldValue('end_date', checked ? null : new Date());
              }}
            />

            <Textarea
              label={t('experience.description', 'Descripción y logros')}
              placeholder="Describe tus responsabilidades principales, tecnologías utilizadas y logros relevantes..."
              minRows={3}
              {...form.getInputProps('description')}
            />

            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="default" onClick={() => setOpened(false)}>
                {t('common:actions.cancel', 'Cancelar')}
              </Button>
              <Button type="submit" color="blue" loading={loading}>
                {t('common:actions.save', 'Guardar experiencia')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <DeleteConfirmationModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t('experience.deleteTitle', 'Eliminar experiencia')}
        message={t(
          'experience.deleteMessage',
          '¿Estás seguro de que deseas eliminar esta experiencia laboral? Esta acción no se puede deshacer.'
        )}
      />
    </Paper>
  );
};
