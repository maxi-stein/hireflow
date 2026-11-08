import { Box, Group, Text } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../../../services/job-offer.service';

interface CalendarDeadlinePillProps {
  jobOffer: JobOffer;
  onClick?: (jobOffer: JobOffer) => void;
}

export function CalendarDeadlinePill({ jobOffer, onClick }: CalendarDeadlinePillProps) {
  const { t } = useTranslation(['applications']);

  return (
    <Box
      p="4px 6px"
      bg="light-dark(#fef2f2, rgba(239, 68, 68, 0.15))"
      style={{
        borderRadius: 6,
        cursor: 'pointer',
        border: '1px solid light-dark(#fecaca, rgba(239, 68, 68, 0.3))',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onClick={() => onClick?.(jobOffer)}
    >
      <Group gap={4} wrap="nowrap">
        <IconClock size={11} color="var(--mantine-color-red-6)" />
        <Text size="xs" truncate fw={700} c="light-dark(#b91c1c, #fca5a5)">
          {t('table.deadline', { ns: 'applications' })}
        </Text>
      </Group>
      <Text size="xs" truncate fw={500} c="light-dark(#991b1b, #fecaca)">
        {jobOffer.position}
      </Text>
    </Box>
  );
}

