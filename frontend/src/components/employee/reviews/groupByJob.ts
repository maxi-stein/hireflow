import type { Interview } from '../../../services/interview.service';
import type { InterviewReview } from '../../../services/interview-review.service';

export interface JobGroup<T> {
  jobTitle: string;
  candidates: {
    candidateId: string;
    items: T[];
  }[];
}

interface FieldExtractor<T> {
  getJobTitle: (item: T) => string;
  getCandidateId: (item: T) => string;
}

/**
 * Groups an array of items by job title and then by candidate ID.
 * Used by both pending (Interview[]) and completed (InterviewReview[]) views.
 */
export function groupByJob<T>(
  items: T[],
  extractor: FieldExtractor<T>,
  fallbackJobTitle: string,
): JobGroup<T>[] {
  const map: Record<string, Record<string, T[]>> = {};

  items.forEach(item => {
    const jobTitle = extractor.getJobTitle(item) || fallbackJobTitle;
    const candidateId = extractor.getCandidateId(item) || 'unknown';

    if (!map[jobTitle]) map[jobTitle] = {};
    if (!map[jobTitle][candidateId]) map[jobTitle][candidateId] = [];

    map[jobTitle][candidateId].push(item);
  });

  return Object.entries(map).map(([jobTitle, candidatesMap]) => ({
    jobTitle,
    candidates: Object.entries(candidatesMap).map(([candidateId, items]) => ({
      candidateId,
      items,
    })),
  }));
}

/** Field extractors for pending reviews (Interview[]) */
export const pendingExtractor: FieldExtractor<Interview> = {
  getJobTitle: (interview) => interview.applications?.[0]?.job_offer?.position || '',
  getCandidateId: (interview) => interview.applications?.[0]?.candidate?.id || 'unknown',
};

/** Field extractors for completed reviews (InterviewReview[]) */
export const completedExtractor: FieldExtractor<InterviewReview> = {
  getJobTitle: (review) => review.candidate_application?.job_offer?.position || '',
  getCandidateId: (review) => review.candidate_application?.candidate?.id || 'unknown',
};
