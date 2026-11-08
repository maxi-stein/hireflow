import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { useInterviewsQuery, useUpdateInterviewMutation } from '../api/useInterviews';
import { useJobOffersQuery } from '../api/useJobOffers';
import type { Interview } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import type { JobOffer } from '../../services/job-offer.service';
import { getDaysInMonth } from '../../utils/date-utils';

export function useCalendarPageState() {
  const { t } = useTranslation(['calendar']);
  const [searchParams, setSearchParams] = useSearchParams();
  const applicationId = searchParams.get('applicationId') || undefined;
  const dateParam = searchParams.get('date');
  const interviewIdParam = searchParams.get('interviewId');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedJobOffer, setSelectedJobOffer] = useState<JobOffer | null>(null);
  const [interviewToEdit, setInterviewToEdit] = useState<Interview | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [interviewToCancel, setInterviewToCancel] = useState<Interview | null>(null);

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

  // Calculate start and end of the month for fetching
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const { data: interviewsData } = useInterviewsQuery({
    start_date: startOfMonth.toISOString(),
    end_date: endOfMonth.toISOString(),
    limit: 100,
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

  const handleResetToToday = () => {
    setCurrentDate(new Date());
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

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setInterviewToEdit(null);
    if (applicationId) {
      setSearchParams(params => {
        params.delete('applicationId');
        return params;
      });
    }
  };

  const handleScheduleSuccess = () => {
    if (applicationId) {
      setSearchParams(params => {
        params.delete('applicationId');
        return params;
      });
    }
  };

  return {
    applicationId,
    currentDate,
    setCurrentDate,
    days,
    interviews,
    jobOffers,
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
    isCancelling: updateMutation.isPending,
  };
}

