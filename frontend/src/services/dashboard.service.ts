import { apiClient } from './api';

export interface DashboardMetrics {
  activeJobOffers: number;
  applicationsToday: number;
  pendingInterviews: number;
  pendingReviews: number;
  candidatesPerJob: Array<{
    jobTitle: string;
    count: number;
  }>;
}

export const dashboardService = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const response = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
    return response.data;
  },
};
