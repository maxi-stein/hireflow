import { apiClient } from './api';
import type { CandidateUser } from './candidate-application.service';
import type { Education } from './education.service';
import type { WorkExperience } from './work-experience.service';

export interface CandidateProfile {
  id: string; // candidate id
  user_id: string; // user entity id
  age?: number;
  phone?: string;
  city?: string;
  country?: string;
  github?: string;
  linkedin?: string;
  resume_url?: string;
  portfolio_url?: string;
  user: CandidateUser; // simplified user.
  educations?: Education[];
  work_experiences?: WorkExperience[];
  profile_created_at: string;
  profile_updated_at: string;
  files?: any[]; // simplified for now
}

export interface UpdateCandidateDto {
  age?: number;
  phone?: string;
  city?: string;
  country?: string;
  github?: string;
  linkedin?: string;
  resume_url?: string;
  portfolio_url?: string;
  educations?: Education[];
  work_experiences?: WorkExperience[];
}

export const candidateService = {
  getById: async (id: string): Promise<CandidateProfile> => {
    const response = await apiClient.get<CandidateProfile>(`/candidates/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateCandidateDto): Promise<CandidateProfile> => {
    const response = await apiClient.patch<CandidateProfile>(`/candidates/${id}`, data);
    return response.data;
  },
};
