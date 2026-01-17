import { useState } from 'react';
import {
  useUpdateApplicationStatusMutation,
  useHireApplicationMutation,
} from './api/useCandidateApplications';
import { ApplicationStatus } from '../services/candidate-application.service';

export interface CandidateActionTarget {
  id: string;
  name: string;
}

export interface UseCandidateActionsOptions {
  onRejectSuccess?: (applicationId: string) => void;
  onHireSuccess?: (applicationId: string) => void;
}

export interface UseCandidateActionsReturn {
  // Reject state
  candidateToReject: CandidateActionTarget | null;
  handleRejectClick: (applicationId: string, candidateName: string) => void;
  handleConfirmReject: () => Promise<void>;
  handleCancelReject: () => void;
  isRejecting: boolean;

  // Hire state
  candidateToHire: CandidateActionTarget | null;
  handleHireClick: (applicationId: string, candidateName: string) => void;
  handleConfirmHire: () => Promise<void>;
  handleCancelHire: () => void;
  isHiring: boolean;
}

/**
 * Custom hook to manage candidate rejection and hiring actions
 * Encapsulates modal state and mutation logic for reusability across pages
 */
export function useCandidateActions(
  options: UseCandidateActionsOptions = {},
): UseCandidateActionsReturn {
  const { onRejectSuccess, onHireSuccess } = options;

  const [candidateToReject, setCandidateToReject] = useState<CandidateActionTarget | null>(null);
  const [candidateToHire, setCandidateToHire] = useState<CandidateActionTarget | null>(null);

  const updateStatusMutation = useUpdateApplicationStatusMutation();
  const hireMutation = useHireApplicationMutation();

  const handleRejectClick = (applicationId: string, candidateName: string) => {
    setCandidateToReject({ id: applicationId, name: candidateName });
  };

  const handleConfirmReject = async () => {
    if (!candidateToReject) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: candidateToReject.id,
        status: ApplicationStatus.REJECTED,
      });

      onRejectSuccess?.(candidateToReject.id);
      setCandidateToReject(null);
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      throw error;
    }
  };

  const handleCancelReject = () => {
    setCandidateToReject(null);
  };

  const handleHireClick = (applicationId: string, candidateName: string) => {
    setCandidateToHire({ id: applicationId, name: candidateName });
  };

  const handleConfirmHire = async () => {
    if (!candidateToHire) return;

    try {
      await hireMutation.mutateAsync(candidateToHire.id);

      onHireSuccess?.(candidateToHire.id);
      setCandidateToHire(null);
    } catch (error) {
      console.error('Error hiring candidate:', error);
      throw error;
    }
  };

  const handleCancelHire = () => {
    setCandidateToHire(null);
  };

  return {
    candidateToReject,
    handleRejectClick,
    handleConfirmReject,
    handleCancelReject,
    isRejecting: updateStatusMutation.isPending,

    candidateToHire,
    handleHireClick,
    handleConfirmHire,
    handleCancelHire,
    isHiring: hireMutation.isPending,
  };
}
