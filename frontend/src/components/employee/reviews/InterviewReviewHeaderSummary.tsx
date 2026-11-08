import { Paper, Stack, Box, Text, Group, Divider } from '@mantine/core';
import { IconBriefcase, IconCalendar, IconUserCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { ScoreBadge } from '../../shared/ScoreBadge';

export interface InterviewReviewHeaderSummaryProps {
  candidateId?: string;
  candidateName?: string;
  candidateEmail?: string;
  candidateFirstName?: string;
  candidateLastName?: string;
  score?: number;
  isEditMode?: boolean;
  jobPosition?: string;
  interviewTitle?: string;
  scheduledTime?: string;
  reviewerName?: string;
}

export const InterviewReviewHeaderSummary = ({
  candidateId,
  candidateName,
  candidateEmail,
  candidateFirstName,
  candidateLastName,
  score,
  isEditMode,
  jobPosition,
  interviewTitle,
  scheduledTime,
  reviewerName,
}: InterviewReviewHeaderSummaryProps) => {
  const { t, i18n } = useTranslation('reviews');

  return (
    <Paper
      withBorder
      p="lg"
      radius="lg"
      bg="light-dark(#f8fafc, #0f172a)"
      style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
    >
      <Stack gap="md" align="center" ta="center">
        <CandidateAvatar
          candidateId={candidateId || ''}
          firstName={candidateFirstName}
          lastName={candidateLastName}
          size={96}
        />
        <Box>
          <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
            {candidateName || `${candidateFirstName || ''} ${candidateLastName || ''}`.trim()}
          </Text>
          {candidateEmail && (
            <Text size="xs" c="dimmed">
              {candidateEmail}
            </Text>
          )}
          {isEditMode && score !== undefined && (
            <Box mt={6}>
              <ScoreBadge score={score} size="sm" />
            </Box>
          )}
        </Box>
      </Stack>

      <Divider my="md" style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }} />

      <Stack gap="sm">
        {jobPosition && (
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <Box mt={2}>
              <IconBriefcase size={16} color="#64748b" />
            </Box>
            <Box>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {t('form.labels.position')}
              </Text>
              <Text size="sm" fw={600} c="light-dark(#0f172a, #f8fafc)">
                {jobPosition}
              </Text>
            </Box>
          </Group>
        )}

        {interviewTitle && (
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <Box mt={2}>
              <IconCalendar size={16} color="#64748b" />
            </Box>
            <Box>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {t('form.labels.interviewName', { defaultValue: 'Entrevista' })}
              </Text>
              <Text size="sm" fw={600} c="light-dark(#0f172a, #f8fafc)">
                {interviewTitle}
              </Text>
            </Box>
          </Group>
        )}

        {scheduledTime && (
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <Box mt={2}>
              <IconCalendar size={16} color="#64748b" />
            </Box>
            <Box>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {t('form.labels.interviewDate')}
              </Text>
              <Text size="sm" fw={500} c="light-dark(#0f172a, #f8fafc)">
                {new Date(scheduledTime).toLocaleString(i18n.language)}
              </Text>
            </Box>
          </Group>
        )}

        {reviewerName && (
          <Group gap="xs" align="flex-start" wrap="nowrap">
            <Box mt={2}>
              <IconUserCheck size={16} color="#64748b" />
            </Box>
            <Box>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {t('form.labels.reviewer')}
              </Text>
              <Text size="sm" fw={500} c="light-dark(#0f172a, #f8fafc)">
                {reviewerName}
              </Text>
            </Box>
          </Group>
        )}
      </Stack>
    </Paper>
  );
};

