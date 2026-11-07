import {
  Box,
  Group,
  Text,
  Button,
  Paper,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconVideo,
  IconPencil,
  IconAlertCircle,
  IconClock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { InterviewStatus } from '../../../services/interview.service';

export interface InterviewActionBannersProps {
  effectiveStatus: InterviewStatus;
  isScheduled: boolean;
  canUploadReview: boolean;
  pendingInterviewers: Array<{ user: { first_name: string; last_name: string } }>;
  formattedDate: string;
  formattedTime: string;
  meetingLink?: string;
  onUploadReview: () => void;
  onViewSchedule: () => void;
}

export const InterviewActionBanners = ({
  effectiveStatus,
  isScheduled,
  canUploadReview,
  pendingInterviewers,
  formattedDate,
  formattedTime,
  meetingLink,
  onUploadReview,
  onViewSchedule,
}: InterviewActionBannersProps) => {
  const { t } = useTranslation(['reviews']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      {/* 1. Notification if some interviewers haven't submitted yet */}
      {effectiveStatus === InterviewStatus.COMPLETED && pendingInterviewers.length > 0 && (
        <Text size="xs" c="dimmed" fs="italic">
          <IconClock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          {t('candidateDisplay.waitingFeedback')} ({pendingInterviewers.map(i => `${i.user.first_name} ${i.user.last_name}`).join(', ')})
        </Text>
      )}

      {/* 2. Action Banner for Pending Review by Current User */}
      {canUploadReview && (
        <Paper
          withBorder
          radius="md"
          p="sm"
          style={{
            background: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb',
            borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : '#fde68a',
          }}
        >
          <Group justify="space-between" align="center" gap="sm" wrap="wrap">
            <Group gap="xs" style={{ flex: 1, minWidth: 200 }}>
              <IconAlertCircle size={18} color="#d97706" />
              <Text size="xs" fw={600} c={isDark ? '#fbbf24' : '#92400e'}>
                {t('candidateDisplay.interviewPastNoReview')}
              </Text>
            </Group>
            <Button
              size="xs"
              color="orange"
              radius="md"
              leftSection={<IconPencil size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onUploadReview();
              }}
              style={{ fontWeight: 600 }}
            >
              {t('candidateDisplay.uploadReview')}
            </Button>
          </Group>
        </Paper>
      )}

      {/* 3. Action Banner for Scheduled Interview */}
      {isScheduled && (
        <Paper
          withBorder
          radius="md"
          p="sm"
          style={{
            background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
            borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
          }}
        >
          <Group justify="space-between" align="center" gap="sm" wrap="wrap">
            <Group gap="xs" style={{ flex: 1, minWidth: 200 }}>
              <IconCalendarEvent size={18} color="#2563eb" />
              <Box>
                <Text size="xs" fw={600} c={isDark ? '#60a5fa' : '#1d4ed8'}>
                  {t('candidateDisplay.interviewNotHappenedYet')}
                </Text>
                <Text size="xs" c="dimmed">
                  {formattedDate} • {formattedTime}
                </Text>
              </Box>
            </Group>

            <Group gap="xs">
              {meetingLink && (
                <Button
                  component="a"
                  href={meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="xs"
                  variant="light"
                  color="teal"
                  radius="md"
                  leftSection={<IconVideo size={14} />}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('card.googleMeet')}
                </Button>
              )}
              <Button
                size="xs"
                variant="light"
                color="blue"
                radius="md"
                leftSection={<IconCalendarEvent size={14} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onViewSchedule();
                }}
              >
                {t('candidateDisplay.viewSchedule')}
              </Button>
            </Group>
          </Group>
        </Paper>
      )}
    </>
  );
};

