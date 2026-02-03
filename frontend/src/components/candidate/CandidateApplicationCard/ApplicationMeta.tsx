import { Group, Text, ThemeIcon, Tooltip } from '@mantine/core';
import { IconMapPin, IconBriefcase, IconCalendar } from '@tabler/icons-react';

interface ApplicationMetaProps {
  location: string;
  workMode: string;
  appliedDate: string;
}

export const ApplicationMeta = ({ location, workMode, appliedDate }: ApplicationMetaProps) => {
  const formattedDate = new Date(appliedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Group gap="md">
      <Group gap={6}>
        <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
          <IconMapPin size={12} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" fw={500}>{location}</Text>
      </Group>

      <Group gap={6}>
        <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
          <IconBriefcase size={12} />
        </ThemeIcon>
        <Text size="sm" c="dimmed" fw={500} style={{ textTransform: 'capitalize' }}>{workMode}</Text>
      </Group>

      <Tooltip label={`Applied on ${new Date(appliedDate).toLocaleDateString()}`}>
        <Group gap={6}>
          <ThemeIcon variant="light" color="blue" size="sm" radius="xl">
            <IconCalendar size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>Applied: {formattedDate}</Text>
        </Group>
      </Tooltip>
    </Group>
  );
};
