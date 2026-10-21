import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Container, Title, Paper, Grid, Button, Group, Text, ActionIcon, Box, Badge, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendarEvent } from '@tabler/icons-react';
import { useInterviewsQuery, useUpdateInterviewMutation } from '../../hooks/api/useInterviews';
import { useJobOffersQuery } from '../../hooks/api/useJobOffers';
import { notifications } from '@mantine/notifications';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';
import { InterviewDetailsModal } from '../../components/employee/interviews/InterviewDetailsModal';
import { CalendarDayCell } from '../../components/employee/interviews/CalendarDayCell';
import { CancelInterviewModal } from '../../components/employee/interviews/CancelInterviewModal';
import { getDaysInMonth } from '../../utils/date-utils';
import { ViewJobOfferModal } from '../../components/employee/job-postings/ViewJobOfferModal';
import type { JobOffer } from '../../services/job-offer.service';
import { APP_MAX_WIDTH } from '../../constants/layout';




export function CalendarPage() {
  // Get color scheme
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t, i18n } = useTranslation(['calendar', 'profile']);
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId') || undefined;
  const dateParam = searchParams.get('date');
  const interviewIdParam = searchParams.get('interviewId');

  // Open scheduling modal if applicationId is present in URL
  useEffect(() => {
    if (applicationId) {
      setIsScheduleModalOpen(true);
    }
  }, [applicationId]);

  // Navigate calendar to the date specified in the URL
  useEffect(() => {
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) setCurrentDate(parsed);
    }
  }, [dateParam]);

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // Used to display job offer details modal
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(null);

  // Used to edit interview
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);

  // Used to schedule interview
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Used to cancel interview
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(null);

  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate start and end of the month for fetching
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);


  const { data: interviewsData } = useInterviewsQuery({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
    limit: 100, // Fetch enough for the month
  });

  const { data: jobOffersData } = useJobOffersQuery({
    deadline_from: startOfMonth.toISOString(),
    deadline_to: endOfMonth.toISOString(),
    limit: 100,
  });

  const interviews = interviewsData?.data || [];
  const jobOffers = jobOffersData?.data || [];

  // Auto-open interview details modal when navigating from a deep link
  useEffect(() => {
    if (interviewIdParam && interviews.length > 0) {
      const match = interviews.find(i => i.id === interviewIdParam);
      if (match) setSelectedInterview(match);
    }
  }, [interviewIdParam, interviews]);

  const days = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Get interviews for a specific day
  const getInterviewsForDay = (date: Date) => {
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.scheduled_time);
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get job offers deadline for a specific day
  const getJobOffersForDay = (date: Date) => {
    return jobOffers.filter(offer => {
      if (!offer.deadline) return false;
      const deadlineDate = new Date(offer.deadline);
      return (
        deadlineDate.getDate() === date.getDate() &&
        deadlineDate.getMonth() === date.getMonth() &&
        deadlineDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const updateMutation = useUpdateInterviewMutation();

  const handleReschedule = (interview: Interview) => {
    setSelectedInterview(null);
    setInterviewToEdit(interview);
    setIsScheduleModalOpen(true);
  };

  const handleCancel = (interview: Interview) => {
    setInterviewToCancel(interview);
  };

  // Cancel interview
  const confirmCancel = async () => {
    if (!interviewToCancel) return;
    try {
      await updateMutation.mutateAsync({
        id: interviewToCancel.id,
        data: { status: InterviewStatus.CANCELLED }
      });
      notifications.show({ title: 'Success', message: t('notifications.cancelSuccess'), color: 'green' });
      setInterviewToCancel(null);
      setSelectedInterview(null);
    } catch (error) {
      console.error(error);
      notifications.show({ title: 'Error', message: t('notifications.cancelError'), color: 'red' });
    }
  };

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      {/* Page Header */}
      <Group justify="space-between" align="flex-start" mb="xl" wrap="wrap" gap="md">
        <Box>
          <Title order={2} c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
            {t('title')}
          </Title>
          <Text size="sm" c="dimmed" mt={2}>
            {t('subtitle', 'Gestión y seguimiento de entrevistas y fechas límite de postulaciones')}
          </Text>
        </Box>

        <Button
          color="blue"
          leftSection={<IconPlus size={16} />}
          radius="md"
          style={{ fontWeight: 600 }}
          onClick={() => setIsScheduleModalOpen(true)}
        >
          {t('candidate.actions.schedule', { ns: 'profile', defaultValue: 'Agendar Entrevista' })}
        </Button>
      </Group>

      {/* Main Calendar Card */}
      <Paper
        withBorder
        p="xl"
        radius="lg"
        mb="xl"
        bg="light-dark(#ffffff, #1e293b)"
        style={{
          borderColor: 'light-dark(#e2e8f0, #334155)',
          boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        }}
      >
        {/* Navigation Toolbar */}
        <Group justify="space-between" align="center" mb="xl" wrap="wrap" gap="md">
          <Group gap="sm" align="center">
            <Paper
              withBorder
              radius="xl"
              p={4}
              bg="light-dark(#f8fafc, #0f172a)"
              style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
            >
              <Group gap={6} align="center">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="md"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                >
                  <IconChevronLeft size={18} />
                </ActionIcon>
                <Text fw={700} size="md" px="xs" tt="capitalize" c="light-dark(#0f172a, #f8fafc)">
                  {currentDate.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  radius="xl"
                  size="md"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                >
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Group>
            </Paper>

            <Button
              variant="light"
              size="xs"
              color="blue"
              radius="xl"
              onClick={() => setCurrentDate(new Date())}
            >
              {t('today', 'Hoy')}
            </Button>
          </Group>

          {/* Color coding legend */}
          <Group gap="sm">
            <Badge variant="dot" color="blue" size="md">
              {t('legend.interviews', 'Entrevistas')}
            </Badge>
            <Badge variant="dot" color="red" size="md">
              {t('legend.deadlines', 'Fechas límite')}
            </Badge>
          </Group>
        </Group>

        {/* Weekday Column Headers */}
        <Grid columns={7} gutter="xs" mb="xs" pb="xs" style={{ borderBottom: '1px solid light-dark(#f1f5f9, #334155)' }}>
          {(t('weekdays', { returnObjects: true }) as string[]).map(day => (
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
                  onInterviewClick={setSelectedInterview}
                  onJobOfferClick={setSelectedJobOffer}
                />
              </Grid.Col>
            );
          })}
        </Grid>
      </Paper>

      {/* Modals */}
      <ScheduleInterviewModal
        opened={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setInterviewToEdit(null);
          if (applicationId) {
            setSearchParams(params => {
              params.delete('applicationId');
              return params;
            });
          }
        }}
        onSuccess={() => {
          if (applicationId) {
            setSearchParams(params => {
              params.delete('applicationId');
              return params;
            });
          }
        }}
        initialApplicationId={applicationId}
        interviewToEdit={interviewToEdit}
      />
      <InterviewDetailsModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />

      {selectedJobOffer && (
        <ViewJobOfferModal
          opened={!!selectedJobOffer}
          onClose={() => setSelectedJobOffer(null)}
          jobOfferId={selectedJobOffer.id}
        />
      )}

      <CancelInterviewModal
        opened={!!interviewToCancel}
        onClose={() => setInterviewToCancel(null)}
        onConfirm={confirmCancel}
        isLoading={updateMutation.isPending}
      />
    </Container>
  );
}
