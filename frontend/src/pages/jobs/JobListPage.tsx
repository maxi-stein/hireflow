import { Title, Text, Stack, LoadingOverlay, Button, Box, Group, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useIncompleteProfile } from '../../hooks/useIncompleteProfile';
import { useAppStore } from '../../store/useAppStore';
import { JobOfferStatus, type JobOffer } from '../../services/job-offer.service';
import { useEffect, useState } from 'react';
import { candidateApplicationService } from '../../services/candidate-application.service';
import { JobApplicationModal } from '../../components/jobs/JobApplicationModal';
import { IncompleteProfileModal } from '../../components/jobs/IncompleteProfileModal';
import { JobOfferGrid } from '../../components/jobs/JobOfferGrid';
import { JobFiltersBar } from '../../components/jobs/JobFiltersBar';
import { useJobListFilters } from '../../hooks/domain/useJobListFilters';
import { useTranslation } from 'react-i18next';
import { IconBriefcase, IconCheck } from '@tabler/icons-react';

export const JobListPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const { data: jobOffers, isLoading } = useJobOffersQuery({
    status: JobOfferStatus.OPEN,
    candidateId: user?.type === 'candidate' ? user.id : undefined,
  });

  const allJobs = jobOffers?.data ?? [];

  const {
    searchKeyword,
    selectedModality,
    setSelectedModality,
    filteredJobs,
    handleSearchChange,
    handleClearSearch,
    handleClearFilters,
  } = useJobListFilters({ allJobs });

  const { isProfileIncomplete } = useIncompleteProfile(user?.type === 'candidate' ? user.id : '');

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  const fetchApplications = async () => {
    if (user?.type === 'candidate' && user.id) {
      setApplicationsLoading(true);
      try {
        const applications = await candidateApplicationService.getAll({
          candidate_id: user.id,
          limit: 100,
        });
        const ids = new Set(applications.data.map((app) => app.job_offer.id));
        setAppliedJobIds(ids);
      } catch {
        // Fallback
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
      navigate('/login', { state: { from: { pathname: '/jobs', hash: `#job-${job.id}` } } });
      return;
    }

    if (user.type === 'employee') {
      navigate('/manage/dashboard');
      return;
    }

    if (isProfileIncomplete) {
      setSelectedJob(job);
      setWarningModalOpen(true);
      return;
    }

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
    <Box py={{ base: 24, md: 48 }} px={{ base: 'md', md: 'xl' }}>
      <Box
        bg="light-dark(#ffffff, #1e293b)"
        style={{
          borderRadius: 24,
          boxShadow: 'light-dark(0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 4px 20px -2px rgba(0, 0, 0, 0.4))',
          border: '1px solid light-dark(#e2e8f0, #334155)',
          padding: '36px 40px',
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        <Stack gap="xl">
          {/* Header */}
          <Box>
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
              <div>
                <Group gap="xs" mb={6}>
                  <Badge size="lg" radius="xl" color="blue" variant="light" leftSection={<IconBriefcase size={14} />}>
                    {t('jobs:publicList.badge', 'Oportunidades de Empleo')}
                  </Badge>
                  <Badge size="lg" radius="xl" color="gray" variant="outline">
                    {t('jobs:publicList.openJobsCount', { count: allJobs.length, defaultValue: `${allJobs.length} ofertas abiertas` })}
                  </Badge>
                </Group>
                <Title order={1} size="h1" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
                  {t('jobs:publicList.title', 'Bolsa de Trabajo')}
                </Title>
                <Text c="dimmed" size="lg" mt={4}>
                  {t('jobs:publicList.subtitle', 'Explorá nuestras vacantes disponibles y postulate directamente con tus habilidades clave.')}
                </Text>
              </div>

              {user?.type === 'candidate' && (
                <Button
                  variant="light"
                  color="blue"
                  onClick={() => navigate('/candidate/applications')}
                >
                  {t('jobs:publicList.viewMyApplications', { count: appliedJobIds.size, defaultValue: `Ver mis postulaciones (${appliedJobIds.size})` })}
                </Button>
              )}
            </Group>
          </Box>

          {/* Search & Filter Toolbar */}
          <JobFiltersBar
            searchKeyword={searchKeyword}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            selectedModality={selectedModality}
            onModalityChange={setSelectedModality}
            filteredCount={filteredJobs.length}
            totalCount={allJobs.length}
            onClearFilters={handleClearFilters}
          />

          {/* Job Offers Grid */}
          <JobOfferGrid
            jobs={filteredJobs}
            emptyMessage={
              searchKeyword || selectedModality !== 'all'
                ? t('jobs:publicList.noFilterResults', 'No encontramos ofertas que coincidan con tu búsqueda.')
                : t('jobs:publicList.empty', 'No hay ofertas disponibles en este momento')
            }
            emptySubtitle={
              searchKeyword || selectedModality !== 'all'
                ? t('jobs:publicList.noFilterResultsSubtitle', 'Probá modificando las palabras clave o seleccionando otra modalidad.')
                : undefined
            }
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

              if (user?.type !== 'candidate') {
                return (
                  <Button
                    fullWidth
                    variant="filled"
                    color="blue"
                    onClick={() => handleApplyClick(job)}
                  >
                    {t('applyNow', 'Postularme')}
                  </Button>
                );
              }

              const isApplied = appliedJobIds.has(job.id);
              const isLoadingApplications = applicationsLoading && user?.type === 'candidate';

              if (isLoadingApplications) {
                return (
                  <Button fullWidth loading variant="light" color="gray">
                    {t('jobs:publicList.checking', 'Verificando...')}
                  </Button>
                );
              }

              if (isApplied) {
                return (
                  <Button
                    fullWidth
                    variant="light"
                    color="teal"
                    leftSection={<IconCheck size={16} />}
                    onClick={() => navigate('/candidate/applications')}
                  >
                    {t('jobs:publicList.viewApplication', 'Ya postulado')}
                  </Button>
                );
              }

              return (
                <Button
                  fullWidth
                  variant="filled"
                  color="blue"
                  onClick={() => handleApplyClick(job)}
                >
                  {t('applyNow', 'Postularme')}
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

          <IncompleteProfileModal
            opened={warningModalOpen}
            onClose={() => setWarningModalOpen(false)}
            onApplyAnyway={() => {
              setWarningModalOpen(false);
              setModalOpen(true);
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
