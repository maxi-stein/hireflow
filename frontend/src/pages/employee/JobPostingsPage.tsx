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
import { getTableHeaders } from '../../utils/table-headers';

export function JobPostingsPage() {
  const navigate = useNavigate();

  // Search by position (with debounce)
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 1000);

  // Filter by status
  const [filter, setFilter] = useState<string | null>(null);

  // Pagination of job offers
  const [page, setPage] = useState(1);

  // Modals
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);

  // Job offer to view or delete
  const [viewJobOfferId, setViewJobOfferId] = useState<string | null>(null);
  const [deleteJobOffer, setDeleteJobOffer] = useState<JobOffer | null>(null);

  const tableHeaders = getTableHeaders("job-offers");

  const { data: jobOffers, isLoading } = useJobOffersQuery({
    page,
    limit: 10,
    status: filter as JobOfferStatus || undefined,
    position: debouncedSearch || undefined,
  });

  const deleteMutation = useDeleteJobOfferMutation();

  // When clicking create Job Posting button, navigate to create job posting page
  const handleCreateClick = () => {
    navigate(ROUTES.EMPLOYEE.JOB_POSTINGS_GROUP.children[1].path);
  };

  // When clicking view button, open view modal
  const handleViewClick = (offer: JobOffer) => {
    setViewJobOfferId(offer.id);
    setViewModalOpened(true);
  };

  // When clicking edit button, navigate to edit job posting page
  const handleEditClick = (offerId: string) => {
    navigate(`/manage/job-postings/edit/${offerId}`);
  };

  // When clicking delete button, open delete modal
  const handleDeleteClick = (offer: JobOffer) => {
    setDeleteJobOffer(offer);
    setDeleteModalOpened(true);
  };

  // When clicking delete button inside delete modal, delete job offer
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
              {tableHeaders.map((header) => (
                <Table.Th key={header.accessorKey}>{header.title}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {jobOffers?.data.map((offer) => (
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
                  <Text size="sm" ta="center">{offer.applicants_count}</Text>
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
                  {offer.deadline ? new Date(offer.deadline).toLocaleDateString() : '-'}
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
            {!isLoading && (!jobOffers?.data || jobOffers.data.length === 0) && (
              <Table.Tr>
                <Table.Td colSpan={7} style={{ textAlign: 'center' }} py="xl">
                  <Text c="dimmed">No job postings found</Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        {jobOffers?.pagination && jobOffers.pagination.totalPages > 1 && (
          <Group justify="center" p="md" style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
            <Pagination
              total={jobOffers.pagination.totalPages}
              value={page}
              onChange={setPage}
            />
          </Group>
        )}
      </Paper>

      {/* Job Offer Details Modal */}
      <ViewJobOfferModal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        jobOfferId={viewJobOfferId}
      />

      {/* Delete Job Offer Modal */}
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
