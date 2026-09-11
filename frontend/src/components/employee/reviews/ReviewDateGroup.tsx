import { Box, Group, Stack, Title } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import type { ReactNode } from 'react';

interface ReviewDateGroupProps {
  dateKey: string;
  children: ReactNode;
}

/**
 * Formats a YYYY-MM-DD date string into a friendly localized string.
 */
function getFriendlyDate(dateKey: string): string {
  // We parse the string manually or use Date parsing ensuring local time zone alignment
  // Because "2024-03-25" parsed as UTC might shift to previous day in local time,
  // we split it and use local date construction.
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const diffTime = date.getTime() - todayDateOnly.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Mañana';
  if (diffDays === -1) return 'Ayer';
  
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Renders the date header and wraps candidate cards for a single date group.
 */
export function ReviewDateGroup({ dateKey, children }: ReviewDateGroupProps) {
  const displayDate = getFriendlyDate(dateKey);

  return (
    <Box mb="xl">
      <Group mb="md">
        <IconCalendarEvent size={20} style={{ opacity: 0.7 }} />
        <Title order={4} tt="capitalize">{displayDate}</Title>
      </Group>
      <Stack gap="md" pl={{ base: 0, md: 'md' }}>
        {children}
      </Stack>
    </Box>
  );
}
