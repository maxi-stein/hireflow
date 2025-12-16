import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employee.service';

export const EMPLOYEES_QUERY_KEY = ['employees'];

export function useEmployeesQuery(params?: { limit?: number }) {
  return useQuery({
    queryKey: [...EMPLOYEES_QUERY_KEY, params],
    queryFn: () => employeeService.getAll(params),
  });
}
