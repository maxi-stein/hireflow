import {
  Paper,
  Table,
  Badge,
  Group,
  Pagination,
  LoadingOverlay,
  ActionIcon,
  Tooltip,
  TextInput,
  Text,
  Title,
  Select,
  Box
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import { useDebouncedValue } from '@mantine/hooks';
import { useAllCandidateApplicationsQuery } from '../../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { IconEye, IconScale, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';

export function JobApplicationsTable({ jobOfferId, jobTitle, deadline }: { jobOfferId: string, jobTitle: string, deadline?: string | null }) {
  const { t } = useTranslation('applications');
  const navigate = useNavigate();

  // Paginate the list of applications
  const [page, setPage] = useState(1);

  // Search applications (with debounce)
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: allApplications, isLoading } = useAllCandidateApplicationsQuery({
    page,
    limit: 5, // Show 5 per job posting to save space
    job_offer_id: jobOfferId,
    search: debouncedSearch,
    status: statusFilter !== 'all' ? [statusFilter as ApplicationStatus] : undefined,
    exclude_status: ApplicationStatus.HIRED,
  });



  if (!isLoading && (!allApplications || allApplications.data.length === 0) && !search && !debouncedSearch) {
    return null; // Don't show table if no applications and no search active
  }

  // Sort applications
  const sortedApplications = allApplications?.data
    .sort((a, b) => {
      // Define status priority: IN_PROGRESS > APPLIED > HIRED > REJECTED
      const statusPriority: Record<ApplicationStatus, number> = {
        [ApplicationStatus.IN_PROGRESS]: 1,
        [ApplicationStatus.APPLIED]: 2,
        [ApplicationStatus.HIRED]: 3,
        [ApplicationStatus.REJECTED]: 4,
      };

      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];

      // If same priority, sort by updated date (newest first)
      if (priorityDiff === 0) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }

      return priorityDiff;
    }) || [];

  const rows = sortedApplications.map((application) => (
    <Table.Tr key={application.id}>
      <Table.Td>
        <Group gap="sm">
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            size="sm"
          />
          <div>
            <Text fw={500}>
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{application.candidate.user.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        {new Date(application.created_at).toLocaleDateString()}
      </Table.Td>
      <Table.Td>
        <Badge color={getApplicationStatusColor(application.status)} variant="light">
          {t('common:applicationStatus.' + application.status)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label={t('table.tooltips.viewCandidate')}>
            <ActionIcon
              variant="light"
              color="blue"
              title={t('table.tooltips.viewCandidate')}
              onClick={() => navigate(`/manage/candidates/list/${application.candidate.id}`)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('table.tooltips.compareCandidate')}>
            <ActionIcon
              variant="light"
              color="violet"
              title="Compare"
              onClick={() => navigate(`/manage/candidates/compare?jobOfferId=${jobOfferId}&candidateId=${application.candidate.id}`)}
            >
              <IconScale size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder radius="md" p="md" pos="relative" mb="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Group justify="space-between" mb="md">
        <Box>
          <Title order={4}>{jobTitle}</Title>
          {deadline && (
            <Text size="xs" c="red">
              {t('table.deadline')} {new Date(deadline).toLocaleDateString()}
            </Text>
          )}
        </Box>
        <Group>
          <Select
            placeholder={t('table.filters.statusPlaceholder')}
            data={[
              { value: 'all', label: t('table.filters.allStatuses') },
              { value: ApplicationStatus.APPLIED, label: t('table.filters.applied') },
              { value: ApplicationStatus.IN_PROGRESS, label: t('table.filters.inProgress') },
              { value: ApplicationStatus.REJECTED, label: t('table.filters.rejected') },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            size="xs"
            w={150}
          />
          <TextInput
            placeholder={t('table.filters.searchPlaceholder')}
            leftSection={<IconSearch size={14} />}
            size="xs"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Badge variant="outline">{allApplications?.pagination.total} {t('table.applicationsBadge')}</Badge>
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '30%' }}>{t('table.headers.candidate')}</Table.Th>
              <Table.Th style={{ width: '20%' }}>{t('table.headers.appliedDate')}</Table.Th>
              <Table.Th style={{ width: '15%' }}>{t('table.headers.status')}</Table.Th>
              <Table.Th style={{ width: '15%', textAlign: 'right' }}>{t('table.headers.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows}
            {!isLoading && allApplications?.data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text ta="center" c="dimmed" py="sm">
                    {search ? t('table.emptyStates.noMatch') : t('table.emptyStates.noApplications')}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {allApplications && allApplications.pagination.totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={allApplications.pagination.totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}
    </Paper>
  );
}
