import { useState, useMemo, useEffect } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useMyPendingReviewsQuery, useAllCompletedReviewsQuery } from './api/useInterviewReviews';
import { useAppStore } from '../store/useAppStore';
import type { InterviewReview } from '../services/interview-review.service';
import type { Interview } from '../services/interview.service';
import type { PaginationMeta } from '../types/common';

export interface UseReviewsReturn {
  // Data
  pendingReviews: Interview[];
  completedReviews: InterviewReview[];
  filteredPendingReviews: Interview[];
  myCompletedReviews: InterviewReview[];
  otherCompletedReviews: InterviewReview[];

  // Pagination & Loading for Completed Reviews
  completedPagination?: PaginationMeta;
  completedPage: number;
  setCompletedPage: (page: number) => void;
  isLoadingCompleted: boolean;

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
 * Manages queries, backend filtering, sorting, pagination, selection, and ownership checks.
 */
export function useReviews(): UseReviewsReturn {
  const user = useAppStore(state => state.user);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebouncedValue(searchQuery, 400);

  const [completedPage, setCompletedPage] = useState(1);

  // Reset pagination when search query changes
  useEffect(() => {
    setCompletedPage(1);
  }, [debouncedSearch]);

  const { data: pendingReviewsData } = useMyPendingReviewsQuery();
  const { data: completedReviewsData, isLoading: isLoadingCompleted } = useAllCompletedReviewsQuery({
    page: completedPage,
    limit: 10,
    search: debouncedSearch.trim() || undefined,
  });

  const pendingReviews = pendingReviewsData?.data || [];
  const completedReviews = completedReviewsData?.data || [];
  const completedPagination = completedReviewsData?.pagination;

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

  // Filter & sort pending reviews (chronological) - checks candidate name or job position
  const filteredPendingReviews = useMemo(() => {
    return pendingReviews
      .filter(interview => {
        const candidate = interview.applications?.[0]?.candidate?.user;
        const jobPosition = interview.applications?.[0]?.job_offer?.position || '';
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        const term = debouncedSearch.toLowerCase().trim();
        if (!term) return true;
        return fullName.includes(term) || jobPosition.toLowerCase().includes(term);
      })
      .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime());
  }, [pendingReviews, debouncedSearch]);

  const myCompletedReviews = useMemo(() => {
    return completedReviews.filter(isMyReview);
  }, [completedReviews, user?.id]);

  const otherCompletedReviews = useMemo(() => {
    return completedReviews.filter(r => !isMyReview(r));
  }, [completedReviews, user?.id]);

  return {
    pendingReviews,
    completedReviews,
    filteredPendingReviews,
    myCompletedReviews,
    otherCompletedReviews,
    completedPagination,
    completedPage,
    setCompletedPage,
    isLoadingCompleted,
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
