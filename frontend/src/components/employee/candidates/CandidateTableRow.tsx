import { Table, Group, Text, Badge, Box, Button, Tooltip } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CandidateProfile } from '../../../services/candidate.service';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { getCandidateLatestActivity } from '../../../utils/candidateActivity.utils';

interface CandidateTableRowProps {
  candidate: CandidateProfile;
}

export function CandidateTableRow({ candidate }: CandidateTableRowProps) {
  const { t } = useTranslation(['candidates', 'common', 'applications']);
  const navigate = useNavigate();

  const activity = getCandidateLatestActivity(candidate);

  const handleRowClick = () => {
    navigate(`/manage/candidates/list/${candidate.id}`);
  };

  return (
    <Table.Tr
      style={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
      }}
      onClick={handleRowClick}
    >
      <Table.Td>
        <Group gap="sm" py={8}>
          <CandidateAvatar
            candidateId={candidate.id}
            firstName={candidate.user.first_name}
            lastName={candidate.user.last_name}
            size="md"
          />
          <div>
            <Text fw={600} size="sm">
              {candidate.user.first_name} {candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{candidate.user.email}</Text>
          </div>
        </Group>
      </Table.Td>

      <Table.Td>
        {candidate.headline ? (
          <Text size="sm" lineClamp={2}>{candidate.headline}</Text>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">{t('na', { ns: 'common' })}</Text>
        )}
      </Table.Td>

      <Table.Td>
        {activity.type === 'NO_APPLICATIONS' && (
          <Badge variant="light" color="gray" size="sm">
            {t('list.table.noApplications')}
          </Badge>
        )}

        {activity.type === 'INTERVIEW' && (
          <Box>
            <Badge variant="light" color="blue" size="sm" mb={4}>
              {activity.title}
            </Badge>
            <Text size="xs" c="dimmed">
              {activity.position}
              {activity.remainingAppsCount > 0 && ` +${t('list.table.moreApplications', { count: activity.remainingAppsCount })}`}
            </Text>
          </Box>
        )}

        {activity.type === 'APPLICATIONS' && (
          <Box>
            <Badge variant="light" color="teal" size="sm" mb={4}>
              {t('list.table.applicationsCount', { count: activity.count })}
            </Badge>
            <Text size="xs" c="dimmed">
              {activity.position}
              {activity.remainingAppsCount > 0 && ` +${t('list.table.moreApplications', { count: activity.remainingAppsCount })}`}
            </Text>
          </Box>
        )}
      </Table.Td>

      <Table.Td>
        <Text size="sm" c="dimmed">{new Date(candidate.profile_updated_at).toLocaleDateString()}</Text>
      </Table.Td>

      <Table.Td onClick={(e) => e.stopPropagation()}>
        <Group gap="xs" justify="flex-end">
          <Tooltip label={t('table.tooltips.viewCandidate', { ns: 'applications' })}>
            <Button
              variant="light"
              color="blue"
              onClick={handleRowClick}
              leftSection={<IconEye size={15} />}
              size="xs"
            >
              {t('list.table.viewProfile')}
            </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
}

