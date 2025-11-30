import { useQuery } from '@tanstack/react-query';
import { interviewService } from '../../services/interview.service';

export const INTERVIEWS_QUERY_KEY = ['interviews'];

export function useCandidateInterviewsQuery(candidateId: string) {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, 'candidate', candidateId],
    queryFn: () => interviewService.getByCandidate(candidateId),
    enabled: !!candidateId,
  });
}
