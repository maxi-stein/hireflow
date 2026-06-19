import { Title, Text, Stack, LoadingOverlay, Button, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useAppStore } from '../../store/useAppStore';
import { JobOfferStatus } from '../../services/job-offer.service';
import type { JobOffer } from '../../services/job-offer.service';
import { useEffect, useState } from 'react';
import { candidateApplicationService } from '../../services/candidate-application.service';
import { JobApplicationModal } from '../../components/jobs/JobApplicationModal';
import { JobOfferGrid } from '../../components/jobs/JobOfferGrid';
import { useTranslation } from 'react-i18next';

export const JobListPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
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
    <Box py={{ base: 32, md: 56 }}>
      <Box
        bg="light-dark(#fff, var(--mantine-color-dark-7))"
        style={{
          borderRadius: 20,
          boxShadow: 'var(--mantine-shadow-md)',
          padding: '40px 48px',
          maxWidth: 1600,
          margin: '0 auto',
        }}
      >
        <Stack gap="xl">
          <div>
            <Title order={1}>{t('jobs:publicList.title')}</Title>
            <Text c="dimmed" size="lg">{t('jobs:publicList.subtitle')}</Text>
          </div>

          <JobOfferGrid
            jobs={jobOffers?.data ?? []}
            emptyMessage={t('jobs:publicList.empty')}
            renderAction={(job) => {
              if (user?.type === 'employee') {
                return (
                  <Button
                    fullWidth
                    variant="light"
                    color="blue"
                    onClick={() => navigate(`/manage/job-postings/edit/${job.id}`)}
                  >
                    {t('jobs:employeeList.editOffer', 'Editar oferta')}
                  </Button>
                );
              }

              if (user?.type !== 'candidate') return undefined;

              const isApplied = appliedJobIds.has(job.id);
              const isLoadingApplications = applicationsLoading && user?.type === 'candidate';

              return (
                <Button
                  fullWidth
                  loading={isLoadingApplications}
                  disabled={isLoadingApplications}
                  variant={isLoadingApplications ? 'light' : isApplied ? 'light' : 'filled'}
                  color={isLoadingApplications ? 'gray' : isApplied ? 'cyan' : 'green'}
                  onClick={() => {
                    if (isLoadingApplications) return;
                    isApplied ? navigate('/candidate/applications') : handleApplyClick(job);
                  }}
                >
                  {isLoadingApplications
                    ? t('jobs:publicList.checking')
                    : isApplied
                      ? t('jobs:publicList.viewApplication')
                      : t('applyNow')}
                </Button>
              );
            }}
          />

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
      </Box>
    </Box>
  );
};
