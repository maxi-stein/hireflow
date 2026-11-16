import { Box, Group, TextInput, Select } from '@mantine/core';
import { IconSearch, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface CandidatesListToolbarProps {
  search: string;
  sortBy: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (value: string | null) => void;
  isDark: boolean;
}

export function CandidatesListToolbar({
  search,
  sortBy,
  onSearchChange,
  onSortChange,
  isDark,
}: CandidatesListToolbarProps) {
  const { t } = useTranslation('candidates');

  return (
    <Box
      px="xl"
      py="md"
      style={{
        borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
        background: isDark ? '#0f172a' : '#f8fafc',
      }}
    >
      <Group justify="space-between" wrap="wrap" gap="md">
        <TextInput
          placeholder={t('list.searchPlaceholder')}
          leftSection={<IconSearch size={15} />}
          value={search}
          onChange={onSearchChange}
          w={280}
          radius="md"
        />
        <Select
          label={t('list.sort.label')}
          leftSection={
            sortBy === 'updated_at' ? (
              <IconSortDescending size={15} />
            ) : (
              <IconSortAscending size={15} />
            )
          }
          data={[
            { value: 'updated_at', label: t('list.sort.updatedAt') },
            { value: 'last_name', label: t('list.sort.lastName') },
          ]}
          value={sortBy}
          onChange={onSortChange}
          allowDeselect={false}
          w={200}
          radius="md"
        />
      </Group>
    </Box>
  );
}

