import { Modal, Text, Group, Stack, Button, Paper, Badge, Box } from '@mantine/core';
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
    <Modal
      opened={!!interview}
      onClose={onClose}
      radius="lg"
      size="lg"
      title={
        <Group gap="xs" align="center">
          <Box>
            {interview.title && (
              <Text fw={800} size="lg" c="blue.6">
                {interview.title}
              </Text>
            )}
            {jobOffer?.position && (
              <Text size="sm" c="dimmed" fw={500}>
                {jobOffer.position}
              </Text>
            )}
            {!interview.title && !jobOffer?.position && (
              <Text fw={800} size="lg" c="blue.6">
                {t('title')}
              </Text>
            )}
          </Box>
          {interview.type && (
            <Badge variant="light" color="blue" size="sm">
              {interview.type}
            </Badge>
          )}
        </Group>
      }
    >
      <Stack gap="md" pt="xs">
        {/* Candidate & Date Overview Card */}
        <Paper withBorder p="md" radius="md" bg="light-dark(#f8fafc, #0f172a)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Stack gap={6}>
              {interview.applications?.map(app => (
                <Group key={app.id} gap="sm">
                  <CandidateAvatar
                    candidateId={app.candidate.id}
                    firstName={app.candidate.user.first_name}
                    lastName={app.candidate.user.last_name}
                    size="md"
                  />
                  <Box>
                    <Text size="md" fw={700} c="light-dark(#0f172a, #f8fafc)">
                      {app.candidate?.user?.first_name || 'Unknown'} {app.candidate?.user?.last_name || ''}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {app.candidate?.user?.email}
                    </Text>
                  </Box>
                </Group>
              ))}
              {(!interview.applications || interview.applications.length === 0) && (
                <Text size="md" fw={700} c="dimmed">{t('modal.labels.noCandidates', { ns: 'calendar' })}</Text>
              )}
            </Stack>

            <Paper withBorder p="xs" radius="md" bg="light-dark(#ffffff, #1e293b)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
              <Stack gap={4}>
                <Group gap="xs">
                  <IconCalendar size={16} color="#2563eb" />
                  <Text size="sm" fw={600} c="light-dark(#0f172a, #f8fafc)">
                    {new Date(interview.scheduled_time).toLocaleDateString()}
                  </Text>
                </Group>
                <Group gap="xs">
                  <IconClock size={16} color="#2563eb" />
                  <Text size="sm" fw={600} c="light-dark(#0f172a, #f8fafc)">
                    {new Date(interview.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </Text>
                </Group>
              </Stack>
            </Paper>
          </Group>
        </Paper>

        {interview.meeting_link && (
          <JoinMeetingButton meetingLink={interview.meeting_link} size="md" fullWidth />
        )}

        {/* Interviewers Section */}
        <Paper withBorder p="md" radius="md" bg="light-dark(#ffffff, #1e293b)" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}>
          <Group gap="xs" mb="sm">
            <IconUsers size={18} color="#64748b" />
            <Text fw={700} size="sm" c="light-dark(#0f172a, #f8fafc)">
              {t('modal.labels.interviewer', { ns: 'calendar' })}:
            </Text>
          </Group>
          <Stack gap="xs">
            {interview.interviewers?.map(interviewer => (
              <Group key={interviewer.id} gap="sm" p="xs" bg="light-dark(#f8fafc, #0f172a)" style={{ borderRadius: 8 }}>
                <CandidateAvatar
                  firstName={interviewer.user?.first_name}
                  lastName={interviewer.user?.last_name}
                  size="sm"
                />
                <Text size="sm" fw={500} c="light-dark(#0f172a, #f8fafc)">
                  {interviewer.user?.first_name || 'N/A'} {interviewer.user?.last_name || ''}
                </Text>
              </Group>
            ))}
          </Stack>
        </Paper>

        {/* Modal Actions */}
        <Group justify="flex-end" mt="md" gap="sm">
          <Button variant="default" radius="md" onClick={onClose}>
            {t('actions.close', { ns: 'common' })}
          </Button>
          {onCancel && interview.status !== InterviewStatus.CANCELLED && interview.status !== InterviewStatus.COMPLETED && (
            <Button variant="light" color="red" radius="md" onClick={() => onCancel(interview)}>
              {t('actions.cancel', { ns: 'calendar' })}
            </Button>
          )}
          {onReschedule && (
            <Button variant="filled" color="blue" radius="md" onClick={() => onReschedule(interview)} disabled={interview.status !== InterviewStatus.SCHEDULED}>
              {t('actions.reschedule', { ns: 'calendar' })}
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
