import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewReviewService } from '../../services/interview-review.service';
import type { CreateInterviewReviewDto, UpdateInterviewReviewDto } from '../../services/interview-review.service';

export const REVIEWS_QUERY_KEY = ['interview-reviews'];

export function useInterviewReviewsQuery(interviewId: string) {
  return useQuery({
    queryKey: [...REVIEWS_QUERY_KEY, 'interview', interviewId],
    queryFn: () => interviewReviewService.findByInterview(interviewId),
    enabled: !!interviewId,
  });
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInterviewReviewDto) => interviewReviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInterviewReviewDto }) => 
      interviewReviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEY });
    },
  });
}
