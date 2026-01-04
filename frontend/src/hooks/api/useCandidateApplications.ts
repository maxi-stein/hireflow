import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  candidateApplicationService,
  type ApplicationFilters,
  type ApplicationStatus
} from '../../services/candidate-application.service';

export const APPLICATIONS_QUERY_KEY = ['candidateApplications'];

export function useAllCandidateApplicationsQuery(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: [...APPLICATIONS_QUERY_KEY, filters],
    queryFn: () => candidateApplicationService.getAll(filters),
  });
}

export function useCandidateApplicationQuery(id: string | null) {
  return useQuery({
    queryKey: [...APPLICATIONS_QUERY_KEY, 'detail', id],
    queryFn: () => candidateApplicationService.getById(id!),
    enabled: !!id,
  });
}

export function useUpdateApplicationStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationStatus }) =>
      candidateApplicationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
    },
  });
}

export function useHireApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => candidateApplicationService.hire(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
    },
  });
}
