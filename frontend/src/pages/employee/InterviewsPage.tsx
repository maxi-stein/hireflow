import { useState } from 'react';
import { Container, Title, Paper, Grid, Button, Group, Text, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPlus, IconCalendarEvent } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import { useInterviewsQuery } from '../../hooks/api/useInterviews';
import { useCandidateApplicationQuery } from '../../hooks/api/useCandidateApplications';
import type { Interview } from '../../services/interview.service';
import { ScheduleInterviewModal } from '../../components/employee/interviews/ScheduleInterviewModal';
import { InterviewDetailsModal } from '../../components/employee/interviews/InterviewDetailsModal';
import { CalendarDayCell } from '../../components/employee/interviews/CalendarDayCell';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function InterviewsPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: application } = useCandidateApplicationQuery(applicationId);

  // Calculate start and end of the month for fetching
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: interviewsData } = useInterviewsQuery({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
    limit: 100, // Fetch enough for the month
  });

  const interviews = interviewsData?.data || [];

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

      <Paper withBorder p="md" radius="md">
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
        onClose={() => setIsScheduleModalOpen(false)} 
        initialApplicationId={applicationId || undefined}
      />
      <InterviewDetailsModal interview={selectedInterview} onClose={() => setSelectedInterview(null)} />
    </Container>
  );
}
