import {
  Modal,
  Title,
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Checkbox,
  Box,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import type { UseFormReturnType } from '@mantine/form';
import { IconBriefcase, IconBuilding } from '@tabler/icons-react';
import type { WorkExperienceFormValues } from '../../hooks/domain/useWorkExperienceManager';

export interface WorkExperienceModalFormProps {
  opened: boolean;
  onClose: () => void;
  form: UseFormReturnType<WorkExperienceFormValues>;
  onSubmit: (values: WorkExperienceFormValues) => Promise<void>;
  loading: boolean;
  isEditing: boolean;
}

export const WorkExperienceModalForm = ({
  opened,
  onClose,
  form,
  onSubmit,
  loading,
  isEditing,
}: WorkExperienceModalFormProps) => {
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
            bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
            style={{ borderRadius: 8, color: '#2563eb' }}
          >
            <IconBriefcase size={20} />
          </Box>
          <Title order={3} size="h4" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
            {isEditing ? t('experience.edit', 'Editar experiencia') : t('experience.add', 'Agregar experiencia')}
          </Title>
        </Group>
      }
    >
      <form onSubmit={form.onSubmit(onSubmit)}>
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
            <Button variant="default" onClick={onClose}>
              {t('common:actions.cancel', 'Cancelar')}
            </Button>
            <Button type="submit" color="blue" loading={loading}>
              {t('common:actions.save', 'Guardar experiencia')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

