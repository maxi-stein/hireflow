import {
  Paper,
  Table,
  Badge,
  Group,
  Pagination,
  LoadingOverlay,
  ActionIcon,
  Menu,
  TextInput,
  Text,
  Title,
  Select,
  Box
} from '@mantine/core';
import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useAllCandidateApplicationsQuery } from '../../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { IconEye, IconScale, IconDotsVertical, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CandidateAvatar } from '../../shared/CandidateAvatar';

export function JobApplicationsTable({ jobOfferId, jobTitle, deadline }: { jobOfferId: string, jobTitle: string, deadline?: string | null }) {
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
  });

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.HIRED:
        return 'green';
      case ApplicationStatus.REJECTED:
        return 'red';
      case ApplicationStatus.APPLIED:
        return 'gray';
      case ApplicationStatus.IN_PROGRESS:
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (!isLoading && (!allApplications || allApplications.data.length === 0) && !search && !debouncedSearch) {
    return null; // Don't show table if no applications and no search active
  }

  // Filter and sort applications
  const sortedApplications = allApplications?.data
    .filter(app => {
      if (statusFilter === 'all') return true;
      return app.status === statusFilter;
    })
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
        <Badge color={getStatusColor(application.status)} variant="light">
          {application.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <Menu shadow="md" width={200} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                onClick={() => navigate(`/manage/candidates/${application.candidate.id}`)}
              >
                Candidate Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconScale size={14} />}
                onClick={() => navigate(`/manage/candidates/compare?jobOfferId=${jobOfferId}&candidateId=${application.candidate.id}`)}
              >
                Compare
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
              Deadline: {new Date(deadline).toLocaleDateString()}
            </Text>
          )}
        </Box>
        <Group>
          <Select
            placeholder="Filter by status"
            data={[
              { value: 'all', label: 'All Statuses' },
              { value: ApplicationStatus.APPLIED, label: 'Applied' },
              { value: ApplicationStatus.IN_PROGRESS, label: 'In Progress' },
              { value: ApplicationStatus.HIRED, label: 'Hired' },
              { value: ApplicationStatus.REJECTED, label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            size="xs"
            w={150}
          />
          <TextInput
            placeholder="Search candidate..."
            leftSection={<IconSearch size={14} />}
            size="xs"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Badge variant="outline">{sortedApplications.length} Applications</Badge>
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={600}>
        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '30%' }}>Candidate</Table.Th>
              <Table.Th style={{ width: '20%' }}>Applied Date</Table.Th>
              <Table.Th style={{ width: '15%' }}>Status</Table.Th>
              <Table.Th style={{ width: '15%', textAlign: 'right' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows}
            {!isLoading && allApplications?.data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text ta="center" c="dimmed" py="sm">
                    {search ? 'No candidates found matching your search.' : 'No applications yet.'}
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
