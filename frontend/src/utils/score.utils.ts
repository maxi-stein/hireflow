import type { MantineColor } from '@mantine/core';

export const getScoreColor = (score: number | undefined): MantineColor => {
  const s = score || 0;
  if (s >= 7) return 'green';
  if (s >= 4) return 'yellow';
  return 'red';
};
