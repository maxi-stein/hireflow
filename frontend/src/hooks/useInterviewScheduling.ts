import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../router/routes.config';
import { InterviewStatus, interviewService } from '../services/interview.service';
import type { Interview } from '../services/interview.service';
import type { CandidateApplication } from '../services/candidate-application.service';

interface UseInterviewSchedulingReturn {
  handleScheduleClick: (applicationId: string, candidateId: string) => Promise<void>;
  modalOpened: boolean;
  closeModal: () => void;
  confirmSchedule: () => void;
}

export function useInterviewScheduling(): UseInterviewSchedulingReturn {
  const navigate = useNavigate();
  const [modalOpened, setModalOpened] = useState(false);
  const [pendingSchedule, setPendingSchedule] = useState<{ applicationId: string; } | null>(null);

  const handleScheduleClick = async (applicationId: string, candidateId: string) => {
    try {
      // Check for future scheduled interviews
      const {data: interviews} = await interviewService.getByCandidate(candidateId);
      
      const hasFutureInterview = interviews.some((interview: Interview) => 
        interview.status === InterviewStatus.SCHEDULED && 
        new Date(interview.scheduled_time) > new Date() && 
        interview.applications?.some((app: CandidateApplication) => app.id === applicationId)
      );

      if (hasFutureInterview) {
        setPendingSchedule({ applicationId });
        setModalOpened(true);
      } else {
        navigate(`${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${applicationId}`);
      }
    } catch (error) {
      console.error('Failed to check existing interviews', error);
      // Fallback: proceed to schedule if check fails
      navigate(`${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${applicationId}`);
    }
  };

  const confirmSchedule = () => {
    if (pendingSchedule) {
      setModalOpened(false);
      navigate(`${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${pendingSchedule.applicationId}`);
      setPendingSchedule(null);
    }
  };

  const closeModal = () => {
    setModalOpened(false);
    setPendingSchedule(null);
  };

  return {
    handleScheduleClick,
    modalOpened,
    closeModal,
    confirmSchedule
  };
}
