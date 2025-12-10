import { useState } from 'react';
import { Container, Title, Paper, Grid, Button, Group, Text, ActionIcon, useMantineColorScheme, Box, Stack, Modal } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendarEvent } from '@tabler/icons-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInterviewsQuery, useUpdateInterviewMutation } from '../../hooks/api/useInterviews';
import { useCandidateApplicationQuery } from '../../hooks/api/useCandidateApplications';
import { notifications } from '@mantine/notifications';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';
import { InterviewDetailsModal } from '../../components/employee/interviews/InterviewDetailsModal';
import { CalendarDayCell } from '../../components/employee/interviews/CalendarDayCell';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function InterviewsPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(null);

  // Stable date for history query to avoid infinite loops
  const [now] = useState(new Date());

  const { data: application } = useCandidateApplicationQuery(applicationId);

  // Calculate start and end of the month for fetching
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: interviewsData } = useInterviewsQuery({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
    limit: 100, // Fetch enough for the month
  });

  const { data: historyData } = useInterviewsQuery({
    end_date: now.toISOString(),
    order: 'DESC',
    limit: 10,
  });

  const interviews = interviewsData?.data || [];
  const pastInterviews = historyData?.data || [];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const daysArray = [];
    // Add empty slots for previous month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(null);
    }
    // Add days of current month
    for (let i = 1; i <= days; i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const days = getDaysInMonth(currentDate);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

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

      <Title order={3} mb="md">Past Interviews</Title>
      <Paper withBorder p="md" radius="md">
        <Stack>
          {pastInterviews.map(interview => (
              <Group key={interview.id} justify="space-between" p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                <Group>
                  <Box>
                    <Text fw={500}>
                      {interview.applications[0]?.candidate.user.first_name} {interview.applications[0]?.candidate.user.last_name}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {interview.applications[0]?.job_offer.position}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm">
                      {new Date(interview.scheduled_time).toLocaleDateString()}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {new Date(interview.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </Text>
                  </Box>
                </Group>
                <Button 
                  variant="light" 
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (interview.id) {
                      navigate(`/manage/interviews/${interview.id}/review`);
                    } else {
                      console.error('Interview ID is missing');
                    }
                  }}
                >
                  Review
                </Button>
              </Group>
            ))}
            {pastInterviews.length === 0 && (
              <Text c="dimmed" ta="center">No past interviews found.</Text>
            )}
        </Stack>
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
      />
      <InterviewDetailsModal 
        interview={selectedInterview} 
        onClose={() => setSelectedInterview(null)} 
        onReschedule={handleReschedule}
        onCancel={handleCancel}
      />

      <Modal 
        opened={!!interviewToCancel} 
        onClose={() => setInterviewToCancel(null)} 
        title="Cancel Interview"
        centered
        zIndex={1000}
      >
        <Text size="sm" mb="lg">
          Are you sure you want to cancel this interview? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setInterviewToCancel(null)}>No, keep it</Button>
          <Button color="red" onClick={confirmCancel} loading={updateMutation.isPending}>Yes, cancel interview</Button>
        </Group>
      </Modal>
    </Container>
  );
}
