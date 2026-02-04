import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Title, Card, Group, Box, Text, Badge, Divider, Button, SimpleGrid, Pagination } from '@mantine/core';
import { IconX, IconCalendarEvent, IconCheck } from '@tabler/icons-react';
import { ApplicationStatus, type CandidateApplication } from '../../../services/candidate-application.service';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';

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
  const { t } = useTranslation('profile');
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 4;

  const paginatedApplications = applications.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const getApplicationInterviews = (applicationId: string) => {
    return interviews.filter(i =>
      i.applications.some(app => app.id === applicationId)
    ).sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
  };

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="lg">{t('candidate.management.applications.title')}</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {paginatedApplications.map((app) => {
          // Determine if we are in "Edit" or "Schedule" mode for the button
          const appInterviews = getApplicationInterviews(app.id);
          const upcomingInterview = appInterviews.find(i => i.status === InterviewStatus.SCHEDULED);

          return (
            <Card key={app.id} withBorder padding="lg" radius="md">
              <Group justify="space-between" align="flex-start">
                <Box>
                  <Title order={4}>{app.job_offer.position}</Title>
                  <Text size="sm" c="dimmed">{app.job_offer.location} • {app.job_offer.work_mode}</Text>
                  <Text size="xs" mt="xs" c="dimmed">
                    {t('candidate.management.applications.appliedOn', { date: new Date(app.created_at).toLocaleDateString() })}
                  </Text>
                </Box>
                <Badge color={getStatusColor(app.status)} size="lg">
                  {app.status}
                </Badge>
              </Group>

              {/* Interview Feedback Section */}
              <CandidateInterviewsDisplay
                interviews={appInterviews}
                applicationId={app.id}
              />

              <Divider my="md" />

              <Group justify="flex-end">
                {app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.HIRED && (
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

                {app.status !== ApplicationStatus.REJECTED && app.status !== ApplicationStatus.HIRED && (
                  <Button
                    variant="outline"
                    color="green"
                    size="xs"
                    leftSection={<IconCheck size={14} />}
                    onClick={() => onHire(app.id, app.job_offer.position)}
                  >
                    {t('candidate.management.applications.hire')}
                  </Button>
                )}

                {app.status !== ApplicationStatus.REJECTED && !upcomingInterview && (
                  <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    leftSection={<IconCalendarEvent size={14} />}
                    onClick={() => onSchedule(app.id)}
                  >
                    {t('candidate.management.applications.schedule')}
                  </Button>
                )}

                {app.status === ApplicationStatus.REJECTED && (
                  <Text size="sm" c="dimmed" fs="italic">{t('candidate.management.applications.rejectedStatus')}</Text>
                )}
              </Group>
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
