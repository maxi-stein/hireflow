import {
  Container,
  Title,
  Text,
  Group,
  Pagination,
  Stack,
  TextInput,
  Select,
  Table,
  LoadingOverlay,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconSearch, IconSortAscending, IconSortDescending, IconUser } from '@tabler/icons-react';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useCandidatesList } from '../../hooks/domain/useCandidatesList';
import { CandidateTableRow } from '../../components/employee/candidates/CandidateTableRow';

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

        <Box
          style={{
            borderRadius: 16,
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            background: isDark ? '#1e293b' : '#ffffff',
            overflow: 'hidden',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(15,23,42,0.05)',
          }}
        >
          {/* Toolbar */}
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
                onChange={handleSearchChange}
                w={280}
                radius="md"
              />
              <Select
                label={t('list.sort.label')}
                leftSection={sortBy === 'updated_at' ? <IconSortDescending size={15} /> : <IconSortAscending size={15} />}
                data={[
                  { value: 'updated_at', label: t('list.sort.updatedAt') },
                  { value: 'last_name', label: t('list.sort.lastName') },
                ]}
                value={sortBy}
                onChange={handleSortChange}
                allowDeselect={false}
                w={200}
                radius="md"
              />
            </Group>
          </Box>

          {/* Table */}
          <Box pos="relative" mih={300}>
            <LoadingOverlay visible={isLoading} zIndex={100} overlayProps={{ radius: 'sm', blur: 2 }} />

            <Table
              horizontalSpacing="xl"
              verticalSpacing="xs"
              highlightOnHover
              styles={{
                th: {
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: isDark ? '#64748b' : '#94a3b8',
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
                  background: isDark ? '#0f172a' : '#f8fafc',
                },
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w="30%">{t('list.table.candidate')}</Table.Th>
                  <Table.Th w="20%">{t('list.table.profile')}</Table.Th>
                  <Table.Th w="28%">{t('list.table.applications')}</Table.Th>
                  <Table.Th w="12%">{t('list.table.lastUpdated')}</Table.Th>
                  <Table.Th w="10%" style={{ textAlign: 'right' }}>{t('list.table.actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {candidatesData?.data.map((candidate) => (
                  <CandidateTableRow key={candidate.id} candidate={candidate} />
                ))}
                {!isLoading && candidatesData?.data.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Stack align="center" py="xl" gap="xs">
                        <Box
                          p="lg"
                          style={{
                            borderRadius: '50%',
                            background: isDark ? '#334155' : '#f1f5f9',
                          }}
                        >
                          <IconUser size={32} color={isDark ? '#64748b' : '#94a3b8'} />
                        </Box>
                        <Text c="dimmed" fw={500}>{t('list.table.empty')}</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>

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
        </Box>
      </Stack>
    </Container>
  );
}
