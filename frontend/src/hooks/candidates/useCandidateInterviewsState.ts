import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { Interview } from '../../services/interview.service';

export interface ReviewModalState {
  opened: boolean;
  interviewId: string | null;
  reviewId?: string;
  readOnly?: boolean;
}

export function useCandidateInterviewsState(interviews?: Interview[]) {
  const queryClient = useQueryClient();

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    if (!interviews || interviews.length === 0) return {};
    return { [interviews[0].id]: true };
  });

  const [modalState, setModalState] = useState<ReviewModalState>({
    opened: false,
    interviewId: null,
  });

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreateReview = (interviewId: string) => {
    setModalState({
      opened: true,
      interviewId,
      reviewId: undefined,
      readOnly: false,
    });
  };

  const openEditReview = (interviewId: string, reviewId: string) => {
    setModalState({
      opened: true,
      interviewId,
      reviewId,
      readOnly: false,
    });
  };

  const closeReview = () => {
    setModalState(prev => ({ ...prev, opened: false }));
  };

  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['interviews'] });
    queryClient.invalidateQueries({ queryKey: ['interview-reviews'] });
  };

  return {
    expandedIds,
    toggleExpanded,
    modalState,
    openCreateReview,
    openEditReview,
    closeReview,
    handleReviewSuccess,
  };
}

