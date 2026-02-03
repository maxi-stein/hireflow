import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconCurrencyDollar, IconClock } from '@tabler/icons-react';

interface JobOfferDetailsProps {
  salary?: string;
  deadline?: string | Date; // Allow Date object
  showSensitiveData?: boolean;
}

export const JobOfferDetails = ({ salary, deadline, showSensitiveData }: JobOfferDetailsProps) => {
  const formattedDeadline = deadline ? new Date(deadline).toLocaleDateString() : null;

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
            Deadline: {formattedDeadline}
          </Text>
        </Group>
      )}
    </Group>
  );
};
