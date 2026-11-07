import {
  Paper,
  Title,
  Button,
  Group,
  Text,
  Timeline,
  Box,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconPlus, IconBriefcase } from '@tabler/icons-react';
import type { WorkExperience } from '../../services/work-experience.service';
import { DeleteConfirmationModal } from '../shared/DeleteConfirmationModal';
import { useWorkExperienceManager } from '../../hooks/domain/useWorkExperienceManager';
import { WorkExperienceModalForm } from './WorkExperienceModalForm';
import { WorkExperienceTimelineItem } from './WorkExperienceTimelineItem';

interface WorkExperienceSectionProps {
  candidateId: string;
  experiences: WorkExperience[];
  onUpdate: () => void;
}

export const WorkExperienceSection = ({
  candidateId,
  experiences,
  onUpdate,
}: WorkExperienceSectionProps) => {
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
  } = useWorkExperienceManager({ candidateId, onUpdate });

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
            bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
            style={{ borderRadius: 10, color: '#2563eb' }}
          >
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
            <IconBriefcase size={28} color="light-dark(#0f172a, #f8fafc)" />
          </Box>
          <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
            {t('experience.emptyTitle', 'Aún no agregaste experiencia laboral')}
          </Text>
          <Text size="sm" c="dimmed" maw={440} mx="auto" mt={4} mb="md">
            {t(
              'experience.emptyDesc',
              'Incluí tus empleos actuales y anteriores para que los reclutadores conozcan tu trayectoria y responsabilidades.'
            )}
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
            .map((exp) => (
              <WorkExperienceTimelineItem
                key={exp.id}
                experience={exp}
                onEdit={handleOpen}
                onDelete={confirmDelete}
              />
            ))}
        </Timeline>
      )}

      <WorkExperienceModalForm
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
        title={t('experience.deleteTitle', 'Eliminar experiencia')}
        message={t(
          'experience.deleteMessage',
          '¿Estás seguro de que deseas eliminar esta experiencia laboral? Esta acción no se puede deshacer.'
        )}
      />
    </Paper>
  );
};
