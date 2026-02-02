import { Container, Title, Text, Stack, Card, SimpleGrid, LoadingOverlay, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useHighlightEffect } from '../../hooks/useHighlightEffect';
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
  const { highlightedId, setElementRef } = useHighlightEffect();
  const user = useAppStore((state) => state.user);
  const { data: jobOffers, isLoading } = useJobOffersQuery({
    status: JobOfferStatus.OPEN,
    candidateId: user?.type === 'candidate' ? user.id : undefined,
  });

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchApplications = async () => {
    if (user?.type === 'candidate' && user.id) {
      setApplicationsLoading(true);
      try {
        const applications = await candidateApplicationService.getAll({
          candidate_id: user.id,
          limit: 100
        });
        const ids = new Set(applications.data.map(app => app.job_offer.id));
        setAppliedJobIds(ids);
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setApplicationsLoading(false);
      }
    } else {
      setApplicationsLoading(false);
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
          <Stack gap="md">
            {jobOffers.data.map((job) => {
              const isApplied = appliedJobIds.has(job.id);
              const isLoadingApplications = applicationsLoading && user?.type === 'candidate';
              const isHighlighted = highlightedId === job.id;

              return (
                <div
                  id={`job-${job.id}`}
                  key={job.id}
                  ref={setElementRef(job.id)}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: isHighlighted ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: isHighlighted ? '0 8px 30px rgba(99, 102, 241, 0.4)' : 'none',
                    borderRadius: '8px',
                  }}
                >
                  <JobOfferCard
                    job={job}
                    action={
                      user?.type === 'candidate' ? (
                        <Button
                          fullWidth
                          loading={isLoadingApplications}
                          disabled={isLoadingApplications}
                          variant={
                            isLoadingApplications
                              ? 'light'
                              : isApplied
                                ? 'light'
                                : 'filled'
                          }
                          color={
                            isLoadingApplications
                              ? 'gray'
                              : isApplied
                                ? 'cyan'
                                : 'green'
                          }
                          onClick={() => {
                            if (isLoadingApplications) return;

                            isApplied
                              ? navigate('/candidate/applications')
                              : handleApplyClick(job);
                          }}
                        >
                          {isLoadingApplications
                            ? 'Checking application...'
                            : isApplied
                              ? 'View Application'
                              : 'Apply Now'}
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              );
            })}
          </Stack>
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
