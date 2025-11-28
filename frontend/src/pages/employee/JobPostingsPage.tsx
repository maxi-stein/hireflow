import { 
  Container, 
  Title, 
  Group, 
  Button, 
  TextInput, 
  Select, 
  Table, 
  Badge, 
  ActionIcon, 
  Paper,
  Text,
  LoadingOverlay,
  Pagination
} from '@mantine/core';
import { 
  IconSearch, 
  IconPlus, 
  IconFilter, 
  IconEye, 
  IconEdit, 
  IconTrash 
} from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { JobOfferStatus } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';

export function JobPostingsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useJobOffersQuery({
    page,
    limit: 10,
    status: statusFilter as JobOfferStatus || undefined,
    // positions: search ? [search] : undefined, // Backend filter expects exact match array, implementing client-side search or improving backend later might be better. For now keeping it simple.
  });

  const handleCreateClick = () => {
    navigate(ROUTES.EMPLOYEE.CREATE_JOB.path);
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Job Postings</Title>
          <Text c="dimmed" size="sm">Manage your company's job offers</Text>
        </div>
        <Button 
          leftSection={<IconPlus size={20} />} 
          onClick={handleCreateClick}
        >
          Create Job Posting
        </Button>
      </Group>

      <Paper p="md" mb="lg" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Search by position..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by status"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: JobOfferStatus.OPEN, label: 'Open' },
              { value: JobOfferStatus.CLOSED, label: 'Closed' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            clearable
            style={{ width: 200 }}
          />
        </Group>
      </Paper>

      <Paper radius="md" withBorder style={{ position: 'relative', minHeight: 200 }}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Position</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Work Mode</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Posted Date</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data?.data.map((offer) => (
              <Table.Tr key={offer.id}>
                <Table.Td>
                  <Text fw={500}>{offer.position}</Text>
                </Table.Td>
                <Table.Td>{offer.location}</Table.Td>
                <Table.Td>
                  <Badge variant="light" color="gray">
                    {offer.work_mode}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge 
                    color={offer.status === JobOfferStatus.OPEN ? 'green' : 'red'}
                    variant="light"
                  >
                    {offer.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {new Date(offer.created_at).toLocaleDateString()}
                </Table.Td>
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <ActionIcon variant="subtle" color="gray">
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="blue">
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" color="red">
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {!isLoading && (!data?.data || data.data.length === 0) && (
              <Table.Tr>
                <Table.Td colSpan={6} align="center" py="xl">
                  <Text c="dimmed">No job postings found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        {data?.meta && (
          <Group justify="center" p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Pagination 
              total={data.meta.last_page} 
              value={page} 
              onChange={setPage} 
            />
          </Group>
        )}
      </Paper>
    </Container>
  );
}
