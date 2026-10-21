import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import { Box, Title, Card, Group, Text, Badge, Divider, Button, SimpleGrid, Pagination, Alert, useMantineColorScheme } from '@mantine/core';
import { IconX, IconCalendarEvent, IconCheck, IconCircleX, IconBriefcase } from '@tabler/icons-react';
import { ApplicationStatus, type CandidateApplication } from '../../../services/candidate-application.service';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';
import { getLocationDisplayInfo } from '../../../utils/job.utils';

interface ApplicationsSectionProps {
  applications: CandidateApplication[];
  interviews: Interview[];
  getStatusColor: (status: ApplicationStatus) => string;
  onReject: (applicationId: string, position: string) => void;
  onHire: (applicationId: string, position: string) => void;
  onSchedule: (applicationId: string) => void;
}

export function ApplicationsSection({
  applications,
  interviews,
  onReject,
  onHire,
  onSchedule
}: ApplicationsSectionProps) {
  const { t } = useTranslation(['profile', 'jobs', 'common']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 4;

  const getApplicationInterviews = (applicationId: string) => {
    return interviews.filter(i =>
      i.applications.some(app => app.id === applicationId)
    ).sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
  };

  const getLatestInterviewTime = (app: CandidateApplication) => {
    const appInterviews = getApplicationInterviews(app.id);
    if (appInterviews.length === 0) return 0;
    const relevantInterviews = appInterviews.filter(i =>
      i.status !== InterviewStatus.CANCELLED
    );
    if (relevantInterviews.length === 0) return 0;

    return Math.max(...relevantInterviews.map(i => new Date(i.scheduled_time).getTime()));
  };

  const sortedApplications = [...applications].sort((a, b) => {
    const timeA = getLatestInterviewTime(a);
    const timeB = getLatestInterviewTime(b);
    if (timeA !== timeB) {
      return timeB - timeA;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const paginatedApplications = sortedApplications.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <Box>
      <Group gap="sm" mb="lg">
        <Box p={8} style={{ borderRadius: 10, background: isDark ? 'rgba(37,99,235,0.15)' : '#eff6ff', display: 'flex' }}>
          <IconBriefcase size={18} color="#2563eb" />
        </Box>
        <Title order={3} size="h4">{t('candidate.management.applications.title')}</Title>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {paginatedApplications.map((app) => {
          const appInterviews = getApplicationInterviews(app.id);
          const upcomingInterview = appInterviews.find(i => i.status === InterviewStatus.SCHEDULED);
          const locationInfo = getLocationDisplayInfo(app.job_offer.work_mode, app.job_offer.location);
          const isRejected = app.status === ApplicationStatus.REJECTED;
          const isHired = app.status === ApplicationStatus.HIRED;

          return (
            <Card
              key={app.id}
              radius="xl"
              padding="lg"
              style={{
                border: `1px solid ${
                  isRejected
                    ? (isDark ? '#7f1d1d' : '#fca5a5')
                    : isHired
                    ? (isDark ? '#065f46' : '#6ee7b7')
                    : (isDark ? '#334155' : '#e2e8f0')
                }`,
                background: isRejected
                  ? (isDark ? 'rgba(127,29,29,0.15)' : '#fff7f7')
                  : isDark ? '#1e293b' : '#ffffff',
                transition: 'box-shadow 0.2s ease',
              }}
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700} size="md" lineClamp={1} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    {app.job_offer.position}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {locationInfo.location ? `${locationInfo.location} · ` : ''}
                    {t(`jobs:workMode.${String(locationInfo.workMode).toLowerCase()}`)}
                  </Text>
                  <Text size="xs" mt={4} c="dimmed">
                    {t('candidate.management.applications.appliedOn', { date: new Date(app.created_at).toLocaleDateString() })}
                  </Text>
                </Box>
                <Badge
                  color={getApplicationStatusColor(app.status)}
                  size="md"
                  radius="md"
                  variant="light"
                >
                  {t('common:applicationStatus.' + app.status)}
                </Badge>
              </Group>

              {/* Interview Feedback Section */}
              <CandidateInterviewsDisplay
                interviews={appInterviews}
                applicationId={app.id}
              />

              <Divider my="md" style={{ borderColor: isDark ? '#334155' : '#f1f5f9' }} />

              {isRejected ? (
                <Alert variant="light" color="red" icon={<IconCircleX size={15} />} p="sm" radius="md">
                  {t('candidate.management.applications.rejectedStatus')}
                </Alert>
              ) : (
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    {!isHired && (
                      <Button
                        variant="light"
                        color="red"
                        size="xs"
                        radius="md"
                        leftSection={<IconX size={13} />}
                        onClick={() => onReject(app.id, app.job_offer.position)}
                      >
                        {t('candidate.management.applications.reject')}
                      </Button>
                    )}

                    {!isHired && (
                      <Button
                        variant="light"
                        color="green"
                        size="xs"
                        radius="md"
                        leftSection={<IconCheck size={13} />}
                        onClick={() => onHire(app.id, app.job_offer.position)}
                      >
                        {t('candidate.management.applications.hire')}
                      </Button>
                    )}
                  </Group>

                  {!upcomingInterview && !isHired && (
                    <Button
                      variant="subtle"
                      color="blue"
                      size="xs"
                      radius="md"
                      leftSection={<IconCalendarEvent size={13} />}
                      onClick={() => onSchedule(app.id)}
                    >
                      {t('candidate.management.applications.schedule')}
                    </Button>
                  )}
                </Group>
              )}
            </Card>
          );
        })}

        {(!applications || applications.length === 0) && (
          <Box
            py="xl"
            style={{
              textAlign: 'center',
              borderRadius: 12,
              border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
              gridColumn: '1 / -1',
            }}
          >
            <Text c="dimmed">{t('candidate.management.applications.empty')}</Text>
          </Box>
        )}
      </SimpleGrid>

      {applications.length > itemsPerPage && (
        <Group justify="center" mt="xl">
          <Pagination
            total={Math.ceil(applications.length / itemsPerPage)}
            value={activePage}
            onChange={setActivePage}
            size="sm"
          />
        </Group>
      )}
    </Box>
  );
}
