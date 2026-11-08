import type { CandidateProfile } from '../services/candidate.service';

export type CandidateLatestActivity =
  | { type: 'NO_APPLICATIONS' }
  | {
      type: 'INTERVIEW';
      title: string;
      position?: string;
      remainingAppsCount: number;
    }
  | {
      type: 'APPLICATIONS';
      count: number;
      position?: string;
      remainingAppsCount: number;
    };

export function getCandidateLatestActivity(candidate: CandidateProfile): CandidateLatestActivity {
  const applications = (candidate.applications || []).filter((app) => app.status !== 'REJECTED');

  if (applications.length === 0) {
    return { type: 'NO_APPLICATIONS' };
  }

  let latestInterview: { id: string; title: string; scheduled_time: string } | null = null;
  let jobOfferForInterview: { id: string; position: string } | null = null;

  for (const app of applications) {
    if (app.interviews && app.interviews.length > 0) {
      const sortedInterviews = [...app.interviews].sort(
        (a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime()
      );
      if (!latestInterview || new Date(sortedInterviews[0].scheduled_time) > new Date(latestInterview.scheduled_time)) {
        latestInterview = sortedInterviews[0];
        jobOfferForInterview = app.job_offer;
      }
    }
  }

  const remainingAppsCount = applications.length - 1;

  if (latestInterview) {
    return {
      type: 'INTERVIEW',
      title: latestInterview.title,
      position: jobOfferForInterview?.position,
      remainingAppsCount,
    };
  }

  const latestApp = applications[applications.length - 1];
  return {
    type: 'APPLICATIONS',
    count: applications.length,
    position: latestApp.job_offer?.position,
    remainingAppsCount,
  };
}

