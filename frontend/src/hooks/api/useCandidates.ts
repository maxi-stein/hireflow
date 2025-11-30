import { useQuery } from '@tanstack/react-query';
import { candidateService } from '../../services/candidate.service';

export const CANDIDATES_QUERY_KEY = ['candidates'];

export function useCandidateQuery(id: string) {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, id],
    queryFn: () => candidateService.getById(id),
    enabled: !!id,
  });
}
