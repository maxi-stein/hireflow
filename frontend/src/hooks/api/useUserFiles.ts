import { useQuery } from '@tanstack/react-query';
import { userFileService } from '../../services/user-file.service';

export const FILES_QUERY_KEY = ['user-files'];

export function useCandidateFilesQuery(candidateId: string) {
  return useQuery({
    queryKey: [...FILES_QUERY_KEY, 'candidate', candidateId],
    queryFn: () => userFileService.getAllByCandidate(candidateId),
    enabled: !!candidateId,
  });
}
