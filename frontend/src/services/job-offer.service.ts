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
  created_at: string;
  updated_at: string;
  skills: JobOfferSkill[];
  applicants_count: number;
  deadline?: string;
}

export interface CreateJobOfferDto {
  position: string;
  location: string;
  work_mode: WorkMode;
  description: string;
  salary?: string;
  benefits?: string;
  deadline?: string;
  skills?: { skill_name: string }[];
}

export interface JobOfferFilters {
  page?: number;
  limit?: number;
  status?: JobOfferStatus;
  position?: string;
  start_date?: string;
  end_date?: string;
  deadline_from?: string;
  deadline_to?: string;
}

export type UpdateJobOfferDto = Partial<CreateJobOfferDto>;

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
      if (filters.deadline_from) params.append('deadline_from', filters.deadline_from);
      if (filters.deadline_to) params.append('deadline_to', filters.deadline_to);
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

  update: async (id: string, data: UpdateJobOfferDto): Promise<JobOffer> => {
    const response = await apiClient.patch<JobOffer>(`/job-offers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/job-offers/${id}`);
  },

  searchSkills: async (query: string): Promise<JobOfferSkill[]> => {
    if (!query) return [];
    // encodeURIComponent() transforms special characters into their URL-encoded equivalents (space -> %20, etc.)
    const response = await apiClient.get<JobOfferSkill[]>(`/job-offer-skills/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
