import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../router/routes.config";
import {
  InterviewStatus,
  interviewService,
} from "../services/interview.service";
import type { Interview } from "../services/interview.service";
import type { CandidateApplication } from "../services/candidate-application.service";

interface UseInterviewSchedulingReturn {
  handleScheduleClick: (
    applicationId: string,
    candidateId: string
  ) => Promise<void>;
  modalOpened: boolean;
  closeModal: () => void;
  confirmSchedule: () => void;
}

// Custom hook for interview scheduling
export function useInterviewScheduling(): UseInterviewSchedulingReturn {
  const navigate = useNavigate();

  // State for modal that warns about future scheduled interviews
  const [modalOpened, setModalOpened] = useState(false);

  // This is the application id that is going to be scheduled (used for display purposes in the modal)
  const [pendingApplicationId, setPendingApplicationId] = useState<
    string | null
  >(null);

  const handleScheduleClick = async (
    applicationId: string,
    candidateId: string
  ) => {
    try {
      // Check for future scheduled interviews
      const { data: interviews } = await interviewService.getByCandidate(
        candidateId
      );

      const hasFutureInterview = interviews.some(
        (interview: Interview) =>
          interview.status === InterviewStatus.SCHEDULED &&
          new Date(interview.scheduled_time) > new Date() &&
          interview.applications?.some(
            (app: CandidateApplication) => app.id === applicationId
          )
      );

      // If the user is trying to schedule an interview for an application that has a future interview, open the modal
      // And warn the user about it
      if (hasFutureInterview) {
        setPendingApplicationId(applicationId);
        setModalOpened(true);
      } else {
        navigate(
          `${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${applicationId}`
        );
      }
    } catch (error) {
      console.error("Failed to check existing interviews", error);
      navigate(
        `${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${applicationId}`
      );
    }
  };

  const confirmSchedule = () => {
    if (pendingApplicationId) {
      setModalOpened(false);
      navigate(
        `${ROUTES.EMPLOYEE.INTERVIEWS_GROUP.children[0].path}?applicationId=${pendingApplicationId}`
      );
      setPendingApplicationId(null);
    }
  };

  const closeModal = () => {
    setModalOpened(false);
    setPendingApplicationId(null);
  };

  return {
    handleScheduleClick,
    modalOpened,
    closeModal,
    confirmSchedule,
  };
}
