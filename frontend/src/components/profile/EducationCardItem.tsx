import {
  Paper,
  Group,
  Text,
  Badge,
  Box,
  ActionIcon,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconCertificate,
  IconCalendar,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { Education } from '../../services/education.service';
import { DEGREE_LABELS } from './EducationModalForm';

export interface EducationCardItemProps {
  education: Education;
  onEdit: (edu: Education) => void;
  onDelete: (id: string) => void;
}

export const EducationCardItem = ({
  education,
  onEdit,
  onDelete,
}: EducationCardItemProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const isCurrent = !education.end_date;
  const degreeDisplay = DEGREE_LABELS[education.degree_type] || education.degree_type;

  return (
    <Paper
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
                {education.field_of_study}
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
              {education.institution}
            </Text>

            <Group gap="xs" mt={4}>
              <IconCalendar size={14} color="#94a3b8" />
              <Text size="xs" c="dimmed">
                {dayjs(education.start_date).format('MMMM YYYY')} –{' '}
                {isCurrent ? t('education.present', 'Presente') : dayjs(education.end_date).format('MMMM YYYY')}
              </Text>
            </Group>

            {education.description && (
              <Text size="sm" c="light-dark(#475569, #cbd5e1)" mt="xs" style={{ lineHeight: 1.6 }}>
                {education.description}
              </Text>
            )}
          </Box>
        </Group>

        <Group gap={4}>
          <Tooltip label={t('common:actions.edit', 'Editar')}>
            <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(education)}>
              <IconPencil size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('common:actions.delete', 'Eliminar')}>
            <ActionIcon variant="subtle" color="red" onClick={() => onDelete(education.id)}>
              <IconTrash size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
};
