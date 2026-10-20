import { Group, Badge } from '@mantine/core';
import {
  IconBuildingSkyscraper,
  IconHome,
  IconMapPin,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { WorkMode } from '../../../services/job-offer.service';
import { getLocationDisplayInfo } from '../../../utils/job.utils';

interface JobOfferMetaProps {
  location?: string;
  workMode?: string;
}

export const JobOfferMeta = ({ location, workMode }: JobOfferMetaProps) => {
  const { t } = useTranslation('jobs');
  const { location: displayLocation, workMode: displayWorkMode } = getLocationDisplayInfo(
    workMode || '',
    location || '',
  );

  const normalizedMode = workMode?.toLowerCase();
  const isRemote = normalizedMode === WorkMode.REMOTE || normalizedMode === 'remote';
  const isHybrid = normalizedMode === WorkMode.HYBRID || normalizedMode === 'hybrid';

  const modeBadgeColor = isRemote ? 'teal' : isHybrid ? 'blue' : 'gray';
  const modeIcon = isRemote ? <IconHome size={13} /> : <IconBuildingSkyscraper size={13} />;

  return (
    <Group gap="xs" wrap="wrap" align="center">
      {displayWorkMode && (
        <Badge
          color={modeBadgeColor}
          variant="light"
          size="sm"
          radius="md"
          leftSection={modeIcon}
          style={{ textTransform: 'capitalize', fontWeight: 600 }}
        >
          {t(`workMode.${displayWorkMode === 'remote' ? 'remote' : displayWorkMode}`, displayWorkMode)}
        </Badge>
      )}

      {displayLocation && (
        <Badge
          color="gray"
          variant="light"
          size="sm"
          radius="md"
          leftSection={<IconMapPin size={13} />}
          style={{ fontWeight: 500 }}
        >
          {displayLocation}
        </Badge>
      )}
    </Group>
  );
};
