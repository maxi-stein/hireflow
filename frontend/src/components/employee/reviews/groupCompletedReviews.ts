import type { InterviewReview } from '../../../services/interview-review.service';
import type { JobOffer } from '../../../services/job-offer.service';
import type { Candidate } from '../../../services/candidate-application.service';
import type { Interview } from '../../../services/interview.service';

export interface GroupedCompletedReviews {
  jobOffer: JobOffer;
  totalReviews: number;
  candidates: {
    candidateId: string;
    candidateData: Candidate;
    interviews: {
      interviewData: Interview;
      reviews: InterviewReview[];
    }[];
  }[];
}

/**
 * Groups an array of completed reviews into the hierarchy:
 * JobOffer -> Candidate -> Interview -> Reviews
 */
export function groupCompletedReviews(reviews: InterviewReview[]): GroupedCompletedReviews[] {
  // 1. Group by JobOffer ID
  const jobMap = new Map<string, { jobOffer: JobOffer; reviews: InterviewReview[] }>();

  for (const review of reviews) {
    const jobOffer = review.candidate_application?.job_offer;
    if (!jobOffer) continue;

    if (!jobMap.has(jobOffer.id)) {
      jobMap.set(jobOffer.id, { jobOffer, reviews: [] });
    }
    jobMap.get(jobOffer.id)!.reviews.push(review);
  }

  const result: GroupedCompletedReviews[] = [];

  // 2. Process each JobOffer group
  for (const [_, jobGroup] of jobMap) {
    const { jobOffer, reviews: jobReviews } = jobGroup;

    // Group by Candidate ID within this JobOffer
    const candidateMap = new Map<string, { candidateData: Candidate; reviews: InterviewReview[] }>();
    for (const review of jobReviews) {
      const candidate = review.candidate_application?.candidate;
      if (!candidate) continue;

      if (!candidateMap.has(candidate.id)) {
        candidateMap.set(candidate.id, { candidateData: candidate, reviews: [] });
      }
      candidateMap.get(candidate.id)!.reviews.push(review);
    }

    const processedCandidates = [];

    // 3. Process each Candidate group
    for (const [candidateId, candidateGroup] of candidateMap) {
      const { candidateData, reviews: candidateReviews } = candidateGroup;

      // Group by Interview ID within this Candidate
      const interviewMap = new Map<string, { interviewData: Interview; reviews: InterviewReview[] }>();
      for (const review of candidateReviews) {
        const interview = review.interview;
        if (!interview) continue;

        if (!interviewMap.has(interview.id)) {
          interviewMap.set(interview.id, { interviewData: interview, reviews: [] });
        }
        interviewMap.get(interview.id)!.reviews.push(review);
      }

      // Convert interview map to array and sort by scheduled_time
      const processedInterviews = Array.from(interviewMap.values()).sort((a, b) => {
        return new Date(a.interviewData.scheduled_time).getTime() - new Date(b.interviewData.scheduled_time).getTime();
      });

      processedCandidates.push({
        candidateId,
        candidateData,
        interviews: processedInterviews,
      });
    }

    result.push({
      jobOffer,
      totalReviews: jobReviews.length,
      candidates: processedCandidates,
    });
  }

  return result;
}
