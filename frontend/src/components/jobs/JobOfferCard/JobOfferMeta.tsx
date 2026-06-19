import { Group, Text } from '@mantine/core';
import {
  IconMapPin,
  IconBuildingSkyscraper,
  IconHome,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { WorkMode } from '../../../services/job-offer.service';
import { getLocationDisplayInfo } from '../../../utils/job.utils';

interface JobOfferMetaProps {
  location?: string;
  workMode?: string;
}

const getWorkModeIcon = (workMode: string) => {
  const normalized = workMode?.toLowerCase();
  if (normalized === WorkMode.REMOTE) return <IconHome size={13} />;
  if (normalized === WorkMode.HYBRID) return <IconBuildingSkyscraper size={13} />;
  // office / presencial
  return <IconBuildingSkyscraper size={13} />;
};

export const JobOfferMeta = ({ location, workMode }: JobOfferMetaProps) => {
  const { t } = useTranslation('jobs');
  const { location: displayLocation, workMode: displayWorkMode } = getLocationDisplayInfo(
    workMode || '',
    location || '',
  );

  const parts: string[] = [];
  if (displayWorkMode) {
    parts.push(t(`workMode.${displayWorkMode === 'remote' ? 'remote' : displayWorkMode}`));
  }
  if (displayLocation) {
    parts.push(displayLocation);
  }

  if (parts.length === 0) return null;

  const icon = getWorkModeIcon(workMode || '');

  return (
    <Group gap={5} align="center">
      <Text c="blue.6" size="md" style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
      </Text>
      <Text size="md" fw={500} c="blue.6">
        {parts.join(' · ')}
      </Text>
    </Group>
  );
};
