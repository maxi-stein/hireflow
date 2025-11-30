import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  candidateApplicationService, 
  type ApplicationFilters, 
  type ApplicationStatus 
} from '../../services/candidate-application.service';

export const APPLICATIONS_QUERY_KEY = ['candidateApplications'];

export function useCandidateApplicationsQuery(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: [...APPLICATIONS_QUERY_KEY, filters],
    queryFn: () => candidateApplicationService.getAll(filters),
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
