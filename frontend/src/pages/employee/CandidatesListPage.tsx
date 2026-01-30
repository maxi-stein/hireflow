import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Pagination,
  Stack,
  TextInput,
  Select,
  Table,
  ActionIcon,
  Tooltip,
  LoadingOverlay
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconEye, IconSortAscending, IconSortDescending, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidatesQuery } from '../../hooks/api/useCandidates';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';

export function CandidatesListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [sortBy, setSortBy] = useState<'updated_at' | 'last_name'>('updated_at');

  const { data: candidatesData, isLoading } = useCandidatesQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    sort: sortBy,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1); // Reset to first page on search
  };

  const handleSortChange = (value: string | null) => {
    if (value === 'updated_at' || value === 'last_name') {
      setSortBy(value);
      setPage(1);
    }
  };

  const rows = candidatesData?.data.map((candidate) => (
    <Table.Tr key={candidate.id}>
      <Table.Td>
        <Group gap="sm">
          <CandidateAvatar
            candidateId={candidate.id}
            firstName={candidate.user.first_name}
            lastName={candidate.user.last_name}
            size="md"
          />
          <div>
            <Text fw={500}>
              {candidate.user.first_name} {candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{candidate.user.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        {candidate.city && candidate.country ? (
          <Text size="sm">{candidate.city}, {candidate.country}</Text>
        ) : (
          <Text size="sm" c="dimmed">N/A</Text>
        )}
      </Table.Td>
      <Table.Td>
        {/* Display latest experience or education as quick info? Or just Update date */}
        <Text size="sm">{new Date(candidate.profile_updated_at).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label="View Details">
            <ActionIcon
              variant="light"
              color="blue"
              onClick={() => navigate(`/manage/candidates/list/${candidate.id}`)}
              aria-label="View details"
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>Candidates Database</Title>
            <Text c="dimmed" size="sm">
              Search and manage all registered candidates.
            </Text>
          </div>
        </Group>

        <Paper p="md" withBorder radius="md">
          <Group justify="space-between" mb="md">
            <TextInput
              placeholder="Search by name or email..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={handleSearchChange}
              w={300}
            />
            <Select
              label="Sort by"
              placeholder="Sort by"
              leftSection={sortBy === 'updated_at' ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
              data={[
                { value: 'updated_at', label: 'Last Updated' },
                { value: 'last_name', label: 'Last Name' },
              ]}
              value={sortBy}
              onChange={handleSortChange}
              allowDeselect={false}
              w={200}
            />
          </Group>

          <Paper pos="relative" mih={300}>
            <LoadingOverlay visible={isLoading} zIndex={100} overlayProps={{ radius: "sm", blur: 2 }} />

            <Table horizontalSpacing="md" verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Candidate</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Last Active</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows}
                {!isLoading && candidatesData?.data.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={4}>
                      <Stack align="center" py="xl" gap="xs">
                        <IconUser size={40} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed">No candidates found matching your criteria.</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Paper>

          {candidatesData && candidatesData.pagination.totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                total={candidatesData.pagination.totalPages}
                value={page}
                onChange={setPage}
              />
            </Group>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
