import { Modal, Text, Group, Badge, Stack, Button } from '@mantine/core';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { InterviewStatus } from '../../../services/interview.service';
import type { Interview } from '../../../services/interview.service';
import { IconCalendar, IconClock, IconUsers } from '@tabler/icons-react';
import { JoinMeetingButton } from '../../shared/JoinMeetingButton';
import { useTranslation } from 'react-i18next';

interface InterviewDetailsModalProps {
  interview: Interview | null;
  onClose: () => void;
  onReschedule?: (interview: Interview) => void;
  onCancel?: (interview: Interview) => void;
}

export function InterviewDetailsModal({ interview, onClose, onReschedule, onCancel }: InterviewDetailsModalProps) {
  const { t } = useTranslation(['calendar', 'common', 'candidates']);

  if (!interview) return null;

  const jobOffer = interview.applications?.[0]?.job_offer;

  return (
    <Modal opened={!!interview} onClose={onClose} title={<h3 style={{ color: "var(--mantine-color-blue-filled)" }}> {jobOffer?.position || ''}</h3>}>
      <Stack gap="md" style={{ padding: "0px 3px 20px 3px" }}>
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
              <Text size="lg" fw={700} c="dimmed">{t('modal.labels.noCandidates', { ns: 'calendar' })}</Text>
            )}
          </Stack>
          <Stack gap={4} align="flex-end">
            <Group gap="xs">
              <IconCalendar size={18} />
              <Text>{new Date(interview.scheduled_time).toLocaleDateString()}</Text>
            </Group>
            <Group gap="xs">
              <IconClock size={18} />
              <Text>{new Date(interview.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</Text>
            </Group>
          </Stack>
        </Group>

        {interview.meeting_link && (
          <JoinMeetingButton meetingLink={interview.meeting_link} size="md" fullWidth />
        )}

        <Stack gap="xs">
          <Group gap="xs">
            <IconUsers size={18} />
            <Text fw={500}>{t('modal.labels.interviewer', { ns: 'calendar' })}:</Text>
          </Group>
          {interview.interviewers?.map(interviewer => (
            <Group key={interviewer.id} gap="sm" ml="lg">
              <CandidateAvatar
                firstName={interviewer.user?.first_name}
                lastName={interviewer.user?.last_name}
                size="sm"
              />
              <Text size="sm">{interviewer.user?.first_name || 'N/A'} {interviewer.user?.last_name || ''}</Text>
            </Group>
          ))}
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>{t('actions.close', { ns: 'common' })}</Button>
          {onCancel && interview.status !== InterviewStatus.CANCELLED && interview.status !== InterviewStatus.COMPLETED && (
            <Button variant="outline" color="red" onClick={() => onCancel(interview)}>
              {t('actions.cancel', { ns: 'calendar' })}
            </Button>
          )}
          {onReschedule && (
            <Button variant="light" onClick={() => onReschedule(interview)} disabled={interview.status !== InterviewStatus.SCHEDULED}>
              {t('actions.reschedule', { ns: 'calendar' })}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal >
  );
}
