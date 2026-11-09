import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, type CreateEmployeeUser } from '../../services/employee.service';

export const EMPLOYEES_QUERY_KEY = ['employees'];

export function useEmployeesQuery(params?: { limit?: number }) {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, params],
    queryFn: () => employeeService.getAll(params),
  });
}

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmployeeUser) => employeeService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
    },
  });
}
