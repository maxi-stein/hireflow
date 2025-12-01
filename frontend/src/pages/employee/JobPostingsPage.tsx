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
import { useDebouncedValue } from '@mantine/hooks';
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
import { useJobOffersQuery, useDeleteJobOfferMutation } from '../../hooks/api/useJobOffers';
import { JobOfferStatus, type JobOffer } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';
import { notifications } from '@mantine/notifications';
import { ViewJobOfferModal } from '../../components/employee/job-postings/ViewJobOfferModal';
import { DeleteJobOfferModal } from '../../components/employee/job-postings/DeleteJobOfferModal';

export function JobPostingsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const [filter, setFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  
  // Modals
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [viewJobOfferId, setViewJobOfferId] = useState<string | null>(null);
  const [deleteJobOffer, setDeleteJobOffer] = useState<JobOffer | null>(null);

  const { data, isLoading } = useJobOffersQuery({
    page,
    limit: 10,
    status: filter as JobOfferStatus || undefined,
    position: debouncedSearch || undefined,
  });

  const deleteMutation = useDeleteJobOfferMutation();

  const handleCreateClick = () => {
    navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[1].path);
  };

  const handleViewClick = (offer: JobOffer) => {
    setViewJobOfferId(offer.id);
    setViewModalOpened(true);
  };

  const handleEditClick = (offerId: string) => {
    navigate(`/manage/job-postings/edit/${offerId}`);
  };

  const handleEditFromModal = () => {
    if (viewJobOfferId) {
      setViewModalOpened(false);
      handleEditClick(viewJobOfferId);
    }
  };

  const handleDeleteClick = (offer: JobOffer) => {
    setDeleteJobOffer(offer);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteJobOffer) return;

    try {
      await deleteMutation.mutateAsync(deleteJobOffer.id);
      notifications.show({
        title: 'Success',
        message: 'Job posting deleted successfully',
        color: 'green',
      });
      setDeleteModalOpened(false);
      setDeleteJobOffer(null);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete job posting. Please try again.',
        color: 'red',
      });
      console.error(error);
    }
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
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by status"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: JobOfferStatus.OPEN, label: 'Open' },
              { value: JobOfferStatus.CLOSED, label: 'Closed' },
            ]}
            value={filter}
            onChange={setFilter}
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
              <Table.Th>Applicants</Table.Th>
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
                  <Text size="sm">{offer.applicants_count}</Text>
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
                    <ActionIcon 
                      variant="subtle" 
                      color="gray"
                      onClick={() => handleViewClick(offer)}
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="subtle" 
                      color="blue"
                      onClick={() => handleEditClick(offer.id)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon 
                      variant="subtle" 
                      color="red"
                      onClick={() => handleDeleteClick(offer)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
            {!isLoading && (!data?.data || data.data.length === 0) && (
              <Table.Tr>
                <Table.Td colSpan={7} style={{ textAlign: 'center' }} py="xl">
                  <Text c="dimmed">No job postings found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <Group justify="center" p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Pagination 
              total={data.pagination.totalPages} 
              value={page} 
              onChange={setPage} 
            />
          </Group>
        )}
      </Paper>

      <ViewJobOfferModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        jobOfferId={viewJobOfferId}
        onEdit={handleEditFromModal}
      />

      <DeleteJobOfferModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        jobOffer={deleteJobOffer}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </Container>
  );
}
