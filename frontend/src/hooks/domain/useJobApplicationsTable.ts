import { useState, useMemo } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useAllCandidateApplicationsQuery } from '../api/useCandidateApplications';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { useCandidateTechExperience } from '../useCandidateTechExperience';

interface UseJobApplicationsTableOptions {
  jobOfferId: string;
  limit?: number;
}

export function useJobApplicationsTable({ jobOfferId, limit = 5 }: UseJobApplicationsTableOptions) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: allApplications, isLoading } = useAllCandidateApplicationsQuery({
    page,
    limit,
    job_offer_id: jobOfferId,
    search: debouncedSearch,
    status: statusFilter !== 'all' ? [statusFilter as ApplicationStatus] : undefined,
    exclude_status: ApplicationStatus.HIRED,
  });

  const techStats = useCandidateTechExperience(allApplications?.data || []);

  const sortedApplications = useMemo(() => {
    return (allApplications?.data || [])
      .slice()
      .sort((a, b) => {
        const statusPriority: Record<ApplicationStatus, number> = {
          [ApplicationStatus.IN_PROGRESS]: 1,
          [ApplicationStatus.APPLIED]: 2,
          [ApplicationStatus.HIRED]: 3,
          [ApplicationStatus.REJECTED]: 4,
        };

        const priorityDiff = statusPriority[a.status] - statusPriority[b.status];

        if (priorityDiff === 0) {
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        }

        return priorityDiff;
      });
  }, [allApplications?.data]);

  return {
    page,
    setPage,
    search,
    setSearch,
    debouncedSearch,
    statusFilter,
    setStatusFilter,
    allApplications,
    isLoading,
    techStats,
    sortedApplications,
  };
}

