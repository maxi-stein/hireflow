import { Grid, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { Interview } from '../../../services/interview.service';
import type { JobOffer } from '../../../services/job-offer.service';
import { CalendarDayCell } from './CalendarDayCell';

interface CalendarMonthGridProps {
  days: (Date | null)[];
  getInterviewsForDay: (date: Date) => Interview[];
  getJobOffersForDay: (date: Date) => JobOffer[];
  isDark: boolean;
  onInterviewClick: (interview: Interview) => void;
  onJobOfferClick: (jobOffer: JobOffer) => void;
}

export function CalendarMonthGrid({
  days,
  getInterviewsForDay,
  getJobOffersForDay,
  isDark,
  onInterviewClick,
  onJobOfferClick,
}: CalendarMonthGridProps) {
  const { t } = useTranslation(['calendar']);

  return (
    <>
      {/* Weekday Column Headers */}
      <Grid columns={7} gutter="xs" mb="xs" pb="xs" style={{ borderBottom: '1px solid light-dark(#f1f5f9, #334155)' }}>
        {(t('weekdays', { returnObjects: true }) as string[]).map((day) => (
          <Grid.Col span={1} key={day}>
            <Text ta="center" fw={700} size="xs" tt="uppercase" c="light-dark(#64748b, #94a3b8)">
              {day}
            </Text>
          </Grid.Col>
        ))}
      </Grid>

      {/* Days Grid */}
      <Grid columns={7} gutter="xs">
        {days.map((date, index) => {
          const isToday = date?.toDateString() === new Date().toDateString();
          const dayInterviews = date ? getInterviewsForDay(date) : [];
          const dayJobOffers = date ? getJobOffersForDay(date) : [];

          return (
            <Grid.Col span={1} key={index} style={{ minHeight: 120 }}>
              <CalendarDayCell
                date={date}
                interviews={dayInterviews}
                jobOffers={dayJobOffers}
                isToday={isToday}
                isDarkMode={isDark}
                onInterviewClick={onInterviewClick}
                onJobOfferClick={onJobOfferClick}
              />
            </Grid.Col>
          );
        })}
      </Grid>
    </>
  );
}

