import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconSchool } from '@tabler/icons-react';
import type { Education } from '../../services/education.service';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';
import { useEducationManager } from '../../hooks/domain/useEducationManager';
import { EducationModalForm } from './EducationModalForm';
import { EducationCardItem } from './EducationCardItem';

interface EducationSectionProps {
  candidateId: string;
  educationList: Education[];
  onUpdate: () => void;
}

export const EducationSection = ({
  candidateId,
  educationList,
  onUpdate,
}: EducationSectionProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const {
    opened,
    editingId,
    loading,
    deleteModalOpen,
    form,
    handleOpen,
    handleClose,
    handleSubmit,
    confirmDelete,
    handleDelete,
    closeDeleteModal,
  } = useEducationManager({ candidateId, onUpdate });

  return (
    <Paper
      withBorder
      shadow="xs"
      p="xl"
      radius="lg"
      bg="light-dark(#ffffff, #1e293b)"
      style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
    >
      <Group justify="space-between" align="center" mb="lg">
        <Group gap="xs">
          <Box
            p={8}
            bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))"
            style={{ borderRadius: 10, color: '#16a34a' }}
          >
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
            {t(
              'education.emptyDesc',
              'Registrá tus estudios formales, cursos o certificaciones para validar tus conocimientos.'
            )}
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
          {educationList.map((edu) => (
            <EducationCardItem
              key={edu.id}
              education={edu}
              onEdit={handleOpen}
              onDelete={confirmDelete}
            />
          ))}
        </Stack>
      )}

      <EducationModalForm
        opened={opened}
        onClose={handleClose}
        form={form}
        onSubmit={handleSubmit}
        loading={loading}
        isEditing={Boolean(editingId)}
      />

      <DeleteConfirmationModal
        opened={deleteModalOpen}
        onClose={closeDeleteModal}
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
