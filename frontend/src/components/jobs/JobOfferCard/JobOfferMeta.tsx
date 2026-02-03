import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconMapPin, IconBriefcase } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface JobOfferMetaProps {
  location?: string;
  workMode?: string;
}

export const JobOfferMeta = ({ location, workMode }: JobOfferMetaProps) => {
  const { t } = useTranslation('jobs');
  return (
    <Group gap="md">
      {location && (
        <Group gap={6}>
          <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
            <IconMapPin size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>{location}</Text>
        </Group>
      )}
      {workMode && (
        <Group gap={6}>
          <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
            <IconBriefcase size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>
            {workMode ? t(`workMode.${workMode === 'remote' ? 'remote' : workMode}`) : ''}
          </Text>
        </Group>
      )}
    </Group>
  );
};
