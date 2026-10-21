import { Box, Group, Stack, Title, Text } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ReviewDateGroupProps {
  dateKey: string;
  children: ReactNode;
}

export function ReviewDateGroup({ dateKey, children }: ReviewDateGroupProps) {
  const { t, i18n } = useTranslation('reviews');

  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = date.getTime() - todayDateOnly.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let displayDate: string;
  if (diffDays === 0) {
    displayDate = t('dates.today', 'Hoy');
  } else if (diffDays === 1) {
    displayDate = t('dates.tomorrow', 'Mañana');
  } else if (diffDays === -1) {
    displayDate = t('dates.yesterday', 'Ayer');
  } else {
    displayDate = date.toLocaleDateString(i18n.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  const formattedFullDate = date.toLocaleDateString(i18n.language, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Box mb="xl">
      <Group mb="md" gap="xs" align="center">
        <Box
          p={6}
          bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
          style={{ borderRadius: 8, color: '#2563eb' }}
        >
          <IconCalendarEvent size={18} />
        </Box>
        <Title order={4} tt="capitalize" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 700 }}>
          {displayDate}
        </Title>
        {(diffDays === 0 || diffDays === 1 || diffDays === -1) && (
          <Text size="sm" c="dimmed">
            · {formattedFullDate}
          </Text>
        )}
      </Group>
      <Stack gap="md" pl={{ base: 0, md: 'md' }}>
        {children}
      </Stack>
    </Box>
  );
}
