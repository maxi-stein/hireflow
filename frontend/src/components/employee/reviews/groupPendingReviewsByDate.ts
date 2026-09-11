import type { Interview } from '../../../services/interview.service';
import type { Candidate } from '../../../services/candidate-application.service';

export interface GroupedPendingReviews {
  dateKey: string; // ISO string without time, e.g. "2024-03-25"
  candidates: {
    candidateId: string;
    candidateData: Candidate;
    interviews: Interview[];
  }[];
}

/**
 * Groups pending interviews into the hierarchy:
 * Date -> Candidate -> Interviews
 */
export function groupPendingReviewsByDate(interviews: Interview[]): GroupedPendingReviews[] {
  // 1. Group by Date (YYYY-MM-DD)
  const dateMap = new Map<string, Interview[]>();

  for (const interview of interviews) {
    const date = new Date(interview.scheduled_time);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push(interview);
  }

  // Sort dates descending (or ascending, usually for pending we want the earliest first)
  const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  const result: GroupedPendingReviews[] = [];

  // 2. Process each Date group
  for (const dateKey of sortedDates) {
    const dateInterviews = dateMap.get(dateKey)!;

    // Group by Candidate ID within this Date
    const candidateMap = new Map<string, { candidateData: Candidate; interviews: Interview[] }>();
    for (const interview of dateInterviews) {
      const candidate = interview.applications?.[0]?.candidate;
      if (!candidate) continue;

      if (!candidateMap.has(candidate.id)) {
        candidateMap.set(candidate.id, { candidateData: candidate, interviews: [] });
      }
      candidateMap.get(candidate.id)!.interviews.push(interview);
    }

    const processedCandidates = [];

    // 3. Process each Candidate group
    for (const [candidateId, candidateGroup] of candidateMap) {
      // Sort interviews for this candidate by time
      const sortedInterviews = candidateGroup.interviews.sort((a, b) => 
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
      );

      processedCandidates.push({
        candidateId,
        candidateData: candidateGroup.candidateData,
        interviews: sortedInterviews,
      });
    }

    result.push({
      dateKey,
      candidates: processedCandidates,
    });
  }

  return result;
}
