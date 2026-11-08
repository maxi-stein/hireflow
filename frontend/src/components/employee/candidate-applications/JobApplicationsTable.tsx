import {
  Paper,
  Table,
  Badge,
  Group,
  Pagination,
  LoadingOverlay,
  TextInput,
  Text,
  Title,
  Select,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { IconSearch } from '@tabler/icons-react';
import { useJobApplicationsTable } from '../../../hooks/domain/useJobApplicationsTable';
import { JobApplicationTableRow } from './JobApplicationTableRow';

interface JobApplicationsTableProps {
  jobOfferId: string;
  jobTitle: string;
  deadline?: string | null;
}

export function JobApplicationsTable({
  jobOfferId,
  jobTitle,
  deadline,
}: JobApplicationsTableProps) {
  const { t } = useTranslation(['applications', 'candidates', 'common']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    page,
    setPage,
    search,
    setSearch,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    allApplications,
    isLoading,
    techStats,
    sortedApplications,
  } = useJobApplicationsTable({ jobOfferId });

  if (!isLoading && (!allApplications || allApplications.data.length === 0) && !search && !debouncedSearch) {
    return null; // Don't show table if no applications and no search active
  }

  return (
    <Paper withBorder radius="md" p="md" pos="relative" mb="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />

      <Group justify="space-between" mb="md" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>{jobTitle}</Title>
          {deadline && (
            <Text size="xs" c="red" mt={2}>
              {t('table.deadline')} {new Date(deadline).toLocaleDateString()}
            </Text>
          )}
        </Box>
        <Group wrap="wrap">
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

      <Table.ScrollContainer minWidth={850}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '22%' }}>{t('table.headers.candidate')}</Table.Th>
              <Table.Th style={{ width: '13%' }}>{t('table.headers.appliedDate')}</Table.Th>
              <Table.Th style={{ width: '12%' }}>{t('table.headers.status')}</Table.Th>
              <Table.Th style={{ width: '43%' }}>
                {t('table.headers.skills', { defaultValue: 'Habilidades y Experiencia' })}
              </Table.Th>
              <Table.Th style={{ width: '10%', textAlign: 'right' }}>{t('table.headers.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sortedApplications.map((application) => (
              <JobApplicationTableRow
                key={application.id}
                application={application}
                jobOfferId={jobOfferId}
                techStats={techStats}
                isDark={isDark}
              />
            ))}
            {!isLoading && allApplications?.data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}>
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
