import { TextInput, Select, Group, Paper } from '@mantine/core';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { JobOfferStatus } from '../../../services/job-offer.service';

interface JobPostingsFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  filter: string | null;
  setFilter: (value: string | null) => void;
}

export function JobPostingsFilters({
  search,
  setSearch,
  filter,
  setFilter,
}: JobPostingsFiltersProps) {
  const { t } = useTranslation('jobs');

  return (
    <Paper p="md" mb="lg" radius="md" withBorder>
      <Group>
        <TextInput
          placeholder={t('list.searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Select
          placeholder={t('list.filterStatus')}
          leftSection={<IconFilter size={16} />}
          data={[
            { value: JobOfferStatus.OPEN, label: t('status.open') },
            { value: JobOfferStatus.CLOSED, label: t('status.closed') },
          ]}
          value={filter}
          onChange={setFilter}
          clearable
          style={{ width: 200 }}
        />
      </Group>
    </Paper>
  );
}
