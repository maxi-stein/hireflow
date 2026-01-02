import { apiClient } from './api';
import type { PaginatedResponse } from '../types/common';

export interface Employee {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export const employeeService = {
  getAll: async (params?: { limit?: number }): Promise<PaginatedResponse<Employee>> => {
    const response = await apiClient.get<PaginatedResponse<Employee>>('/employees', { params });
    return response.data;
  },
};
