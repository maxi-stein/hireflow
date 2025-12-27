import { apiClient } from './api';
import type { CandidateUser } from './candidate-application.service';

export interface Education {
  id: string;
  institution: string;
  degree_type: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface WorkExperience {
  id: string;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface CandidateProfile {
  id: string;
  age?: number;
  phone?: string;
  city?: string;
  country?: string;
  github?: string;
  linkedin?: string;
  user: CandidateUser;
  educations?: Education[];
  work_experiences?: WorkExperience[];
  profile_created_at: string;
  profile_updated_at: string;
}

export const candidateService = {
  getById: async (id: string): Promise<CandidateProfile> => {
    const response = await apiClient.get<CandidateProfile>(`/candidates/${id}`);
    return response.data;
  },
};
