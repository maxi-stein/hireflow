import { useQuery } from '@tanstack/react-query';
import { userFileService, FileType } from '../../services/user-file.service';

export const FILES_QUERY_KEY = ['user-files'];

export function useCandidateFilesQuery(candidateId: string) {
  return useQuery({
    queryKey: [...FILES_QUERY_KEY, 'candidate', candidateId],
    queryFn: () => userFileService.getAllByCandidate(candidateId),
    enabled: !!candidateId,
  });
}

/**
 * Downloads the profile picture for a candidate and returns a Base64 Data URL.
 * Uses React Query for caching, deduplication and StrictMode safety.
 */
export function useProfilePictureDataUrl(candidateId?: string) {
  const { data: files } = useCandidateFilesQuery(candidateId || '');

  const profilePictureFileId = files?.find(
    (f) => f.file_type === FileType.PROFILE_PICTURE,
  )?.id;

  return useQuery({
    queryKey: [...FILES_QUERY_KEY, 'profile-picture-blob', profilePictureFileId],
    queryFn: async () => {
      const blob = await userFileService.downloadFile(profilePictureFileId!);
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },
    enabled: !!profilePictureFileId,
    staleTime: 5 * 60 * 1000, // Cache the blob for 5 minutes
    gcTime: 10 * 60 * 1000,   // Keep in garbage collection for 10 minutes
  });
}
