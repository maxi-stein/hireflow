import { useState, useMemo } from 'react';
import { useMyPendingReviewsQuery, useMyCompletedReviewsQuery } from './api/useInterviewReviews';
import { useAppStore } from '../store/useAppStore';
import type { InterviewReview } from '../services/interview-review.service';
import type { Interview } from '../services/interview.service';

export interface UseReviewsReturn {
  // Data
  pendingReviews: Interview[];
  completedReviews: InterviewReview[];
  filteredPendingReviews: Interview[];
  myCompletedReviews: InterviewReview[];
  otherCompletedReviews: InterviewReview[];

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Selection
  selectedInterviewId: string | null;
  selectedInterview: Interview | null;
  selectedReviewId: string | undefined;
  handleReviewClick: (interviewId: string, reviewId?: string, interview?: Interview) => void;
  handleCloseReview: () => void;

  // Ownership
  isMyReview: (review: InterviewReview) => boolean;
}

/**
 * Custom hook that encapsulates all state and logic for the Reviews page.
 * Manages queries, filtering, sorting, selection, and ownership checks.
 */
export function useReviews(): UseReviewsReturn {
  const user = useAppStore(state => state.user);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pendingReviewsData } = useMyPendingReviewsQuery();
  const { data: completedReviewsData } = useMyCompletedReviewsQuery();

  const pendingReviews = pendingReviewsData?.data || [];
  const completedReviews = completedReviewsData?.data || [];

  const handleReviewClick = (interviewId: string, reviewId?: string, interview?: Interview) => {
    setSelectedInterviewId(interviewId);
    setSelectedReviewId(reviewId);
    setSelectedInterview(interview ?? null);
  };

  const handleCloseReview = () => {
    setSelectedInterviewId(null);
    setSelectedReviewId(undefined);
    setSelectedInterview(null);
  };

  const isMyReview = (r: InterviewReview): boolean => {
    if (!user) return false;
    if (user.id && r.employee?.id === user.id) return true;
    return false;
  };

  // Filter & sort pending reviews (chronological)
  const filteredPendingReviews = useMemo(() => {
    return pendingReviews
      .filter(interview => {
        const candidate = interview.applications?.[0]?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
  }, [pendingReviews, searchQuery]);

  // Filter & sort completed reviews (newest first)
  const filteredCompletedReviews = useMemo(() => {
    return completedReviews
      .filter(review => {
        const candidate = review.candidate_application?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [completedReviews, searchQuery]);

  const myCompletedReviews = filteredCompletedReviews.filter(isMyReview);
  const otherCompletedReviews = filteredCompletedReviews.filter(r => !isMyReview(r));

  return {
    pendingReviews,
    completedReviews,
    filteredPendingReviews,
    myCompletedReviews,
    otherCompletedReviews,
    searchQuery,
    setSearchQuery,
    selectedInterviewId,
    selectedInterview,
    selectedReviewId,
    handleReviewClick,
    handleCloseReview,
    isMyReview,
  };
}
