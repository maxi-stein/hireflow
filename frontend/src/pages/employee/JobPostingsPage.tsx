import {
  Container,
  Title,
  Group,
  Button,
  Paper,
  Text,
  LoadingOverlay,
  Pagination
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useJobOffersQuery, useDeleteJobOfferMutation } from '../../hooks/api/useJobOffers';
import { JobOfferStatus, type JobOffer } from '../../services/job-offer.service';
import { ROUTES } from '../../router/routes.config';
import { notifications } from '@mantine/notifications';
import { ViewJobOfferModal } from '../../components/employee/job-postings/ViewJobOfferModal';
import { DeleteJobOfferModal } from '../../components/employee/job-postings/DeleteJobOfferModal';
import { JobPostingsFilters } from '../../components/employee/job-postings/JobPostingsFilters';
import { JobPostingsTable } from '../../components/employee/job-postings/JobPostingsTable';
import { APP_MAX_WIDTH } from '../../constants/layout';

export function JobPostingsPage() {
  const { t } = useTranslation('jobs');
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
        title: t('list.deleteModal.successTitle'),
        message: t('list.deleteModal.successMessage'),
        color: 'green',
      });
      setDeleteModalOpened(false);
      setDeleteJobOffer(null);
    } catch (error) {
      notifications.show({
        title: t('list.deleteModal.errorTitle'),
        message: t('list.deleteModal.errorMessage'),
        color: 'red',
      });
      console.error(error);
    }
  };

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>{t('list.title')}</Title>
          <Text c="dimmed" size="sm">{t('list.subtitle')}</Text>
        </div>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={handleCreateClick}
        >
          {t('list.createButton')}
        </Button>
      </Group>

      <JobPostingsFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <Paper radius="md" withBorder style={{ position: 'relative', minHeight: 200 }}>
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

        <JobPostingsTable
          jobOffers={jobOffers?.data || []}
          isLoading={isLoading}
          onViewClick={handleViewClick}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />

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
