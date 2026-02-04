import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconCurrencyDollar, IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface JobOfferDetailsProps {
  salary?: string;
  deadline?: string | Date; // Allow Date object
  showSensitiveData?: boolean;
}

export const JobOfferDetails = ({ salary, deadline, showSensitiveData }: JobOfferDetailsProps) => {
  const { t, i18n } = useTranslation('jobs');
  const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString(i18n.language) : null;

  return (
    <Group gap="lg">
      {salary && (
        <Group gap={6}>
          <ThemeIcon variant="light" color="green" size="md" radius="md">
            <IconCurrencyDollar size={16} />
          </ThemeIcon>
          <Text size="sm" fw={600}>{salary}</Text>
        </Group>
      )}

      {showSensitiveData && formattedDeadline && (
        <Group gap={6}>
          <ThemeIcon variant="light" color="red" size="md" radius="md">
            <IconClock size={16} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {t('deadline')}: {formattedDeadline}
          </Text>
        </Group>
      )}
    </Group>
  );
};
