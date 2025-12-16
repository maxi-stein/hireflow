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
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { JobOfferStatus } from '../../services/job-offer.service';
import { JobApplicationsTable } from '../../components/employee/candidate-applications/JobApplicationsTable';


export function CandidateApplicationsPage() {

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
          <Title order={2}>Candidate Applications</Title>
          <Text c="dimmed" size="sm">
            Review applications grouped by Job Posting.
          </Text>
        </Box>

        {isLoadingJobs ? (
          <Text>Loading job postings...</Text>
        ) : (
          <>
            {/* List of job offers */}
            {jobOffers?.data.map(job => (
              <JobApplicationsTable
                key={job.id}
                jobOfferId={job.id}
                jobTitle={job.position}
              />
            ))}

            {/* No job offers found */}
            {jobOffers?.data.length === 0 && (
              <Paper p="xl" withBorder radius="md">
                <Text ta="center" c="dimmed">No active job postings found.</Text>
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
