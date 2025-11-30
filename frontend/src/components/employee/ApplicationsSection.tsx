import { Paper, Title, Stack, Card, Group, Box, Text, Badge, Divider, Button } from '@mantine/core';
import { IconX, IconCalendarEvent } from '@tabler/icons-react';
import { ApplicationStatus, type CandidateApplication } from '../../services/candidate-application.service';

interface ApplicationsSectionProps {
  applications: CandidateApplication[];
  getStatusColor: (status: ApplicationStatus) => string;
  onReject: (applicationId: string, position: string) => void;
  onSchedule: (applicationId: string, position: string) => void;
}

export function ApplicationsSection({ 
  applications, 
  getStatusColor, 
  onReject, 
  onSchedule 
}: ApplicationsSectionProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="lg">Job Applications</Title>
      
      <Stack gap="md">
        {applications.map((app) => (
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
              
              {app.status !== ApplicationStatus.REJECTED && (
                <Button 
                  variant="light" 
                  color="blue" 
                  size="xs"
                  leftSection={<IconCalendarEvent size={14} />}
                  onClick={() => onSchedule(app.id, app.job_offer.position)}
                >
                  Schedule Interview
                </Button>
              )}

              {app.status === ApplicationStatus.REJECTED && (
                <Text size="sm" c="dimmed" fs="italic">Application Rejected</Text>
              )}
            </Group>
          </Card>
        ))}

        {(!applications || applications.length === 0) && (
           <Text c="dimmed">No active applications found for this candidate.</Text>
        )}
      </Stack>
    </Paper>
  );
}
