import { Box, Title, Group, Button, Stack, Text } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DashboardListItem } from '../../pages/employee/components/DashboardListItem';
import { JoinMeetingButton } from '../shared/JoinMeetingButton';

interface UpcomingInterviewsWidgetProps {
  upcomingInterviews: any[];
  isDark: boolean;
  onViewCalendar: () => void;
}

export function UpcomingInterviewsWidget({
  upcomingInterviews,
  isDark,
  onViewCalendar,
}: UpcomingInterviewsWidgetProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Box
      style={{
        borderRadius: 16,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark
          ? 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)'
          : '#ffffff',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(15,23,42,0.05)',
        padding: '24px',
      }}
    >
      <Group justify="space-between" mb="lg">
        <Title order={4} fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
          {t('upcomingInterviews.title')}
        </Title>
        <Button
          variant="subtle"
          size="xs"
          rightSection={<IconCalendarEvent size={13} />}
          onClick={onViewCalendar}
          style={{ fontWeight: 600 }}
        >
          {t('upcomingInterviews.viewCalendar')}
        </Button>
      </Group>

      {upcomingInterviews.length === 0 ? (
        <Box
          py="xl"
          style={{
            textAlign: 'center',
            borderRadius: 12,
            border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <Text c="dimmed" size="sm">{t('upcomingInterviews.empty')}</Text>
        </Box>
      ) : (
        <Stack gap={2}>
          {upcomingInterviews.map((interview) => {
            const candidate = interview.applications?.[0]?.candidate;
            const jobOffer = interview.applications?.[0]?.job_offer;
            if (!candidate || !jobOffer) return null;

            return (
              <DashboardListItem
                key={interview.id}
                date={interview.scheduled_time}
                candidateName={`${candidate.user?.first_name} ${candidate.user?.last_name}`}
                candidateId={candidate.id}
                position={jobOffer.position}
                action={
                  interview.meeting_link ? (
                    <JoinMeetingButton meetingLink={interview.meeting_link} />
                  ) : undefined
                }
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

