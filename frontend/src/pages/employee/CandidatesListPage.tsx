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
  Tooltip,
  LoadingOverlay,
  Button,
  Box,
  Badge,
  useMantineColorScheme,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { IconSearch, IconEye, IconSortAscending, IconSortDescending, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidatesQuery } from '../../hooks/api/useCandidates';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';
import { APP_MAX_WIDTH } from '../../constants/layout';

export function CandidatesListPage() {
  const { t } = useTranslation('candidates');
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);
  const [sortBy, setSortBy] = useState<'updated_at' | 'last_name'>('updated_at');

  const { data: candidatesData, isLoading } = useCandidatesQuery({
    page,
    limit: 10,
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

  const rows = candidatesData?.data.map((candidate) => (
    <Table.Tr
      key={candidate.id}
      style={{
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
      }}
      onClick={() => navigate(`/manage/candidates/list/${candidate.id}`)}
    >
      <Table.Td>
        <Group gap="sm" py={8}>
          <CandidateAvatar
            candidateId={candidate.id}
            firstName={candidate.user.first_name}
            lastName={candidate.user.last_name}
            size="md"
          />
          <div>
            <Text fw={600} size="sm">
              {candidate.user.first_name} {candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{candidate.user.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        {candidate.headline ? (
          <Text size="sm" lineClamp={2}>{candidate.headline}</Text>
        ) : (
          <Text size="sm" c="dimmed" fs="italic">{t('na', { ns: 'common' })}</Text>
        )}
      </Table.Td>
      <Table.Td>
        {(() => {
          const applications = (candidate.applications || []).filter((app: any) => app.status !== 'REJECTED');
          if (applications.length === 0) {
            return (
              <Badge variant="light" color="gray" size="sm">
                {t('list.table.noApplications')}
              </Badge>
            );
          }

          let latestInterview: any = null;
          let jobOfferForInterview: any = null;

          for (const app of applications) {
            if (app.interviews && app.interviews.length > 0) {
              const sortedInterviews = [...app.interviews].sort((a: any, b: any) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
              if (!latestInterview || new Date(sortedInterviews[0].scheduled_time) > new Date(latestInterview.scheduled_time)) {
                latestInterview = sortedInterviews[0];
                jobOfferForInterview = app.job_offer;
              }
            }
          }

          const remainingAppsCount = applications.length - 1;

          if (latestInterview) {
            return (
              <Box>
                <Badge variant="light" color="blue" size="sm" mb={4}>
                  {latestInterview.title}
                </Badge>
                <Text size="xs" c="dimmed">
                  {jobOfferForInterview?.position}
                  {remainingAppsCount > 0 && ` +${t('list.table.moreApplications', { count: remainingAppsCount })}`}
                </Text>
              </Box>
            );
          }

          const latestApp = applications[applications.length - 1];
          return (
            <Box>
              <Badge variant="light" color="teal" size="sm" mb={4}>
                {t('list.table.applicationsCount', { count: applications.length })}
              </Badge>
              <Text size="xs" c="dimmed">
                {latestApp.job_offer?.position}
                {remainingAppsCount > 0 && ` +${t('list.table.moreApplications', { count: remainingAppsCount })}`}
              </Text>
            </Box>
          );
        })()}
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">{new Date(candidate.profile_updated_at).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td onClick={(e) => e.stopPropagation()}>
        <Group gap="xs" justify="flex-end">
          <Tooltip label={t('table.tooltips.viewCandidate', { ns: 'applications' })}>
            <Button
              variant="light"
              color="blue"
              onClick={() => navigate(`/manage/candidates/list/${candidate.id}`)}
              leftSection={<IconEye size={15} />}
              size="xs"
            >
              {t('list.table.viewProfile')}
            </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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
                {rows}
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
