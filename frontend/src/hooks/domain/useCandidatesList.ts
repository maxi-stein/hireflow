import { useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { useCandidatesQuery } from '../api/useCandidates';

export function useCandidatesList(initialLimit: number = 10) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [sortBy, setSortBy] = useState<'updated_at' | 'last_name'>('updated_at');

  const { data: candidatesData, isLoading } = useCandidatesQuery({
    page,
    limit: initialLimit,
    search: debouncedSearch,
    sort: sortBy,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
    setPage(1);
  };

  const handleSortChange = (value: string | null) => {
    if (value === 'updated_at' || value === 'last_name') {
      setSortBy(value);
      setPage(1);
    }
  };

  return {
    page,
    setPage,
    search,
    sortBy,
    candidatesData,
    isLoading,
    handleSearchChange,
    handleSortChange,
  };
}

