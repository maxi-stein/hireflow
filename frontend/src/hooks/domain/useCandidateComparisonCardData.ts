import { useCandidateQuery } from '../api/useCandidates';
import { useCandidateInterviewsQuery } from '../api/useInterviews';
import { useCandidateFilesQuery } from '../api/useUserFiles';
import { useFileDownloader } from '../useFileDownloader';
import { FileType, type UserFile } from '../../services/user-file.service';
import type { CandidateProfile } from '../../services/candidate.service';
import type { WorkExperience } from '../../services/work-experience.service';
import type { Interview } from '../../services/interview.service';

export interface UseCandidateComparisonCardDataParams {
  candidateId: string;
  applicationId: string;
}

export interface UseCandidateComparisonCardDataReturn {
  candidateProfile: CandidateProfile | undefined;
  resume: UserFile | undefined;
  handleDownloadResume: () => void;
  interviews: Interview[];
  latestExperience: WorkExperience | null;
  isLoading: boolean;
}

export function useCandidateComparisonCardData({
  candidateId,
  applicationId,
}: UseCandidateComparisonCardDataParams): UseCandidateComparisonCardDataReturn {
  const { data: candidateProfile, isLoading: isLoadingProfile } = useCandidateQuery(candidateId);
  const { data: interviewsData, isLoading: isLoadingInterviews } =
    useCandidateInterviewsQuery(candidateId);
  const { data: files, isLoading: isLoadingFiles } = useCandidateFilesQuery(candidateId);

  const resume = files?.find((f) => f.file_type === FileType.RESUME);
  const { downloadFile } = useFileDownloader();

  const handleDownloadResume = () => {
    if (resume) {
      downloadFile(resume.id, resume.file_name);
    }
  };

  const interviews =
    interviewsData?.data
      ?.filter((i) => i.applications.some((app) => app.id === applicationId))
      .sort(
        (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime(),
      ) || [];

  const latestExperience = candidateProfile?.work_experiences?.length
    ? [...candidateProfile.work_experiences].sort((a, b) => {
        if (!a.end_date) return -1;
        if (!b.end_date) return 1;
        return new Date(b.end_date).getTime() - new Date(a.end_date).getTime();
      })[0]
    : null;

  const isLoading = isLoadingProfile || isLoadingInterviews || isLoadingFiles;

  return {
    candidateProfile,
    resume,
    handleDownloadResume,
    interviews,
    latestExperience,
    isLoading,
  };
}
