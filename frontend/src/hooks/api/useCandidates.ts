import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { candidateService, type CandidateFilterParams } from '../../services/candidate.service';

export const CANDIDATES_QUERY_KEY = ['candidates'];

export function useCandidatesQuery(params?: CandidateFilterParams) {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, params],
    queryFn: () => candidateService.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCandidateQuery(id: string) {
  return useQuery({
    queryKey: [...CANDIDATES_QUERY_KEY, id],
    queryFn: () => candidateService.getById(id),
    enabled: !!id,
  });
}
