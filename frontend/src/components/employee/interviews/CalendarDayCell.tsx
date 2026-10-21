import { Paper, Text, Stack, Box, Group } from '@mantine/core';
import { IconClock, IconVideo, IconUsers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { type Interview, InterviewType } from '../../../services/interview.service';
import type { JobOffer } from '../../../services/job-offer.service';

interface CalendarDayCellProps {
  date: Date | null;
  interviews: Interview[];
  jobOffers?: JobOffer[];
  isToday: boolean;
  isDarkMode: boolean;
  onInterviewClick: (interview: Interview) => void;
  onJobOfferClick?: (jobOffer: JobOffer) => void;
}

export function CalendarDayCell({
  date,
  interviews,
  jobOffers = [],
  isToday,
  onInterviewClick,
  onJobOfferClick
}: CalendarDayCellProps) {
  const { t } = useTranslation(['applications']);

  // Return empty cell for null dates (empty slots in calendar)
  if (!date) {
    return (
      <Paper
        withBorder
        h="100%"
        p="xs"
        radius="md"
        bg="light-dark(#f8fafc, rgba(15, 23, 42, 0.25))"
        style={{
          borderColor: 'light-dark(#f1f5f9, rgba(51, 65, 85, 0.4))',
          opacity: 0.5,
          minHeight: 120,
        }}
      />
    );
  }

  const hasEvents = interviews.length > 0 || jobOffers.length > 0;

  return (
    <Paper
      withBorder
      h="100%"
      p="xs"
      radius="md"
      bg={isToday ? 'light-dark(#eff6ff, rgba(37, 99, 235, 0.08))' : 'light-dark(#ffffff, rgba(15, 23, 42, 0.6))'}
      style={{
        borderColor: isToday ? '#2563eb' : 'light-dark(#e2e8f0, #334155)',
        boxShadow: isToday ? '0 0 0 1px #2563eb' : undefined,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 120,
      }}
    >
      <Group justify="space-between" align="center" mb={6}>
        {isToday ? (
          <Box
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              display: 'grid',
              placeItems: 'center',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            {date.getDate()}
          </Box>
        ) : (
          <Text size="sm" fw={600} c="light-dark(#334155, #cbd5e1)">
            {date.getDate()}
          </Text>
        )}
        {hasEvents && (
          <Text size="xs" c="dimmed" fw={600}>
            {interviews.length + jobOffers.length}
          </Text>
        )}
      </Group>

      <Stack gap={4} style={{ flex: 1 }}>
        {jobOffers.map(offer => (
          <Box
            key={offer.id}
            p="4px 6px"
            bg="light-dark(#fef2f2, rgba(239, 68, 68, 0.15))"
            style={{
              borderRadius: 6,
              cursor: 'pointer',
              border: '1px solid light-dark(#fecaca, rgba(239, 68, 68, 0.3))',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onClick={() => onJobOfferClick?.(offer)}
          >
            <Group gap={4} wrap="nowrap">
              <IconClock size={11} color="var(--mantine-color-red-6)" />
              <Text size="xs" truncate fw={700} c="light-dark(#b91c1c, #fca5a5)">
                {t('table.deadline', { ns: 'applications' })}
              </Text>
            </Group>
            <Text size="xs" truncate fw={500} c="light-dark(#991b1b, #fecaca)">
              {offer.position}
            </Text>
          </Box>
        ))}

        {interviews.map(interview => (
          <Box
            key={interview.id}
            p="4px 6px"
            bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
            style={{
              borderRadius: 6,
              cursor: 'pointer',
              border: '1px solid light-dark(#bfdbfe, rgba(37, 99, 235, 0.3))',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onClick={() => onInterviewClick(interview)}
          >
            <Group gap={4} wrap="nowrap">
              <IconVideo size={11} color="#2563eb" />
              <Text size="xs" truncate fw={700} c="light-dark(#1d4ed8, #93c5fd)">
                {new Date(interview.scheduled_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </Text>
            </Group>
            {interview.title && (
              <Text size="xs" truncate fw={600} c="light-dark(#1d4ed8, #93c5fd)" style={{ opacity: 0.85 }}>
                {interview.title}
              </Text>
            )}
            {interview.type === InterviewType.GROUP ? (
              <Group gap={3} wrap="nowrap">
                <IconUsers size={10} color="#2563eb" style={{ flexShrink: 0 }} />
                <Text size="xs" truncate fw={500} c="light-dark(#1e40af, #bfdbfe)">
                  {interview.applications
                    .map(app => `${app.candidate.user.first_name} ${app.candidate.user.last_name}`)
                    .join(', ')}
                </Text>
              </Group>
            ) : (
              <Text size="xs" truncate fw={500} c="light-dark(#1e40af, #bfdbfe)">
                {interview.applications[0]?.candidate.user.first_name}{' '}
                {interview.applications[0]?.candidate.user.last_name}
              </Text>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
