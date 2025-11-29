import { apiClient } from './api';
import type { PaginatedResponse } from '../types/common';

export const JobOfferStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

export type JobOfferStatus = (typeof JobOfferStatus)[keyof typeof JobOfferStatus];

export const WorkMode = {
  HYBRID: 'hybrid',
  FULL_REMOTE: 'full-remote',
  OFFICE: 'office',
} as const;

export type WorkMode = (typeof WorkMode)[keyof typeof WorkMode];

export interface JobOfferSkill {
  id: string;
  name: string;
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
  created_at: string;
  updated_at: string;
  skills: JobOfferSkill[];
  applicants_count: number;
}

export interface CreateJobOfferDto {
  position: string;
  location: string;
  work_mode: WorkMode;
  description: string;
  salary?: string;
  benefits?: string;
  skills?: { name: string }[];
}

export interface JobOfferFilters {
  page?: number;
  limit?: number;
  status?: JobOfferStatus;
  position?: string;
  start_date?: string;
  end_date?: string;
}

export const jobOfferService = {
  getAll: async (filters?: JobOfferFilters): Promise<PaginatedResponse<JobOffer>> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.position) params.append('position', filters.position);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
    }
    
    const response = await apiClient.get<PaginatedResponse<JobOffer>>(`/job-offers?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<JobOffer> => {
    const response = await apiClient.get<JobOffer>(`/job-offers/${id}`);
    return response.data;
  },

  create: async (data: CreateJobOfferDto): Promise<JobOffer> => {
    const response = await apiClient.post<JobOffer>('/job-offers', data);
    return response.data;
  },
};
