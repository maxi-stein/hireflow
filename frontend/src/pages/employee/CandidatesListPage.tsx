import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Pagination,
  Stack,
  TextInput,
  Select,
  Table,
  Tooltip,
  LoadingOverlay,
  Button
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
    setPage(1); // Reset to first page on search
  };

  const handleSortChange = (value: string | null) => {
    if (value === 'updated_at' || value === 'last_name') {
      setSortBy(value);
      setPage(1);
    }
  };

  const rows = candidatesData?.data.map((candidate) => (
    <Table.Tr key={candidate.id} >
      <Table.Td>
        <Group gap="sm" style={{ margin: '10px 5px' }}>
          <CandidateAvatar
            candidateId={candidate.id}
            firstName={candidate.user.first_name}
            lastName={candidate.user.last_name}
            size="lg"
          />
          <div>
            <Text fw={500}>
              {candidate.user.first_name} {candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{candidate.user.email}</Text>
          </div>
        </Group>
      </Table.Td>
      <Table.Td>
        {candidate.headline ? (
          <Text size="sm">{candidate.headline}</Text>
        ) : (
          <Text size="sm" c="dimmed">{t('na', { ns: 'common' })}</Text>
        )}
      </Table.Td>
      <Table.Td>
        {(() => {
          const applications = (candidate.applications || []).filter((app: any) => app.status !== 'REJECTED');
          if (applications.length === 0) {
            return (
              <Paper p="xs" radius="sm" bg="var(--mantine-color-gray-light)" c="var(--mantine-color-gray-light-color)" bd="1px solid var(--mantine-color-gray-light-color)" shadow="none">
                <Text size="sm" fw={500}>{t('list.table.noApplications')}</Text>
              </Paper>
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
              <Paper p="xs" radius="sm" bg="var(--mantine-color-blue-light)" c="var(--mantine-color-blue-light-color)" bd="1px solid var(--mantine-color-blue-light-color)" shadow="none">
                <Text size="sm" fw={600}>{latestInterview.title}</Text>
                <Text size="xs" mt={2} opacity={0.8}>
                  {jobOfferForInterview?.position}
                  {remainingAppsCount > 0 && ` ${t('list.table.moreApplications', { count: remainingAppsCount })}`}
                </Text>
              </Paper>
            );
          }

          const latestApp = applications[applications.length - 1];
          return (
            <Paper p="xs" radius="sm" bg="var(--mantine-color-green-light)" c="var(--mantine-color-green-light-color)" bd="1px solid var(--mantine-color-green-light-color)" shadow="none">
              <Text size="sm" fw={600}>{t('list.table.applicationsCount', { count: applications.length })}</Text>
              <Text size="xs" mt={2} opacity={0.8}>
                {latestApp.job_offer?.position}
                {remainingAppsCount > 0 && ` ${t('list.table.moreApplications', { count: remainingAppsCount })}`}
              </Text>
            </Paper>
          );
        })()}
      </Table.Td>
      <Table.Td>
        {/* Update date */}
        <Text size="sm">{new Date(candidate.profile_updated_at).toLocaleDateString()}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <Tooltip label={t('table.tooltips.viewCandidate', { ns: 'applications' })}>
            <Button
              variant="light"
              color="blue"
              onClick={() => navigate(`/manage/candidates/list/${candidate.id}`)}
              leftSection={<IconEye size={18} />}
              size="xs"
            >
              {t('list.table.viewProfile')}
            </Button>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr >
  ));

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={2}>{t('list.title')}</Title>
            <Text c="dimmed" size="sm">
              {t('list.subtitle')}
            </Text>
          </div>
        </Group>

        <Paper p="md" withBorder radius="md">
          <Group justify="space-between" mb="md">
            <TextInput
              placeholder={t('list.searchPlaceholder')}
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={handleSearchChange}
              w={300}
            />
            <Select
              label={t('list.sort.label')}
              placeholder={t('list.sort.placeholder')}
              leftSection={sortBy === 'updated_at' ? <IconSortDescending size={16} /> : <IconSortAscending size={16} />}
              data={[
                { value: 'updated_at', label: t('list.sort.updatedAt') },
                { value: 'last_name', label: t('list.sort.lastName') },
              ]}
              value={sortBy}
              onChange={handleSortChange}
              allowDeselect={false}
              w={200}
            />
          </Group>

          <Paper pos="relative" mih={300}>
            <LoadingOverlay visible={isLoading} zIndex={100} overlayProps={{ radius: "sm", blur: 2 }} />

            <Table horizontalSpacing="md" verticalSpacing="sm" highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w="30%">{t('list.table.candidate')}</Table.Th>
                  <Table.Th w="20%">{t('list.table.profile')}</Table.Th>
                  <Table.Th w="30%">{t('list.table.applications')}</Table.Th>
                  <Table.Th w="10%">{t('list.table.lastUpdated')}</Table.Th>
                  <Table.Th w="10%" style={{ textAlign: 'right' }}>{t('list.table.actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows}
                {!isLoading && candidatesData?.data.length === 0 && (
                  <Table.Tr>
                    <Table.Td colSpan={5}>
                      <Stack align="center" py="xl" gap="xs">
                        <IconUser size={40} color="gray" style={{ opacity: 0.5 }} />
                        <Text c="dimmed">{t('list.table.empty')}</Text>
                      </Stack>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Paper>

          {candidatesData && candidatesData.pagination.totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                total={candidatesData.pagination.totalPages}
                value={page}
                onChange={setPage}
              />
            </Group>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
