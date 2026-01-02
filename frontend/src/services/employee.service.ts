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

export interface CreateEmployeeUser {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  employeeData: {
    roles: string[];
    position: string;
  };
}

export const employeeService = {
  getAll: async (params?: { limit?: number }): Promise<PaginatedResponse<Employee>> => {
    const response = await apiClient.get<PaginatedResponse<Employee>>('/employees', { params });
    return response.data;
  },

  create: async (data: CreateEmployeeUser): Promise<Employee> => {
    const response = await apiClient.post<Employee>('/employees', data);
    return response.data;
  },
};
