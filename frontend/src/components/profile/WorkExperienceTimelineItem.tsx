import {
  Group,
  Text,
  ActionIcon,
  Timeline,
  Box,
  Badge,
  Tooltip,
  Paper,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconPencil,
  IconTrash,
  IconBriefcase,
  IconBuilding,
  IconCalendar,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { WorkExperience } from '../../services/work-experience.service';

export interface WorkExperienceTimelineItemProps {
  experience: WorkExperience;
  onEdit: (exp: WorkExperience) => void;
  onDelete: (id: string) => void;
}

export const formatExperienceDuration = (
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
        ? (years === 1
            ? t('experience.durationYear', '1 año')
            : t('experience.durationYears', { count: years, defaultValue: `${years} años` }))
        : `${years} ${years === 1 ? 'año' : 'años'}`
    );
  }
  if (months > 0) {
    parts.push(
      t
        ? (months === 1
            ? t('experience.durationMonth', '1 mes')
            : t('experience.durationMonths', { count: months, defaultValue: `${months} meses` }))
        : `${months} ${months === 1 ? 'mes' : 'meses'}`
    );
  }
  return parts.length > 0
    ? parts.join(' ')
    : (t ? t('experience.durationLessMonth', 'Menos de un mes') : 'Menos de un mes');
};

export const WorkExperienceTimelineItem = ({
  experience,
  onEdit,
  onDelete,
}: WorkExperienceTimelineItemProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const isCurrent = !experience.end_date;
  const duration = formatExperienceDuration(experience.start_date, experience.end_date, t);

  return (
    <Timeline.Item
      bullet={<IconBriefcase size={18} color="#2563eb" />}
      title={
        <Group justify="space-between" align="flex-start" wrap="nowrap" w="100%">
          <Box>
            <Group gap="xs" align="center" wrap="wrap">
              <Text fw={700} size="lg" c="light-dark(#0f172a, #f8fafc)">
                {experience.position}
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
                {experience.company_name}
              </Text>
              <Text size="xs" c="dimmed">
                · {duration}
              </Text>
            </Group>
          </Box>

          <Group gap={4}>
            <Tooltip label={t('common:actions.edit', 'Editar')}>
              <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(experience)}>
                <IconPencil size={18} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('common:actions.delete', 'Eliminar')}>
              <ActionIcon variant="subtle" color="red" onClick={() => onDelete(experience.id)}>
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
          {dayjs(experience.start_date).format('MMMM YYYY')} –{' '}
          {isCurrent ? t('experience.present', 'Presente') : dayjs(experience.end_date).format('MMMM YYYY')}
        </Text>
      </Group>

      {experience.description && (
        <Paper
          p="sm"
          radius="md"
          bg="light-dark(#f8fafc, #0f172a)"
          withBorder
          style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
          mt="xs"
        >
          <Text size="sm" c="light-dark(#334155, #cbd5e1)" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
            {experience.description}
          </Text>
        </Paper>
      )}
    </Timeline.Item>
  );
};

