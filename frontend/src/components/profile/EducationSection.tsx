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
  Select,
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
  IconSchool,
  IconCertificate,
  IconCalendar,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import type { Education } from '../../services/education.service';
import { educationService, DegreeType } from '../../services/education.service';
import dayjs from 'dayjs';
import { validateWithJoi } from '../../utils/form-validation';
import { educationSchema } from '../../schemas/profile.schema';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';

interface EducationSectionProps {
  candidateId: string;
  educationList: Education[];
  onUpdate: () => void;
}

const degreeLabels: Record<string, string> = {
  high_school: 'Secundario',
  tertiary: 'Terciario',
  university: 'Universitario / Grado',
  master: 'Maestría / Posgrado',
  doctorate: 'Doctorado',
  course: 'Curso / Certificación',
  other: 'Otro',
};

export const EducationSection = ({
  candidateId,
  educationList,
  onUpdate,
}: EducationSectionProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const [opened, setOpened] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      institution: '',
      degree_type: '',
      field_of_study: '',
      start_date: null as Date | null,
      end_date: null as Date | null,
      description: '',
    },
    validate: validateWithJoi(educationSchema),
  });

  const handleOpen = (education?: Education) => {
    if (education) {
      setEditingId(education.id);
      form.setValues({
        institution: education.institution,
        degree_type: education.degree_type,
        field_of_study: education.field_of_study,
        start_date: parseLocalDate(education.start_date),
        end_date: parseLocalDate(education.end_date),
        description: education.description || '',
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
        institution: values.institution,
        degree_type: values.degree_type as DegreeType,
        field_of_study: values.field_of_study,
        start_date: formatLocalDate(values.start_date)!,
        end_date: formatLocalDate(values.end_date) || null,
        description: values.description,
      };

      if (editingId) {
        await educationService.update(editingId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('education.notifications.updated', 'Educación actualizada'),
          color: 'green',
        });
      } else {
        await educationService.create(candidateId, payload);
        notifications.show({
          title: t('candidate.notifications.successTitle', 'Éxito'),
          message: t('education.notifications.added', 'Educación agregada'),
          color: 'green',
        });
      }
      onUpdate();
      setOpened(false);
    } catch (error) {
      console.error('Error saving education:', error);
      const errorMessage =
        error instanceof Error ? error.message : t('education.notifications.failedSave', 'Error al guardar');
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
      await educationService.delete(itemToDelete);
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('education.notifications.deleted', 'Educación eliminada'),
        color: 'green',
      });
      onUpdate();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('education.notifications.failedDelete', 'Error al eliminar'),
        color: 'red',
      });
    }
  };

  const degreeSelectData = Object.values(DegreeType).map((val) => ({
    value: val,
    label: degreeLabels[val] || val,
  }));

  return (
    <Paper withBorder shadow="xs" p="xl" radius="lg" bg="light-dark(#ffffff, #1e293b)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
      <Group justify="space-between" align="center" mb="lg">
        <Group gap="xs">
          <Box p={8} bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))" style={{ borderRadius: 10, color: '#16a34a' }}>
            <IconSchool size={22} />
          </Box>
          <Box>
            <Title order={3} size="h3" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {t('education.title', 'Educación & Formación')}
            </Title>
            <Text size="sm" c="dimmed">
              {t('education.subtitle', 'Títulos universitarios, tecnicaturas, certificaciones y cursos')}
            </Text>
          </Box>
        </Group>

        <Button
          leftSection={<IconPlus size={16} />}
          variant="filled"
          color="green"
          onClick={() => handleOpen()}
        >
          {t('education.add', 'Agregar educación')}
        </Button>
      </Group>

      {educationList.length === 0 ? (
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
            <IconSchool size={28} />
          </Box>
          <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
            {t('education.emptyTitle', 'Aún no agregaste formación académica')}
          </Text>
          <Text size="sm" c="dimmed" maw={440} mx="auto" mt={4} mb="md">
            {t('education.emptyDesc', 'Registrá tus estudios formales, cursos o certificaciones para validar tus conocimientos.')}
          </Text>
          <Button
            variant="light"
            color="green"
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => handleOpen()}
          >
            {t('education.emptyButton', 'Agregar primer estudio')}
          </Button>
        </Paper>
      ) : (
        <Stack gap="md">
          {educationList.map((edu) => {
            const isCurrent = !edu.end_date;
            const degreeDisplay = degreeLabels[edu.degree_type] || edu.degree_type;

            return (
              <Paper
                key={edu.id}
                withBorder
                p="lg"
                radius="md"
                style={{
                  backgroundColor: 'light-dark(#ffffff, #1e293b)',
                  borderColor: 'light-dark(#e2e8f0, #334155)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Group align="flex-start" gap="md" style={{ flex: 1 }}>
                    <Box
                      p={8}
                      bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))"
                      style={{ borderRadius: 10, color: '#16a34a', flexShrink: 0, marginTop: 2 }}
                    >
                      <IconCertificate size={22} />
                    </Box>

                    <Box style={{ flex: 1 }}>
                      <Group gap="xs" align="center" wrap="wrap" mb={2}>
                        <Text fw={700} size="lg" c="light-dark(#0f172a, #f8fafc)">
                          {edu.field_of_study}
                        </Text>
                        <Badge size="sm" color="teal" variant="light">
                          {degreeDisplay}
                        </Badge>
                        {isCurrent && (
                          <Badge size="xs" color="blue" variant="outline">
                            {t('education.inProgressBadge', 'En curso')}
                          </Badge>
                        )}
                      </Group>

                      <Text fw={600} size="sm" c="green.8">
                        {edu.institution}
                      </Text>

                      <Group gap="xs" mt={4}>
                        <IconCalendar size={14} color="#94a3b8" />
                        <Text size="xs" c="dimmed">
                          {dayjs(edu.start_date).format('MMMM YYYY')} –{' '}
                          {isCurrent ? t('education.present', 'Presente') : dayjs(edu.end_date).format('MMMM YYYY')}
                        </Text>
                      </Group>

                      {edu.description && (
                        <Text size="sm" c="light-dark(#475569, #cbd5e1)" mt="xs" style={{ lineHeight: 1.6 }}>
                          {edu.description}
                        </Text>
                      )}
                    </Box>
                  </Group>

                  <Group gap={4}>
                    <Tooltip label={t('common:actions.edit', 'Editar')}>
                      <ActionIcon variant="subtle" color="blue" onClick={() => handleOpen(edu)}>
                        <IconPencil size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label={t('common:actions.delete', 'Eliminar')}>
                      <ActionIcon variant="subtle" color="red" onClick={() => confirmDelete(edu.id)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}

      {/* Add / Edit Education Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="lg"
        radius="lg"
        title={
          <Group gap="xs">
            <Box p={6} bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))" style={{ borderRadius: 8, color: '#16a34a' }}>
              <IconSchool size={20} />
            </Box>
            <Title order={3} size="h4" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {editingId ? t('education.edit', 'Editar educación') : t('education.add', 'Agregar educación')}
            </Title>
          </Group>
        }
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={t('education.institution', 'Institución educativa')}
              placeholder="Ej. UBA, UTN, Coursera, Coderhouse..."
              required
              leftSection={<IconSchool size={16} />}
              {...form.getInputProps('institution')}
            />

            <Group grow align="flex-start">
              <Select
                label={t('education.degreeType', 'Tipo de título / grado')}
                placeholder="Seleccionar tipo"
                data={degreeSelectData}
                required
                {...form.getInputProps('degree_type')}
              />

              <TextInput
                label={t('education.fieldOfStudy', 'Carrera o área de estudio')}
                placeholder="Ej. Ingeniería en Sistemas, Diseño UX..."
                required
                {...form.getInputProps('field_of_study')}
              />
            </Group>

            <Group grow align="flex-start">
              <DateInput
                label={t('education.startDate', 'Fecha de inicio')}
                placeholder="Seleccionar fecha"
                required
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('start_date')}
              />
              <DateInput
                label={t('education.endDate', 'Fecha de graduación / fin')}
                placeholder="Seleccionar fecha"
                disabled={form.values.end_date === null}
                valueFormat="YYYY-MM-DD"
                {...form.getInputProps('end_date')}
              />
            </Group>

            <Checkbox
              label={t('education.current', 'Actualmente me encuentro cursando')}
              checked={form.values.end_date === null}
              onChange={(event) => {
                const checked = event.currentTarget.checked;
                form.setFieldValue('end_date', checked ? null : new Date());
              }}
            />

            <Textarea
              label={t('education.description', 'Descripción adicional')}
              placeholder="Materias destacadas, promedio, tesis o detalles del programa..."
              minRows={2}
              {...form.getInputProps('description')}
            />

            <Group justify="flex-end" gap="sm" mt="md">
              <Button variant="default" onClick={() => setOpened(false)}>
                {t('common:actions.cancel', 'Cancelar')}
              </Button>
              <Button type="submit" color="green" loading={loading}>
                {t('common:actions.save', 'Guardar educación')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <DeleteConfirmationModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={t('education.deleteTitle', 'Eliminar educación')}
        message={t(
          'education.deleteMessage',
          '¿Estás seguro de que deseas eliminar este registro educativo? Esta acción no se puede deshacer.'
        )}
      />
    </Paper>
  );
};
