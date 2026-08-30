import { Paper, Text, Group } from '@mantine/core';

export type TimeDisplayColor = 'blue' | 'orange' | 'grape' | 'gray';

export interface TimeDisplayProps {
  date: Date | string;
  variant?: 'time-only' | 'date-time' | 'date-only';
  color?: TimeDisplayColor;
  size?: 'xs' | 'sm' | 'md';
}

/**
 * Displays time/date in a consistent, prominent format across the application
 * Used for interview times, review times, etc.
 */
export function TimeDisplay({
  date,
  variant = 'time-only',
  color = 'blue',
  size = 'sm',
}: TimeDisplayProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Format time as "2:30 PM"
  const time = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const [timeStr, ampm] = time.split(' ');

  // Format date as "Jan 17"
  const dateStr = dateObj.toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  // Size configuration
  const sizeMap = {
    xs: { minWidth: 70, time: 'xs', label: '10px', padding: 4 },
    sm: { minWidth: 80, time: 'sm', label: 'xs', padding: 6 },
    md: { minWidth: 95, time: 'md', label: 'sm', padding: 8 }
  };

  const config = sizeMap[size];

  return (
    <Paper
      withBorder
      radius="sm"
      p={config.padding}
      style={{
        textAlign: 'center',
        minWidth: config.minWidth,
        backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
        flexShrink: 0,
        boxShadow: 'none'
      }}
    >
      {variant === 'date-time' && (
        <Text size="xs" c="dimmed" lh={1} mb={4}>
          {dateStr}
        </Text>
      )}

      {variant === 'date-only' ? (
        <Text size={config.time as any} fw={800} c={color} lh={1}>
          {dateStr}
        </Text>
      ) : (
        <Group gap={3} justify="center" align="baseline" wrap="nowrap" style={{ height: '100%' }}>
          <Text size={config.time as any} fw={800} c={color} lh={1}>
            {timeStr}
          </Text>
          <Text size="10px" fw={700} lh={1} c="dimmed" style={{ textTransform: 'lowercase' }}>
            {ampm}
          </Text>
        </Group>
      )}
    </Paper>
  );
}
