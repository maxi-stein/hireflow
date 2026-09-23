import type { Interview } from '../../../services/interview.service';
import type { Candidate } from '../../../services/candidate-application.service';

export interface GroupedCandidateReview {
  candidateId: string;
  candidateData: Candidate;
  interviews: Interview[];
}

export interface GroupedByPosition {
  position: string;
  candidates: GroupedCandidateReview[];
}

export interface GroupedPendingReviews {
  dateKey: string; // ISO string without time, e.g. "2024-03-25"
  positions: GroupedByPosition[];
}

/**
 * Groups pending interviews into the hierarchy:
 * Date -> Job Position -> Candidate -> Interviews
 * Dates are sorted ascending (oldest first).
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

  // Sort dates ascending (oldest first)
  const sortedDates = Array.from(dateMap.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const result: GroupedPendingReviews[] = [];

  for (const dateKey of sortedDates) {
    const dateInterviews = dateMap.get(dateKey)!;

    // 2. Group by Job Position within this Date
    const positionMap = new Map<string, Interview[]>();
    for (const interview of dateInterviews) {
      const position = interview.applications?.[0]?.job_offer?.position ?? 'Sin puesto';
      if (!positionMap.has(position)) {
        positionMap.set(position, []);
      }
      positionMap.get(position)!.push(interview);
    }

    const positions: GroupedByPosition[] = [];

    for (const [position, positionInterviews] of positionMap) {
      // 3. Group by Candidate within this Position
      const candidateMap = new Map<string, { candidateData: Candidate; interviews: Interview[] }>();

      for (const interview of positionInterviews) {
        const candidate = interview.applications?.[0]?.candidate;
        if (!candidate) continue;

        if (!candidateMap.has(candidate.id)) {
          candidateMap.set(candidate.id, { candidateData: candidate, interviews: [] });
        }
        candidateMap.get(candidate.id)!.interviews.push(interview);
      }

      const candidates: GroupedCandidateReview[] = [];

      for (const [candidateId, candidateGroup] of candidateMap) {
        // Sort interviews for this candidate by time ascending
        const sortedInterviews = candidateGroup.interviews.sort(
          (a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime(),
        );

        candidates.push({
          candidateId,
          candidateData: candidateGroup.candidateData,
          interviews: sortedInterviews,
        });
      }

      positions.push({ position, candidates });
    }

    result.push({ dateKey, positions });
  }

  return result;
}

