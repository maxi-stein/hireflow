import { Paper, Stack, Group, TextInput, SegmentedControl, Text, Button } from '@mantine/core';
import { IconSearch, IconX, IconFilter } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface JobFiltersBarProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  selectedModality: string;
  onModalityChange: (value: string) => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
}

export function JobFiltersBar({
  searchKeyword,
  onSearchChange,
  onClearSearch,
  selectedModality,
  onModalityChange,
  filteredCount,
  totalCount,
  onClearFilters,
}: JobFiltersBarProps) {
  const { t } = useTranslation(['jobs']);

  const isFiltering = !!searchKeyword || selectedModality !== 'all';

  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      bg="light-dark(#f8fafc, #0f172a)"
      style={{ borderColor: 'light-dark(#e2e8f0, #334155)' }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center" wrap="wrap" gap="md">
          <TextInput
            placeholder={t(
              'jobs:publicList.searchPlaceholder',
              'Buscar por puesto, tecnología (React, Node, Java) o ciudad...'
            )}
            leftSection={<IconSearch size={18} color="#64748b" />}
            rightSection={
              searchKeyword ? (
                <IconX
                  size={16}
                  style={{ cursor: 'pointer', color: '#94a3b8' }}
                  onClick={onClearSearch}
                />
              ) : null
            }
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            style={{ flex: '1', minWidth: 260 }}
            size="md"
          />

          <Group gap="xs" align="center">
            <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
              {t('jobs:publicList.modalityLabel', 'Modalidad:')}
            </Text>
            <SegmentedControl
              value={selectedModality}
              onChange={onModalityChange}
              data={[
                { label: t('jobs:publicList.modalities.all', 'Todas'), value: 'all' },
                { label: t('jobs:publicList.modalities.remote', 'Remoto'), value: 'remote' },
                { label: t('jobs:publicList.modalities.hybrid', 'Híbrido'), value: 'hybrid' },
                { label: t('jobs:publicList.modalities.office', 'Presencial'), value: 'office' },
              ]}
              size="sm"
              radius="md"
            />
          </Group>
        </Group>

        {isFiltering && (
          <Group justify="space-between" align="center" pt="xs" style={{ borderTop: '1px solid #e2e8f0' }}>
            <Group gap="xs">
              <IconFilter size={15} color="#64748b" />
              <Text size="sm" c="dimmed">
                {t('jobs:publicList.showingCount', {
                  filtered: filteredCount,
                  total: totalCount,
                  defaultValue: `Mostrando ${filteredCount} de ${totalCount} ofertas`,
                })}
              </Text>
            </Group>
            <Button variant="subtle" color="red" size="xs" onClick={onClearFilters}>
              {t('jobs:publicList.clearFilters', 'Limpiar filtros')}
            </Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );
}

