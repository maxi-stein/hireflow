import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

export const DASHBOARD_QUERY_KEY = ['dashboard', 'metrics'];

export function useDashboardMetricsQuery() {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => dashboardService.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
