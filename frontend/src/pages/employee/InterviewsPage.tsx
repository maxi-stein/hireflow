import { useState } from 'react';
import { Container, Title, Paper, Grid, Button, Group, Text, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendarEvent } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { useInterviewsQuery, useUpdateInterviewMutation } from '../../hooks/api/useInterviews';
import { useCandidateApplicationQuery } from '../../hooks/api/useCandidateApplications';
import { notifications } from '@mantine/notifications';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';
import { InterviewDetailsModal } from '../../components/employee/interviews/InterviewDetailsModal';
import { CalendarDayCell } from '../../components/employee/interviews/CalendarDayCell';
import { CancelInterviewModal } from '../../components/employee/interviews/CancelInterviewModal';
import { getDaysInMonth } from '../../utils/date-utils';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function InterviewsPage() {
  // Get color scheme
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Get application id from url
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  // Used to display interview details modal
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

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

  // If application id is provided, fetch application (used to schedule an interview)
  const { data: application } = useCandidateApplicationQuery(applicationId);

  const { data: interviewsData } = useInterviewsQuery({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
    limit: 100, // Fetch enough for the month
  });

  const interviews = interviewsData?.data || [];

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
      notifications.show({ title: 'Success', message: 'Interview cancelled', color: 'green' });
      setInterviewToCancel(null);
      setSelectedInterview(null);
    } catch (error) {
      console.error(error);
      notifications.show({ title: 'Error', message: 'Failed to cancel interview', color: 'red' });
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Interview Calendar</Title>
        {application ? (
          <Button
            leftSection={<IconCalendarEvent size={16} />}
            onClick={() => setIsScheduleModalOpen(true)}
            color="blue"
          >
            Schedule meeting with {application.candidate.user.first_name} {application.candidate.user.last_name}
          </Button>
        ) : (
          <Button leftSection={<IconPlus size={16} />} onClick={() => setIsScheduleModalOpen(true)}>
            Schedule Interview
          </Button>
        )}
      </Group>

      <Paper withBorder p="md" radius="md" mb="xl">
        {/* Calendar Header */}
        <Group justify="space-between" mb="md">
          <Group>
            <ActionIcon variant="subtle" onClick={handlePrevMonth}>
              <IconChevronLeft size={20} />
            </ActionIcon>
            <Title order={4}>
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Title>
            <ActionIcon variant="subtle" onClick={handleNextMonth}>
              <IconChevronRight size={20} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Calendar Grid */}
        <Grid columns={7} gutter="xs">
          {DAYS.map(day => (
            <Grid.Col span={1} key={day}>
              <Text ta="center" fw={500} c="dimmed">{day}</Text>
            </Grid.Col>
          ))}

          {days.map((date, index) => {
            const isToday = date?.toDateString() === new Date().toDateString();
            const dayInterviews = date ? getInterviewsForDay(date) : [];

            return (
              <Grid.Col span={1} key={index} style={{ minHeight: 120 }}>
                <CalendarDayCell
                  date={date}
                  interviews={dayInterviews}
                  isToday={isToday}
                  isDarkMode={isDark}
                  onInterviewClick={setSelectedInterview}
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
        }}
        initialApplicationId={applicationId || undefined}
        interviewToEdit={interviewToEdit}
        onSuccess={() => {
          if (applicationId) {
            setSearchParams({});
          }
        }}
      />
      <InterviewDetailsModal
        interview={selectedInterview}
        onClose={() => setSelectedInterview(null)}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />

      <CancelInterviewModal
        opened={!!interviewToCancel}
        onClose={() => setInterviewToCancel(null)}
        onConfirm={confirmCancel}
        isLoading={updateMutation.isPending}
      />
    </Container>
  );
}
