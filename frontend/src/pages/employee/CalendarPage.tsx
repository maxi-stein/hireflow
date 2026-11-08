import { useTranslation } from 'react-i18next';
import { Container, Title, Paper, Button, Group, Text, Box, useMantineColorScheme } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useCalendarPageState } from '../../hooks/domain/useCalendarPageState';
import { CalendarHeaderControls } from '../../components/employee/interviews/CalendarHeaderControls';
import { CalendarMonthGrid } from '../../components/employee/interviews/CalendarMonthGrid';
import { CalendarModalsContainer } from '../../components/employee/interviews/CalendarModalsContainer';

export function CalendarPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation(['calendar', 'profile']);

  const {
    applicationId,
    currentDate,
    days,
    selectedInterview,
    setSelectedInterview,
    selectedJobOffer,
    setSelectedJobOffer,
    interviewToEdit,
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    interviewToCancel,
    setInterviewToCancel,
    handlePrevMonth,
    handleNextMonth,
    handleResetToToday,
    getInterviewsForDay,
    getJobOffersForDay,
    handleReschedule,
    handleCancel,
    confirmCancel,
    handleCloseScheduleModal,
    handleScheduleSuccess,
    isCancelling,
  } = useCalendarPageState();

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
        <CalendarHeaderControls
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleResetToToday}
        />

        <CalendarMonthGrid
          days={days}
          getInterviewsForDay={getInterviewsForDay}
          getJobOffersForDay={getJobOffersForDay}
          isDark={isDark}
          onInterviewClick={setSelectedInterview}
          onJobOfferClick={setSelectedJobOffer}
        />
      </Paper>

      {/* Modals Container */}
      <CalendarModalsContainer
        isScheduleModalOpen={isScheduleModalOpen}
        onCloseScheduleModal={handleCloseScheduleModal}
        onScheduleSuccess={handleScheduleSuccess}
        applicationId={applicationId}
        interviewToEdit={interviewToEdit}
        selectedInterview={selectedInterview}
        onCloseInterviewDetails={() => setSelectedInterview(null)}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
        selectedJobOffer={selectedJobOffer}
        onCloseJobOffer={() => setSelectedJobOffer(null)}
        interviewToCancel={interviewToCancel}
        onCloseCancelModal={() => setInterviewToCancel(null)}
        onConfirmCancel={confirmCancel}
        isCancelling={isCancelling}
      />
    </Container>
  );
}
