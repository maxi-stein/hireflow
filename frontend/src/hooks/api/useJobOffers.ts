import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  jobOfferService, 
  type JobOfferFilters, 
  type CreateJobOfferDto, 
} from '../../services/job-offer.service';

export const JOB_OFFERS_QUERY_KEY = ['jobOffers'];

export function useJobOffersQuery(filters?: JobOfferFilters) {
  return useQuery({
    queryKey: [...JOB_OFFERS_QUERY_KEY, filters],
    queryFn: () => jobOfferService.getAll(filters),
  });
}

export function useJobOfferQuery(id: string) {
  return useQuery({
    queryKey: [...JOB_OFFERS_QUERY_KEY, id],
    queryFn: () => jobOfferService.getById(id),
    enabled: !!id,
  });
}

export function useCreateJobOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobOfferDto) => jobOfferService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOB_OFFERS_QUERY_KEY });
    },
  });
}
