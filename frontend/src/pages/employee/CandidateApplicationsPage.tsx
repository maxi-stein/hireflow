import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Pagination,
  Stack,
  Box,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { JobOfferStatus } from '../../services/job-offer.service';
import { JobApplicationsTable } from '../../components/employee/candidate-applications/JobApplicationsTable';

export function CandidateApplicationsPage() {
  const { t } = useTranslation('applications');

  // Paginate the list of job offers
  const [page, setPage] = useState(1);

  // Fetch active job offers to group applications
  const { data: jobOffers, isLoading: isLoadingJobs } = useJobOffersQuery({
    page,
    limit: 5,
    status: JobOfferStatus.OPEN, // Only show open jobs
  });

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <Box>
          <Title order={2}>{t('title')}</Title>
          <Text c="dimmed" size="sm">
            {t('subtitle')}
          </Text>
        </Box>

        {isLoadingJobs ? (
          <Text>{t('loading')}</Text>
        ) : (
          <>
            {/* List of job offers */}
            {jobOffers?.data.map(job => (
              <JobApplicationsTable
                key={job.id}
                jobOfferId={job.id}
                jobTitle={job.position}
                deadline={job.deadline}
              />
            ))}

            {/* No job offers found */}
            {jobOffers?.data.length === 0 && (
              <Paper p="xl" withBorder radius="md">
                <Text ta="center" c="dimmed">{t('empty')}</Text>
              </Paper>
            )}

            {/* Pagination if 6 or more Job Offers found*/}
            {jobOffers && jobOffers.pagination.totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Pagination
                  total={jobOffers.pagination.totalPages}
                  value={page}
                  onChange={setPage}
                />
              </Group>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}
