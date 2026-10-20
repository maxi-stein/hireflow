import { Title, Text, Stack, LoadingOverlay, Button, Box, TextInput, SegmentedControl, Group, Badge, Paper } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { useIncompleteProfile } from '../../hooks/useIncompleteProfile';
import { useAppStore } from '../../store/useAppStore';
import { JobOfferStatus, WorkMode } from '../../services/job-offer.service';
import type { JobOffer } from '../../services/job-offer.service';
import { useEffect, useState, useMemo } from 'react';
import { candidateApplicationService } from '../../services/candidate-application.service';
import { JobApplicationModal } from '../../components/jobs/JobApplicationModal';
import { IncompleteProfileModal } from '../../components/jobs/IncompleteProfileModal';
import { JobOfferGrid } from '../../components/jobs/JobOfferGrid';
import { useTranslation } from 'react-i18next';
import { IconSearch, IconX, IconBriefcase, IconCheck, IconFilter } from '@tabler/icons-react';

export const JobListPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAppStore((state) => state.user);

  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [selectedModality, setSelectedModality] = useState<string>('all');

  const { data: jobOffers, isLoading } = useJobOffersQuery({
    status: JobOfferStatus.OPEN,
    candidateId: user?.type === 'candidate' ? user.id : undefined,
  });

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
          limit: 100
        });
        const ids = new Set(applications.data.map(app => app.job_offer.id));
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

  // Keep search keyword in sync if URL query changes
  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchKeyword) {
      setSearchKeyword(q);
    }
  }, [searchParams]);

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

    // Open modal
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleApplicationSuccess = () => {
    fetchApplications();
  };

  // Filter jobs based on searchKeyword and selectedModality
  const allJobs = jobOffers?.data ?? [];
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Modality filter
      if (selectedModality !== 'all') {
        const jobMode = job.work_mode?.toLowerCase() || '';
        if (selectedModality === 'remote' && jobMode !== WorkMode.REMOTE) return false;
        if (selectedModality === 'hybrid' && jobMode !== WorkMode.HYBRID) return false;
        if (selectedModality === 'office' && jobMode !== 'office' && jobMode !== 'presencial') return false;
      }

      // Keyword search
      if (searchKeyword.trim()) {
        const term = searchKeyword.toLowerCase();
        const matchesPosition = job.position?.toLowerCase().includes(term);
        const matchesDescription = job.description?.toLowerCase().includes(term);
        const matchesLocation = job.location?.toLowerCase().includes(term);
        const matchesSkill = job.skills?.some(s => s.skill_name?.toLowerCase().includes(term));

        return matchesPosition || matchesDescription || matchesLocation || matchesSkill;
      }

      return true;
    });
  }, [allJobs, searchKeyword, selectedModality]);

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedModality('all');
    setSearchParams({});
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
          <Paper p="md" radius="lg" withBorder bg="light-dark(#f8fafc, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
            <Stack gap="sm">
              <Group justify="space-between" align="center" wrap="wrap" gap="md">
                <TextInput
                  placeholder={t('jobs:publicList.searchPlaceholder', 'Buscar por puesto, tecnología (React, Node, Java) o ciudad...')}
                  leftSection={<IconSearch size={18} color="#64748b" />}
                  rightSection={
                    searchKeyword ? (
                      <IconX
                        size={16}
                        style={{ cursor: 'pointer', color: '#94a3b8' }}
                        onClick={() => {
                          setSearchKeyword('');
                          setSearchParams({});
                        }}
                      />
                    ) : null
                  }
                  value={searchKeyword}
                  onChange={(e) => {
                    const val = e.currentTarget.value;
                    setSearchKeyword(val);
                    if (val) setSearchParams({ search: val });
                    else setSearchParams({});
                  }}
                  style={{ flex: '1', minWidth: 260 }}
                  size="md"
                />

                <Group gap="xs" align="center">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                    {t('jobs:publicList.modalityLabel', 'Modalidad:')}
                  </Text>
                  <SegmentedControl
                    value={selectedModality}
                    onChange={setSelectedModality}
                    data={[
                      { label: t('jobs:publicList.modalities.all', 'Todas'), value: 'all' },
                      { label: t('jobs:publicList.modalities.remote', 'Remoto'), value: 'remote' },
                      { label: t('jobs:publicList.modalities.hybrid', 'Híbrido'), value: 'hybrid' },
                      { label: t('jobs:publicList.modalities.office', 'Presencial'), value: 'office' },
                    ]}
                    size="sm"
                    radius="md"
                  />
                </Group>
              </Group>

              {/* Status summary of filter */}
              {(searchKeyword || selectedModality !== 'all') && (
                <Group justify="space-between" align="center" pt="xs" style={{ borderTop: '1px solid #e2e8f0' }}>
                  <Group gap="xs">
                    <IconFilter size={15} color="#64748b" />
                    <Text size="sm" c="dimmed">
                      {t('jobs:publicList.showingCount', { filtered: filteredJobs.length, total: allJobs.length, defaultValue: `Mostrando ${filteredJobs.length} de ${allJobs.length} ofertas` })}
                    </Text>
                  </Group>
                  <Button variant="subtle" color="red" size="xs" onClick={handleClearFilters}>
                    {t('jobs:publicList.clearFilters', 'Limpiar filtros')}
                  </Button>
                </Group>
              )}
            </Stack>
          </Paper>

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
