import { useCandidateQuery } from './api/useCandidates';

/**
 * Reusable hook to check whether a candidate's profile is incomplete.
 * A profile is considered incomplete when the candidate has NO work experience
 * AND NO education entries.
 *
 * @param candidateId - The candidate's ID (pass empty string for non-candidates).
 * @returns `{ isProfileIncomplete, isLoading }`.
 */
export function useIncompleteProfile(candidateId: string) {
  const { data: profile, isLoading } = useCandidateQuery(candidateId);

  const isProfileIncomplete =
    !!profile &&
    (!profile.work_experiences || profile.work_experiences.length === 0) &&
    (!profile.educations || profile.educations.length === 0);

  return { isProfileIncomplete, isLoading, profile };
}
