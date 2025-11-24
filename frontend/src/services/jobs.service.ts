import { apiClient } from './api';
import type { JobOffer } from '../types/models/job.types';

export const jobsService = {
  getJobs: async (params?: any): Promise<JobOffer[]> => {
    const { data } = await apiClient.get<JobOffer[]>('/jobs', { params });
    return data;
  },

  getJobDetail: async (id: string): Promise<JobOffer> => {
    const { data } = await apiClient.get<JobOffer>(`/jobs/${id}`);
    return data;
  },

  createJob: async (jobData: Partial<JobOffer>): Promise<JobOffer> => {
    const { data } = await apiClient.post<JobOffer>('/jobs', jobData);
    return data;
  },
};
