import { Paper, Text, Stack, Box, Group } from '@mantine/core';
import type { Interview } from '../../../services/interview.service';
import type { JobOffer } from '../../../services/job-offer.service';
import { CalendarInterviewPill } from './CalendarInterviewPill';
import { CalendarDeadlinePill } from './CalendarDeadlinePill';

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
  onJobOfferClick,
}: CalendarDayCellProps) {
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
        {jobOffers.map((offer) => (
          <CalendarDeadlinePill key={offer.id} jobOffer={offer} onClick={onJobOfferClick} />
        ))}

        {interviews.map((interview) => (
          <CalendarInterviewPill key={interview.id} interview={interview} onClick={onInterviewClick} />
        ))}
      </Stack>
    </Paper>
  );
}
