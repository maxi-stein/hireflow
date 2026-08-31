import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Title, Card, Group, Box, Text, Badge, Divider, Button, SimpleGrid, Pagination, Alert } from '@mantine/core';
import { IconX, IconCalendarEvent, IconCheck, IconCircleX } from '@tabler/icons-react';
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
  getStatusColor,
  onReject,
  onHire,
  onSchedule
}: ApplicationsSectionProps) {
  const { t } = useTranslation(['profile', 'jobs', 'common']);
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
      return timeB - timeA; // Descending order
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const paginatedApplications = sortedApplications.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  return (
    <Paper withBorder radius="md" p="lg" bg="light-dark(var(--mantine-color-gray-1), var(--mantine-color-gray-8))">
      <Title order={3} mb="lg">{t('candidate.management.applications.title')}</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {paginatedApplications.map((app) => {
          // Determine if we are in "Edit" or "Schedule" mode for the button
          const appInterviews = getApplicationInterviews(app.id);
          const upcomingInterview = appInterviews.find(i => i.status === InterviewStatus.SCHEDULED);
          const locationInfo = getLocationDisplayInfo(app.job_offer.work_mode, app.job_offer.location);

          return (
            <Card 
              key={app.id} 
              withBorder={app.status !== ApplicationStatus.REJECTED}
              bd={app.status === ApplicationStatus.REJECTED ? '1px solid var(--mantine-color-red-6)' : undefined}
              padding="lg" 
              radius="md"
            >
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Title order={3} c="light-dark(var(--mantine-color-blue-9), var(--mantine-color-white))">{app.job_offer.position}</Title>
                  <Text size="sm" c="dimmed">
                    {locationInfo.location ? `${locationInfo.location} • ` : ''}{t(`jobs:workMode.${String(locationInfo.workMode).toLowerCase()}`)}
                  </Text>
                  <Text size="xs" mt="xs" c="dimmed">
                    {t('candidate.management.applications.appliedOn', { date: new Date(app.created_at).toLocaleDateString() })}
                  </Text>
                </Box>
                <Badge color={getStatusColor(app.status)} size="lg">
                  {t('common:applicationStatus.' + app.status)}
                </Badge>
              </Group>

              {/* Interview Feedback Section */}
              <CandidateInterviewsDisplay
                interviews={appInterviews}
                applicationId={app.id}
              />

              <Divider my="md" />

              {app.status === ApplicationStatus.REJECTED ? (
                <Alert variant="light" color="red" icon={<IconCircleX size={16} />} p="sm">
                  {t('candidate.management.applications.rejectedStatus')}
                </Alert>
              ) : (
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    {app.status !== ApplicationStatus.HIRED && (
                      <Button
                        variant="light"
                        color="red"
                        size="xs"
                        leftSection={<IconX size={14} />}
                        onClick={() => onReject(app.id, app.job_offer.position)}
                      >
                        {t('candidate.management.applications.reject')}
                      </Button>
                    )}

                    {app.status !== ApplicationStatus.HIRED && (
                      <Button
                        variant="light"
                        color="green"
                        size="xs"
                        leftSection={<IconCheck size={14} />}
                        onClick={() => onHire(app.id, app.job_offer.position)}
                      >
                        {t('candidate.management.applications.hire')}
                      </Button>
                    )}
                  </Group>

                  {!upcomingInterview && (
                    <Button
                      variant="light"
                      color="blue"
                      size="xs"
                      ml="auto"
                      bd="1px solid var(--mantine-color-blue-outline)"
                      leftSection={<IconCalendarEvent size={14} />}
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
          <Text c="dimmed">{t('candidate.management.applications.empty')}</Text>
        )}
      </SimpleGrid>

      {applications.length > itemsPerPage && (
        <Group justify="center" mt="xl">
          <Pagination
            total={Math.ceil(applications.length / itemsPerPage)}
            value={activePage}
            onChange={setActivePage}
          />
        </Group>
      )}
    </Paper>
  );
}
