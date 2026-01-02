import { useState } from 'react';
import { Paper, Title, Card, Group, Box, Text, Badge, Divider, Button, Alert, SimpleGrid, Pagination } from '@mantine/core';
import { IconX, IconCalendarEvent, IconAlertCircle } from '@tabler/icons-react';
import { ApplicationStatus, type CandidateApplication } from '../../../services/candidate-application.service';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { CandidateInterviewsDisplay } from '../../shared/candidate-display/CandidateInterviewsDisplay';

interface ApplicationsSectionProps {
  applications: CandidateApplication[];
  interviews: Interview[];
  getStatusColor: (status: ApplicationStatus) => string;
  onReject: (applicationId: string, position: string) => void;
  onSchedule: (applicationId: string) => void;
}

export function ApplicationsSection({
  applications,
  interviews,
  getStatusColor,
  onReject,
  onSchedule
}: ApplicationsSectionProps) {
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

  const getNextAction = (applicationId: string) => {
    const appInterviews = getApplicationInterviews(applicationId);


    // Only show decision needed if there are completed reviews
    if (appInterviews.some(i => i.status === InterviewStatus.COMPLETED && (i.reviews?.length ?? 0) > 0)) {
      return {
        type: 'decision',
        message: 'Decision Needed',
        detail: 'Interview and review completed. Ready for next step.',
        color: 'yellow',
        icon: <IconAlertCircle size={16} />
      };
    }

    return null;
  };

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="lg">Job Applications</Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {paginatedApplications.map((app) => {
          const nextAction = app.status === ApplicationStatus.IN_PROGRESS ? getNextAction(app.id) : null;

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
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </Text>
                </Box>
                <Badge color={getStatusColor(app.status)} size="lg">
                  {app.status}
                </Badge>
              </Group>

              {nextAction && (
                <Alert
                  variant="light"
                  color={nextAction.color}
                  title={nextAction.message}
                  icon={nextAction.icon}
                  mt="md"
                >
                  {nextAction.detail}
                </Alert>
              )}

              {/* Interview Feedback Section */}
              <CandidateInterviewsDisplay
                interviews={appInterviews}
                applicationId={app.id}
              />

              <Divider my="md" />

              <Group justify="flex-end">
                {app.status !== ApplicationStatus.REJECTED && (
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    leftSection={<IconX size={14} />}
                    onClick={() => onReject(app.id, app.job_offer.position)}
                  >
                    Reject
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
                    Schedule Interview
                  </Button>
                )}

                {app.status === ApplicationStatus.REJECTED && (
                  <Text size="sm" c="dimmed" fs="italic">Application Rejected</Text>
                )}
              </Group>
            </Card>
          );
        })}

        {(!applications || applications.length === 0) && (
          <Text c="dimmed">No active applications found for this candidate.</Text>
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
