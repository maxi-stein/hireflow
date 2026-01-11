import { Container, Title, Text, Stack, Card, SimpleGrid, LoadingOverlay, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAppStore } from '../../store/useAppStore';
import { JobOfferStatus } from '../../services/job-offer.service';
import type { JobOffer } from '../../services/job-offer.service';
import { JobOfferCard } from '../../components/jobs/JobOfferCard';
import { useEffect, useState } from 'react';
import { candidateApplicationService } from '../../services/candidate-application.service';
import { JobApplicationModal } from '../../components/jobs/JobApplicationModal';

export const JobListPage = () => {
  const navigate = useNavigate();
  const { data: jobOffers, isLoading } = useJobOffersQuery({ status: JobOfferStatus.OPEN });
  const user = useAppStore((state) => state.user);

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplications = async () => {
    if (user?.type === 'candidate' && user.id) {
      try {
        const applications = await candidateApplicationService.getAll({
          candidate_id: user.id,
          limit: 100 // Fetch enough to cover most cases, ideally implement pagination or specific check
        });
        const ids = new Set(applications.data.map(app => app.job_offer.id));
        setAppliedJobIds(ids);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const handleApplyClick = (job: JobOffer) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.type === 'employee') {
      navigate('/manage/dashboard');
      return;
    }

    // Open modal
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    fetchApplications();
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
            {jobOffers.data.map((job) => {
              const isApplied = appliedJobIds.has(job.id);
              return (
                <JobOfferCard
                  key={job.id}
                  job={job}
                  isApplied={isApplied}
                  action={
                    user?.type === 'candidate' ? (
                      <Button
                        fullWidth
                        variant={isApplied ? 'light' : 'filled'}
                        color={isApplied ? 'green' : 'blue'}
                        onClick={() => isApplied ? navigate('/candidate/applications') : handleApplyClick(job)}
                      >
                        {isApplied ? 'View Application' : 'Apply Now'}
                      </Button>
                    ) : undefined
                  }
                />
              );
            })}
          </SimpleGrid>
        )}

        {selectedJob && user?.type === 'candidate' && (
          <JobApplicationModal
            key={selectedJob.id}
            opened={modalOpen}
            onClose={() => setModalOpen(false)}
            jobOffer={selectedJob}
            candidateId={user.id}
            onSuccess={handleApplicationSuccess}
          />
        )}
      </Stack>
    </Container>
  );
};
