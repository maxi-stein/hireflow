import {
  Title,
  Text,
  Stack,
  LoadingOverlay,
  Box,
  Group,
  Button,
  Badge,
  Tabs,
  Paper,
  SimpleGrid,
  ThemeIcon,
} from '@mantine/core';
import {
  IconFileText,
  IconClock,
  IconCalendarEvent,
  IconBriefcase,
  IconCheck,
  IconInbox,
  IconArrowRight,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useAllCandidateApplicationsQuery } from '../../hooks/api/useCandidateApplications';
import { useCandidateInterviewsQuery } from '../../hooks/api/useInterviews';
import { UpcomingInterviewsAlert } from '../../components/candidate/UpcomingInterviewsAlert';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { CandidateApplicationCard } from '../../components/candidate/CandidateApplicationCard';

export const ApplicationsPage = () => {
  const user = useAppStore((state) => state.user);
  const { t } = useTranslation('applications');
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<string>('all');

  // Fetch applications for the logged-in candidate
  const { data: applicationsResponse, isLoading: isLoadingApplications } =
    useAllCandidateApplicationsQuery({
      candidate_id: user?.id,
      limit: 50,
    });

  // Fetch all interviews for the candidate
  const { data: interviewsResponse, isLoading: isLoadingInterviews } =
    useCandidateInterviewsQuery(user?.id || '');

  const applications = applicationsResponse?.data || [];
  const allInterviews = interviewsResponse?.data || [];

  // Helper function to get interviews for a specific application
  const getInterviewsForApplication = (applicationId: string): Interview[] => {
    return allInterviews.filter((interview) =>
      interview.applications.some((app) => app.id === applicationId)
    );
  };

  // Sort applications by creation date (most recent first)
  const sortedApplications = useMemo(() => {
    return [...applications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [applications]);

  // Upcoming interviews
  const upcomingInterviews = useMemo(() => {
    const now = new Date();
    return allInterviews
      .filter(
        (interview) =>
          interview.status === InterviewStatus.SCHEDULED &&
          new Date(interview.scheduled_time) > now
      )
      .map((interview) => ({
        interview,
        jobPosition: interview.applications[0]?.job_offer?.position || 'Posición Tech',
      }));
  }, [allInterviews]);

  // Counts for tabs & stats
  const inProgressApps = useMemo(
    () => sortedApplications.filter((a) => a.status === 'APPLIED' || a.status === 'IN_PROGRESS'),
    [sortedApplications]
  );
  const interviewApps = useMemo(
    () =>
      sortedApplications.filter((a) =>
        getInterviewsForApplication(a.id).some((i) => i.status === InterviewStatus.SCHEDULED)
      ),
    [sortedApplications, allInterviews]
  );
  const finishedApps = useMemo(
    () => sortedApplications.filter((a) => a.status === 'REJECTED' || a.status === 'HIRED'),
    [sortedApplications]
  );

  // Filtered applications based on active tab
  const filteredApplications = useMemo(() => {
    if (filterTab === 'in_progress') return inProgressApps;
    if (filterTab === 'interviews') return interviewApps;
    if (filterTab === 'finished') return finishedApps;
    return sortedApplications;
  }, [filterTab, sortedApplications, inProgressApps, interviewApps, finishedApps]);

  const isLoading = isLoadingApplications || isLoadingInterviews;

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
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <div>
              <Group gap="xs" mb={6}>
                <Badge size="lg" radius="xl" color="blue" variant="light" leftSection={<IconFileText size={14} />}>
                  {t('candidate.badge', 'Panel del Candidato')}
                </Badge>
                <Badge size="lg" radius="xl" color="gray" variant="outline">
                  {t('candidate.applicationsCount', { count: sortedApplications.length, defaultValue: `${sortedApplications.length} postulaciones` })}
                </Badge>
              </Group>
              <Title order={1} size="h1" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
                {t('candidate.title', 'Mis Postulaciones')}
              </Title>
              <Text c="dimmed" size="lg" mt={4}>
                {t(
                  'candidate.subtitle',
                  'Seguí el estado de tus candidaturas, agendas de entrevistas y respuestas de selección en tiempo real.'
                )}
              </Text>
            </div>

            <Button
              color="blue"
              variant="filled"
              rightSection={<IconArrowRight size={16} />}
              onClick={() => navigate('/jobs')}
            >
              {t('candidate.exploreButton', 'Explorar nuevas ofertas')}
            </Button>
          </Group>

          {/* Upcoming Interviews Alert */}
          {upcomingInterviews.length > 0 && (
            <UpcomingInterviewsAlert upcomingInterviews={upcomingInterviews} />
          )}

          {/* Stats Metric Cards */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <Paper p="lg" radius="lg" withBorder bg="light-dark(#ffffff, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {t('candidate.statsTotal', 'Total Postulaciones')}
                  </Text>
                  <Text size="1.8rem" fw={800} c="light-dark(#0f172a, #f8fafc)" mt={4}>
                    {sortedApplications.length}
                  </Text>
                </Box>
                <ThemeIcon size={44} radius="md" color="blue" variant="light">
                  <IconFileText size={22} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="lg" radius="lg" withBorder bg="light-dark(#ffffff, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {t('candidate.statsInProgress', 'En Revisión')}
                  </Text>
                  <Text size="1.8rem" fw={800} c="blue.7" mt={4}>
                    {inProgressApps.length}
                  </Text>
                </Box>
                <ThemeIcon size={44} radius="md" color="indigo" variant="light">
                  <IconClock size={22} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="lg" radius="lg" withBorder bg="light-dark(#ffffff, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {t('candidate.statsInterviews', 'Entrevistas')}
                  </Text>
                  <Text size="1.8rem" fw={800} c="violet.7" mt={4}>
                    {interviewApps.length}
                  </Text>
                </Box>
                <ThemeIcon size={44} radius="md" color="violet" variant="light">
                  <IconCalendarEvent size={22} />
                </ThemeIcon>
              </Group>
            </Paper>

            <Paper p="lg" radius="lg" withBorder bg="light-dark(#ffffff, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {t('candidate.statsFinished', 'Finalizadas')}
                  </Text>
                  <Text size="1.8rem" fw={800} c="gray.7" mt={4}>
                    {finishedApps.length}
                  </Text>
                </Box>
                <ThemeIcon size={44} radius="md" color="gray" variant="light">
                  <IconCheck size={22} />
                </ThemeIcon>
              </Group>
            </Paper>
          </SimpleGrid>

          {/* Filter Tabs */}
          <Tabs value={filterTab} onChange={(val) => setFilterTab(val || 'all')} color="blue" radius="md">
            <Tabs.List style={{ borderBottom: '2px solid light-dark(#e2e8f0, #334155)', marginBottom: 20 }}>
              <Tabs.Tab
                value="all"
                rightSection={<Badge size="xs" circle color="gray">{sortedApplications.length}</Badge>}
                style={{ fontWeight: 700 }}
              >
                {t('candidate.tabs.all', 'Todas las postulaciones')}
              </Tabs.Tab>

              <Tabs.Tab
                value="in_progress"
                rightSection={<Badge size="xs" circle color="blue">{inProgressApps.length}</Badge>}
                style={{ fontWeight: 700 }}
              >
                {t('candidate.tabs.inProgress', 'En revisión')}
              </Tabs.Tab>

              <Tabs.Tab
                value="interviews"
                rightSection={<Badge size="xs" circle color="violet">{interviewApps.length}</Badge>}
                style={{ fontWeight: 700 }}
              >
                {t('candidate.tabs.interviews', 'Con entrevista')}
              </Tabs.Tab>

              <Tabs.Tab
                value="finished"
                rightSection={<Badge size="xs" circle color="gray">{finishedApps.length}</Badge>}
                style={{ fontWeight: 700 }}
              >
                {t('candidate.tabs.finished', 'Finalizadas')}
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value={filterTab}>
              {/* Applications List */}
              {filteredApplications.length > 0 ? (
                <Stack gap="lg">
                  {filteredApplications.map((application) => (
                    <CandidateApplicationCard
                      key={application.id}
                      application={application}
                      interviews={getInterviewsForApplication(application.id)}
                    />
                  ))}
                </Stack>
              ) : (
                <Paper
                  p="3rem"
                  radius="lg"
                  ta="center"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '2px dashed #cbd5e1',
                  }}
                >
                  <Box
                    p={12}
                    bg="#ffffff"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      color: '#94a3b8',
                    }}
                  >
                    <IconInbox size={28} />
                  </Box>
                  <Text fw={700} size="lg" c="#0f172a">
                    {filterTab === 'all'
                      ? t('candidate.emptyAllTitle', 'Aún no tenés postulaciones activas')
                      : t('candidate.emptyFilterTitle', 'No hay postulaciones en este estado')}
                  </Text>
                  <Text size="sm" c="dimmed" maw={440} mx="auto" mt={4} mb="lg">
                    {filterTab === 'all'
                      ? t('candidate.emptyAllDesc', 'Explorá las ofertas disponibles en HireFlow y postulá con tu perfil técnico.')
                      : t('candidate.emptyFilterDesc', 'Cambiá el filtro o explorá nuevas vacantes para postularte.')}
                  </Text>
                  <Button
                    color="blue"
                    leftSection={<IconBriefcase size={16} />}
                    onClick={() => navigate('/jobs')}
                  >
                    {t('candidate.exploreJobs', 'Explorar ofertas laborales')}
                  </Button>
                </Paper>
              )}
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Box>
    </Box>
  );
};
