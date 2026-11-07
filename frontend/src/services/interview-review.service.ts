import { apiClient } from "./api";
import type { PaginatedResponse } from "../types/common";
import type { Interview } from "./interview.service";
import type { CandidateApplication } from "./candidate-application.service";
import type { Employee } from "./employee.service";

export interface InterviewReview {
  id: string;
  interview_id: string;
  employee_id: string;
  candidate_application_id: string;
  notes?: string;
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
  created_at: string;
  updated_at: string;
  interview?: Interview;
  candidate_application?: CandidateApplication;
  employee?: Employee;
}

export interface CreateInterviewReviewDto {
  employee_id: string;
  interview_id: string;
  candidate_application_id: string;
  notes?: string;
  score?: number;
  strengths?: string[];
  weaknesses?: string[];
}

export interface UpdateInterviewReviewDto
  extends Partial<CreateInterviewReviewDto> {}

export interface FilterInterviewReviewsDto {
  page?: number;
  limit?: number;
  search?: string;
  employee_id?: string;
  candidate_id?: string;
  job_offer_id?: string;
  candidate_application_id?: string;
  interview_id?: string;
}

export const interviewReviewService = {
  create: async (data: CreateInterviewReviewDto): Promise<InterviewReview> => {
    const response = await apiClient.post<InterviewReview>(
      "/interview-reviews",
      data
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateInterviewReviewDto
  ): Promise<InterviewReview> => {
    const response = await apiClient.patch<InterviewReview>(
      `/interview-reviews/${id}`,
      data
    );
    return response.data;
  },

  findByInterview: async (interviewId: string): Promise<InterviewReview[]> => {
    const response = await apiClient.get<InterviewReview[]>(
      `/interview-reviews/interview/${interviewId}`
    );
    return response.data;
  },

  // Helper to find specific review for current user
  findByEmployeeAndInterview: async (
    employeeId: string,
    interviewId: string
  ): Promise<InterviewReview> => {
    const response = await apiClient.get<InterviewReview>(
      `/interview-reviews/employee/${employeeId}/interview/${interviewId}`
    );
    return response.data;
  },

  findMyPendingReviews: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Interview>> => {
    const response = await apiClient.get<PaginatedResponse<Interview>>(
      `/interview-reviews/my-pending-reviews`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  findMyCompletedReviews: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<InterviewReview>> => {
    const response = await apiClient.get<PaginatedResponse<InterviewReview>>(
      `/interview-reviews/my-completed-reviews`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  getAllCompletedReviews: async (
    filters?: FilterInterviewReviewsDto
  ): Promise<PaginatedResponse<InterviewReview>> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.employee_id) params.append('employee_id', filters.employee_id);
      if (filters.candidate_id) params.append('candidate_id', filters.candidate_id);
      if (filters.job_offer_id) params.append('job_offer_id', filters.job_offer_id);
      if (filters.candidate_application_id)
        params.append('candidate_application_id', filters.candidate_application_id);
      if (filters.interview_id) params.append('interview_id', filters.interview_id);
    }
    const response = await apiClient.get<PaginatedResponse<InterviewReview>>(
      `/interview-reviews?${params.toString()}`
    );
    return response.data;
  },
};
