import { Modal, Text, Group, Badge, Stack, Button, Anchor, Avatar } from '@mantine/core';
import { CandidateAvatar } from '../../shared/CandidateAvatar';
import { InterviewStatus } from '../../../services/interview.service';
import type { Interview } from '../../../services/interview.service';
import { IconCalendar, IconClock, IconVideo, IconUsers } from '@tabler/icons-react';

interface InterviewDetailsModalProps {
  interview: Interview | null;
  onClose: () => void;
  onReschedule?: (interview: Interview) => void;
  onCancel?: (interview: Interview) => void;
}

export function InterviewDetailsModal({ interview, onClose, onReschedule, onCancel }: InterviewDetailsModalProps) {
  if (!interview) return null;

  const jobOffer = interview.applications?.[0]?.job_offer;

  const getStatusColor = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.COMPLETED: return 'green';
      case InterviewStatus.CANCELLED: return 'red';
      case InterviewStatus.SCHEDULED: return 'blue';
      case InterviewStatus.NO_SHOW: return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Modal opened={!!interview} onClose={onClose} title="Interview Details">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            {interview.applications?.map(app => (
              <Group key={app.id} gap="sm">
                <CandidateAvatar
                  candidateId={app.candidate.id}
                  firstName={app.candidate.user.first_name}
                  lastName={app.candidate.user.last_name}
                  size="md"
                />
                <Text size="lg" fw={700}>
                  {app.candidate?.user?.first_name || 'Unknown'} {app.candidate?.user?.last_name || ''}
                </Text>
              </Group>
            ))}
            {(!interview.applications || interview.applications.length === 0) && (
              <Text size="lg" fw={700} c="dimmed">No candidates</Text>
            )}
          </Stack>
          <Badge color={getStatusColor(interview.status)}>{interview.status}</Badge>
        </Group>

        <Text c="dimmed" size="sm">
          Position: <Text span fw={500} c="bright">{jobOffer?.position || 'N/A'}</Text>
        </Text>

        <Group>
          <IconCalendar size={18} />
          <Text>{new Date(interview.scheduled_time).toLocaleDateString()}</Text>
        </Group>

        <Group>
          <IconClock size={18} />
          <Text>{new Date(interview.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
        </Group>

        {interview.meeting_link && (
          <Group>
            <IconVideo size={18} />
            <Anchor href={interview.meeting_link} target="_blank" rel="noopener noreferrer">
              Join Meeting
            </Anchor>
          </Group>
        )}

        <Stack gap="xs">
          <Group gap="xs">
            <IconUsers size={18} />
            <Text fw={500}>Interviewers:</Text>
          </Group>
          {interview.interviewers?.map(interviewer => (
            <Group key={interviewer.id} gap="sm" ml="lg">
              <Avatar size="sm" radius="xl" />
              <Text size="sm">{interviewer.user?.first_name || 'N/A'} {interviewer.user?.last_name || ''}</Text>
            </Group>
          ))}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>Close</Button>
          {onCancel && interview.status !== InterviewStatus.CANCELLED && interview.status !== InterviewStatus.COMPLETED && (
            <Button variant="outline" color="red" onClick={() => onCancel(interview)}>
              Cancel Interview
            </Button>
          )}
          {onReschedule && (
            <Button variant="light" onClick={() => onReschedule(interview)} disabled={interview.status !== InterviewStatus.SCHEDULED}>
              Reschedule
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
