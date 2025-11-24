export type WorkMode = 'remote' | 'hybrid' | 'onsite';
export const WorkMode = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
} as const;

export type JobOfferStatus = 'open' | 'closed' | 'paused';
export const JobOfferStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
  PAUSED: 'paused',
} as const;

export interface JobOfferSkill {
  id: string;
  job_offer_id: string;
  skill_name: string;
}

export interface JobOffer {
  id: string;
  position: string;
  location: string;
  work_mode: WorkMode;
  description: string;
  salary?: string;
  benefits?: string;
  status: JobOfferStatus;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  skills: JobOfferSkill[];
}
