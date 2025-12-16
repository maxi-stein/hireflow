import type { JobOffer } from './job.types';
import type { Candidate } from './user.types';

export type ApplicationStatus = 'pending' | 'in_progress' | 'rejected' | 'hired';
export const ApplicationStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  REJECTED: 'rejected',
  HIRED: 'hired',
} as const;

export interface CandidateApplication {
  id: string;
  job_offer_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  job_offer?: JobOffer;
  candidate?: Candidate;
}
