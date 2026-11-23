import {
  Container,
  Title,
  Text,
  Group,
  Pagination,
  Stack,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { CardBox } from '../../components/shared/CardBox';
import { useTranslation } from 'react-i18next';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useCandidatesList } from '../../hooks/candidates/useCandidatesList';
import { CandidatesListToolbar } from '../../components/employee/candidates/CandidatesListToolbar';
import { CandidatesTable } from '../../components/employee/candidates/CandidatesTable';

export function CandidatesListPage() {
  const { t } = useTranslation('candidates');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    page,
    setPage,
    search,
    sortBy,
    candidatesData,
    isLoading,
    handleSearchChange,
    handleSortChange,
  } = useCandidatesList();

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>{t('list.title')}</Title>
            <Text c="dimmed" size="sm" mt={4}>
              {t('list.subtitle')}
            </Text>
          </div>
        </Group>

        <CardBox
          isDark={isDark}
          style={{ overflow: 'hidden' }}
        >
          {/* Toolbar */}
          <CandidatesListToolbar
            search={search}
            sortBy={sortBy}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            isDark={isDark}
          />

          {/* Table */}
          <CandidatesTable
            candidatesData={candidatesData}
            isLoading={isLoading}
            isDark={isDark}
          />

          {/* Pagination */}
          {candidatesData && candidatesData.pagination.totalPages > 1 && (
            <Box px="xl" py="md" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
              <Group justify="center">
                <Pagination
                  total={candidatesData.pagination.totalPages}
                  value={page}
                  onChange={setPage}
                  size="sm"
                />
              </Group>
            </Box>
          )}
        </CardBox>
      </Stack>
    </Container>
  );
}
