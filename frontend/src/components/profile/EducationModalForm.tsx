import {
  Modal,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Checkbox,
  Select,
  Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import type { UseFormReturnType } from '@mantine/form';
import { IconSchool } from '@tabler/icons-react';
import { DegreeType } from '../../services/education.service';
import type { EducationFormValues } from '../../hooks/domain/useEducationManager';

export const DEGREE_LABELS: Record<string, string> = {
  high_school: 'Secundario',
  tertiary: 'Terciario',
  university: 'Universitario / Grado',
  master: 'Maestría / Posgrado',
  doctorate: 'Doctorado',
  course: 'Curso / Certificación',
  other: 'Otro',
};

export const DEGREE_SELECT_DATA = Object.values(DegreeType).map((val) => ({
  value: val,
  label: DEGREE_LABELS[val] || val,
}));

export interface EducationModalFormProps {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturnType<EducationFormValues>;
  onSubmit: (values: EducationFormValues) => Promise<void>;
  loading: boolean;
  isEditing: boolean;
  selectData?: Array<{ value: string; label: string }>;
}

export const EducationModalForm = ({
  opened,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
  selectData = DEGREE_SELECT_DATA,
}: EducationModalFormProps) => {
  const { t } = useTranslation(['profile', 'common']);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      radius="lg"
      title={
        <Group gap="xs">
          <Box
            p={6}
            bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))"
            style={{ borderRadius: 8, color: '#16a34a' }}
          >
            <IconSchool size={20} />
          </Box>
          <Title order={3} size="h4" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
            {isEditing ? t('education.edit', 'Editar educación') : t('education.add', 'Agregar educación')}
          </Title>
        </Group>
      }
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
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
              data={selectData}
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
            <Button variant="default" onClick={onClose}>
              {t('common:actions.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" color="green" loading={loading}>
              {t('common:actions.save', 'Guardar educación')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

