import { apiClient } from './api';
import type { PaginatedResponse } from '../types/common';
import type { CandidateApplication } from './candidate-application.service';

export const InterviewStatus = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export type InterviewStatus = (typeof InterviewStatus)[keyof typeof InterviewStatus];

export const InterviewType = {
  INDIVIDUAL: 'INDIVIDUAL',
  GROUP: 'GROUP',
} as const;

export type InterviewType = (typeof InterviewType)[keyof typeof InterviewType];

export interface Interviewer {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Interview {
  id: string;
  type: InterviewType;
  scheduled_time: string;
  meeting_link?: string;
  status: InterviewStatus;
  applications: CandidateApplication[];
  interviewers: Interviewer[];
}

export interface CreateInterviewDto {
  type: InterviewType;
  scheduled_time: string;
  meeting_link?: string;
  status?: InterviewStatus;
  application_ids: string[];
  interviewer_ids: string[];
}

export interface InterviewFilters {
  page?: number;
  limit?: number;
  applicationId?: string;
  employeeId?: string;
  candidate_application_id?: string;
  start_date?: string;
  end_date?: string;
  status?: InterviewStatus;
  order?: 'ASC' | 'DESC';
}

export interface UpdateInterviewDto extends Partial<CreateInterviewDto> {}

export const interviewService = {
  getAll: async (filters?: InterviewFilters): Promise<PaginatedResponse<Interview>> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.applicationId) params.append('applicationId', filters.applicationId);
      if (filters.employeeId) params.append('employeeId', filters.employeeId);
      if (filters.candidate_application_id) params.append('candidate_application_id', filters.candidate_application_id);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);
      if (filters.status) params.append('status', filters.status);
      if (filters.order) params.append('order', filters.order);
    }
    const response = await apiClient.get<PaginatedResponse<Interview>>(`/interviews?${params.toString()}`);
    return response.data;
  },

  create: async (data: CreateInterviewDto): Promise<Interview> => {
    const response = await apiClient.post<Interview>('/interviews', data);
    return response.data;
  },

  update: async (id: string, data: UpdateInterviewDto): Promise<Interview> => {
    const response = await apiClient.patch<Interview>(`/interviews/${id}`, data);
    return response.data;
  },

  getByCandidate: async (candidateId: string): Promise<PaginatedResponse<Interview>> => {
    const response = await apiClient.get<PaginatedResponse<Interview>>(`/interviews/candidate/${candidateId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Interview> => {
    const response = await apiClient.get<Interview>(`/interviews/${id}`);
    return response.data;
  },
};
