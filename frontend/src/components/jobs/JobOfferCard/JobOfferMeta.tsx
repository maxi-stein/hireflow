import { Group, Text, ThemeIcon } from '@mantine/core';
import { IconMapPin, IconBriefcase } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { getLocationDisplayInfo, getWorkModeColor } from '../../../utils/job.utils';

interface JobOfferMetaProps {
  location?: string;
  workMode?: string;
}

export const JobOfferMeta = ({ location, workMode }: JobOfferMetaProps) => {
  const { t } = useTranslation('jobs');
  const { location: displayLocation, workMode: displayWorkMode } = getLocationDisplayInfo(workMode || '', location || '');

  return (
    <Group gap="md">
      {displayLocation && (
        <Group gap={6}>
          <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
            <IconMapPin size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>{displayLocation}</Text>
        </Group>
      )}
      {displayWorkMode && (
        <Group gap={6}>
          <ThemeIcon variant="light" color={getWorkModeColor(displayWorkMode)} size="sm" radius="xl">
            <IconBriefcase size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>
            {t(`workMode.${displayWorkMode === 'remote' ? 'remote' : displayWorkMode}`)}
          </Text>
        </Group>
      )}
    </Group>
  );
};
