import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { interviewService } from '../../services/interview.service';
import type { InterviewFilters, CreateInterviewDto } from '../../services/interview.service';

export const INTERVIEWS_QUERY_KEY = ['interviews'];

export function useCandidateInterviewsQuery(candidateId: string) {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, 'candidate', candidateId],
    queryFn: () => interviewService.getByCandidate(candidateId),
    enabled: !!candidateId,
  });
}

export function useInterviewsQuery(filters?: InterviewFilters) {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, 'list', filters],
    queryFn: () => interviewService.getAll(filters),
  });
}

export function useInterviewQuery(id: string) {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, 'detail', id],
    queryFn: () => interviewService.getById(id),
    enabled: !!id,
  });
}

export function useCreateInterviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInterviewDto) => interviewService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
    },
  });
}

export function useUpdateInterviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateInterviewDto> }) => 
      interviewService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
    },
  });
}
