import { apiClient } from './api';
import type { CandidateUser } from './candidate-application.service';
import type { Education } from './education.service';
import type { WorkExperience } from './work-experience.service';

export interface CandidateProfile {
  id: string; // candidate id
  user_id: string; // user entity id
  headline?: string;
  date_of_birth?: string;
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
  applications?: {
    id: string;
    status: string;
    job_offer: {
      id: string;
      position: string;
    };
    interviews: {
      id: string;
      title: string;
      scheduled_time: string;
    }[];
  }[];
}

export interface UpdateCandidateDto {
  date_of_birth?: string;
  headline?: string;
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

export interface CandidateFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: 'updated_at' | 'last_name';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const candidateService = {
  getAll: async (params?: CandidateFilterParams): Promise<PaginatedResponse<CandidateProfile>> => {
    const response = await apiClient.get<PaginatedResponse<CandidateProfile>>('/candidates', {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<CandidateProfile> => {
    const response = await apiClient.get<CandidateProfile>(`/candidates/${id}`);
    return response.data;
  },

  update: async (id: string, data: UpdateCandidateDto): Promise<CandidateProfile> => {
    const response = await apiClient.patch<CandidateProfile>(`/candidates/${id}`, data);
    return response.data;
  },
};
