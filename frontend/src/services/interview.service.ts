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

export const interviewService = {
  getByCandidate: async (candidateId: string): Promise<PaginatedResponse<Interview>> => {
    const response = await apiClient.get<PaginatedResponse<Interview>>(`/interviews/candidate/${candidateId}`);
    return response.data;
  },
};
