import { Paper, Text, Stack, Box } from '@mantine/core';
import type { Interview } from '../../../services/interview.service';
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
  isDarkMode,
  onInterviewClick,
  onJobOfferClick
}: CalendarDayCellProps) {
  // Return empty cell for null dates (empty slots in calendar)
  if (!date) {
    return <Paper withBorder h="100%" p="xs" />;
  }

  return (
    <Paper
      withBorder
      h="100%"
      p="xs"
      bg={isToday ? 'blue.8' : undefined}
      style={{
        backgroundColor: isToday ? 'var(--mantine-color-blue-light)' : undefined,
        overflow: 'hidden'
      }}
    >
      <Text size="sm" fw={500} mb="xs">{date.getDate()}</Text>
      <Stack gap={4}>
        {jobOffers.map(offer => (
          <Box
            key={offer.id}
            p={4}
            style={{
              backgroundColor: 'var(--mantine-color-red-light)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.75rem',
              border: '1px solid var(--mantine-color-red-outline)'
            }}
            onClick={() => onJobOfferClick?.(offer)}
          >
            <Text size="xs" truncate fw={700} c={isDarkMode ? 'white' : 'red.9'}>
              DEADLINE
            </Text>
            <Text size="xs" truncate c={isDarkMode ? 'white' : 'red.9'} fw={500}>
              {offer.position}
            </Text>
          </Box>
        ))}

        {interviews.map(interview => (
          <Box
            key={interview.id}
            p={4}
            style={{
              backgroundColor: 'var(--mantine-color-blue-light)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.75rem',
              border: '1px solid var(--mantine-color-blue-outline)'
            }}
            onClick={() => onInterviewClick(interview)}
          >
            <Text size="xs" truncate fw={500} c={isDarkMode ? 'white' : 'blue.9'}>
              {new Date(interview.scheduled_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </Text>
            <Text size="xs" truncate c={isDarkMode ? 'white' : 'blue.9'}>
              {interview.applications[0]?.candidate.user.first_name}{' '}
              {interview.applications[0]?.candidate.user.last_name}
            </Text>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
