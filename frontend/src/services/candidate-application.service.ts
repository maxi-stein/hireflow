import { apiClient } from './api';
import type { PaginatedResponse } from '../types/common';
import type { JobOffer } from './job-offer.service';

export const ApplicationStatus = {
  APPLIED: 'APPLIED',
  IN_PROGRESS: 'IN_PROGRESS',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export interface CandidateUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Candidate {
  id: string;
  user: CandidateUser;
}

export interface JobOfferSkill {
  id: string;
  skill_name: string;
}

export interface CandidateSkillAnswer {
  id: string;
  years_of_experience: number;
  job_offer_skill: JobOfferSkill;
}

export interface CandidateApplication {
  id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  candidate: Candidate;
  job_offer: JobOffer;
  skill_answers?: CandidateSkillAnswer[];
}

export interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  job_offer_id?: string;
  candidate_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
}

export const candidateApplicationService = {
  getAll: async (filters?: ApplicationFilters): Promise<PaginatedResponse<CandidateApplication>> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.job_offer_id) params.append('job_offer_id', filters.job_offer_id);
      if (filters.candidate_id) params.append('candidate_id', filters.candidate_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.search) params.append('search', filters.search);
    }

    const response = await apiClient.get<PaginatedResponse<CandidateApplication>>(`/candidate-applications?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<CandidateApplication> => {
    const response = await apiClient.get<CandidateApplication>(`/candidate-applications/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: ApplicationStatus): Promise<CandidateApplication> => {
    const response = await apiClient.patch<CandidateApplication>(`/candidate-applications/${id}`, { status });
    return response.data;
  },
};
