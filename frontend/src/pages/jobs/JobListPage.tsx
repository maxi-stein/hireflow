import { Container, Title, Text, Stack, Card, SimpleGrid, LoadingOverlay, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAppStore } from '../../store/useAppStore';
import { JobOfferStatus } from '../../services/job-offer.service';
import { JobOfferCard } from '../../components/jobs/JobOfferCard';

export const JobListPage = () => {
  const navigate = useNavigate();
  const { data: jobOffers, isLoading } = useJobOffersQuery({ status: JobOfferStatus.OPEN });
  const user = useAppStore((state) => state.user);

  const handleApply = (jobId: string) => {
    if (!user) {
      // Not logged in - redirect to login
      navigate('/login');
      return;
    }

    if (user.type === 'employee') {
      // Employee - redirect to dashboard
      navigate('/manage/dashboard');
      return;
    }

    // Candidate - redirect to dummy page (you can create a proper application page later)
    navigate(`/jobs/${jobId}/apply`);
  };

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1}>Available Positions</Title>
          <Text c="dimmed" size="lg">Find your next career opportunity</Text>
        </div>

        {!jobOffers?.data || jobOffers.data.length === 0 ? (
          <Card withBorder p="xl">
            <Text ta="center" c="dimmed">No open positions available at this time.</Text>
          </Card>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {jobOffers.data.map((job) => (
              <JobOfferCard
                key={job.id}
                job={job}
                action={
                  user?.type === 'candidate' ? (
                    <Button
                      fullWidth
                      onClick={() => handleApply(job.id)}
                    >
                      Apply Now
                    </Button>
                  ) : undefined
                }
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
};
