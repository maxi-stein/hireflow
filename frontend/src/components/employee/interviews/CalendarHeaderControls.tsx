import { Paper, Group, ActionIcon, Text, Button, Badge } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface CalendarHeaderControlsProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeaderControls({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderControlsProps) {
  const { t, i18n } = useTranslation(['calendar']);

  return (
    <Group justify="space-between" align="center" mb="xl" wrap="wrap" gap="md">
      <Group gap="sm" align="center">
        <Paper
          withBorder
          radius="xl"
          p={4}
          bg="light-dark(#f8fafc, #0f172a)"
          style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
        >
          <Group gap={6} align="center">
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="xl"
              size="md"
              onClick={onPrevMonth}
              aria-label="Previous month"
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
            <Text fw={700} size="md" px="xs" tt="capitalize" c="light-dark(#0f172a, #f8fafc)">
              {currentDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="xl"
              size="md"
              onClick={onNextMonth}
              aria-label="Next month"
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          </Group>
        </Paper>

        <Button
          variant="light"
          size="xs"
          color="blue"
          radius="xl"
          onClick={onToday}
        >
          {t('today', 'Hoy')}
        </Button>
      </Group>

      {/* Color coding legend */}
      <Group gap="sm">
        <Badge variant="dot" color="blue" size="md">
          {t('legend.interviews', 'Entrevistas')}
        </Badge>
        <Badge variant="dot" color="red" size="md">
          {t('legend.deadlines', 'Fechas límite')}
        </Badge>
      </Group>
    </Group>
  );
}

