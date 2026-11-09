import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WorkMode, type JobOffer } from '../../services/job-offer.service';

interface UseJobListFiltersProps {
  allJobs: JobOffer[];
}

export function useJobListFilters({ allJobs }: UseJobListFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [selectedModality, setSelectedModality] = useState<string>('all');

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchKeyword) {
      setSearchKeyword(q);
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    if (value) setSearchParams({ search: value });
    else setSearchParams({});
  };

  const handleClearSearch = () => {
    setSearchKeyword('');
    setSearchParams({});
  };

  const handleClearFilters = () => {
    setSearchKeyword('');
    setSelectedModality('all');
    setSearchParams({});
  };

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Modality filter
      if (selectedModality !== 'all') {
        const jobMode = job.work_mode?.toLowerCase() || '';
        if (selectedModality === 'remote' && jobMode !== WorkMode.REMOTE) return false;
        if (selectedModality === 'hybrid' && jobMode !== WorkMode.HYBRID) return false;
        if (selectedModality === 'office' && jobMode !== 'office' && jobMode !== 'presencial') return false;
      }

      // Keyword search
      if (searchKeyword.trim()) {
        const term = searchKeyword.toLowerCase();
        const matchesPosition = job.position?.toLowerCase().includes(term);
        const matchesDescription = job.description?.toLowerCase().includes(term);
        const matchesLocation = job.location?.toLowerCase().includes(term);
        const matchesSkill = job.skills?.some((s) => s.skill_name?.toLowerCase().includes(term));

        return matchesPosition || matchesDescription || matchesLocation || matchesSkill;
      }

      return true;
    });
  }, [allJobs, searchKeyword, selectedModality]);

  return {
    searchKeyword,
    selectedModality,
    setSelectedModality,
    filteredJobs,
    handleSearchChange,
    handleClearSearch,
    handleClearFilters,
  };
}

