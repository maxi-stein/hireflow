import {
  Paper,
  Table,
  Badge,
  Group,
  Pagination,
  LoadingOverlay,
  ActionIcon,
  Tooltip,
  TextInput,
  Text,
  Title,
  Select,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import { useDebouncedValue } from '@mantine/hooks';
import { useAllCandidateApplicationsQuery } from '../../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { IconEye, IconScale, IconSearch, IconStarFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { useCandidateTechExperience } from '../../../hooks/useCandidateTechExperience';

export function JobApplicationsTable({
  jobOfferId,
  jobTitle,
  deadline,
}: {
  jobOfferId: string;
  jobTitle: string;
  deadline?: string | null;
}) {
  const { t } = useTranslation(['applications', 'candidates', 'common']);
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Paginate the list of applications
  const [page, setPage] = useState(1);

  // Search applications (with debounce)
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 500);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: allApplications, isLoading } = useAllCandidateApplicationsQuery({
    page,
    limit: 5, // Show 5 per job posting to save space
    job_offer_id: jobOfferId,
    search: debouncedSearch,
    status: statusFilter !== 'all' ? [statusFilter as ApplicationStatus] : undefined,
    exclude_status: ApplicationStatus.HIRED,
  });

  // Calculate top candidate stats for skills in this job offer
  const techStats = useCandidateTechExperience(allApplications?.data || []);

  if (!isLoading && (!allApplications || allApplications.data.length === 0) && !search && !debouncedSearch) {
    return null; // Don't show table if no applications and no search active
  }

  // Sort applications
  const sortedApplications = allApplications?.data
    .slice()
    .sort((a, b) => {
      // Define status priority: IN_PROGRESS > APPLIED > HIRED > REJECTED
      const statusPriority: Record<ApplicationStatus, number> = {
        [ApplicationStatus.IN_PROGRESS]: 1,
        [ApplicationStatus.APPLIED]: 2,
        [ApplicationStatus.HIRED]: 3,
        [ApplicationStatus.REJECTED]: 4,
      };

      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];

      // If same priority, sort by updated date (newest first)
      if (priorityDiff === 0) {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }

      return priorityDiff;
    }) || [];

  const rows = sortedApplications.map((application) => (
    <Table.Tr key={application.id}>
      {/* 1. Candidate Info */}
      <Table.Td>
        <Group gap="sm" wrap="nowrap">
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            size="sm"
          />
          <Box style={{ minWidth: 0 }}>
            <Text fw={600} size="sm" lineClamp={1}>
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {application.candidate.user.email}
            </Text>
          </Box>
        </Group>
      </Table.Td>

      {/* 2. Applied Date */}
      <Table.Td>
        <Text size="sm">
          {new Date(application.created_at).toLocaleDateString()}
        </Text>
      </Table.Td>

      {/* 3. Status */}
      <Table.Td>
        <Badge color={getApplicationStatusColor(application.status)} variant="light" size="sm">
          {t('common:applicationStatus.' + application.status)}
        </Badge>
      </Table.Td>

      {/* 4. Skills & Experience Answers (Widest column) */}
      <Table.Td>
        {application.skill_answers && application.skill_answers.length > 0 ? (
          <Group gap={6} wrap="wrap">
            {application.skill_answers.map((answer) => {
              const years = answer.years_of_experience;
              const skillName = answer.job_offer_skill.skill_name;
              const isTop = techStats ? techStats.isTopCandidateForSkill(skillName, years) : false;

              return (
                <Box
                  key={answer.id}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '3px 8px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#f8fafc',
                    border: `1px solid ${
                      isTop
                        ? (isDark ? 'rgba(245, 158, 11, 0.4)' : '#fde68a')
                        : (isDark ? '#334155' : '#e2e8f0')
                    }`,
                    fontSize: '0.75rem',
                    lineHeight: 1.2,
                  }}
                >
                  {isTop && (
                    <Box style={{ color: '#f59e0b', display: 'flex', alignItems: 'center' }}>
                      <IconStarFilled size={11} />
                    </Box>
                  )}
                  <Text size="xs" fw={600} c={isDark ? '#f1f5f9' : '#0f172a'}>
                    {skillName}
                  </Text>
                  <Badge
                    size="xs"
                    variant={isTop ? 'filled' : 'light'}
                    color={
                      isTop
                        ? 'yellow'
                        : years >= 5
                        ? 'teal'
                        : years >= 3
                        ? 'blue'
                        : years >= 1
                        ? 'cyan'
                        : 'gray'
                    }
                    radius="sm"
                    style={{
                      fontWeight: 700,
                      paddingLeft: 5,
                      paddingRight: 5,
                      height: 18,
                      textTransform: 'none',
                    }}
                  >
                    {years}{' '}
                    {years === 1
                      ? t('compare.card.year', { ns: 'candidates', defaultValue: 'año' })
                      : t('compare.card.years', { ns: 'candidates', defaultValue: 'años' })}
                  </Badge>
                </Box>
              );
            })}
          </Group>
        ) : (
          <Text size="xs" c="dimmed" fs="italic">
            {t('table.emptyStates.noSkills', { defaultValue: 'Sin habilidades registradas' })}
          </Text>
        )}
      </Table.Td>

      {/* 5. Actions */}
      <Table.Td>
        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <Tooltip label={t('table.tooltips.viewCandidate')}>
            <ActionIcon
              variant="light"
              color="blue"
              title={t('table.tooltips.viewCandidate')}
              onClick={() => navigate(`/manage/candidates/list/${application.candidate.id}`)}
            >
              <IconEye size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label={t('table.tooltips.compareCandidate')}>
            <ActionIcon
              variant="light"
              color="violet"
              title="Compare"
              onClick={() => navigate(`/manage/candidates/compare?jobOfferId=${jobOfferId}&candidateId=${application.candidate.id}`)}
            >
              <IconScale size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Paper withBorder radius="md" p="md" pos="relative" mb="lg">
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      <Group justify="space-between" mb="md" wrap="wrap" gap="md">
        <Box>
          <Title order={4}>{jobTitle}</Title>
          {deadline && (
            <Text size="xs" c="red" mt={2}>
              {t('table.deadline')} {new Date(deadline).toLocaleDateString()}
            </Text>
          )}
        </Box>
        <Group wrap="wrap">
          <Select
            placeholder={t('table.filters.statusPlaceholder')}
            data={[
              { value: 'all', label: t('table.filters.allStatuses') },
              { value: ApplicationStatus.APPLIED, label: t('table.filters.applied') },
              { value: ApplicationStatus.IN_PROGRESS, label: t('table.filters.inProgress') },
              { value: ApplicationStatus.REJECTED, label: t('table.filters.rejected') },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || 'all')}
            size="xs"
            w={150}
          />
          <TextInput
            placeholder={t('table.filters.searchPlaceholder')}
            leftSection={<IconSearch size={14} />}
            size="xs"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <Badge variant="outline">{allApplications?.pagination.total} {t('table.applicationsBadge')}</Badge>
        </Group>
      </Group>

      <Table.ScrollContainer minWidth={850}>
        <Table verticalSpacing="sm" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '22%' }}>{t('table.headers.candidate')}</Table.Th>
              <Table.Th style={{ width: '13%' }}>{t('table.headers.appliedDate')}</Table.Th>
              <Table.Th style={{ width: '12%' }}>{t('table.headers.status')}</Table.Th>
              <Table.Th style={{ width: '43%' }}>
                {t('table.headers.skills', { defaultValue: 'Habilidades y Experiencia' })}
              </Table.Th>
              <Table.Th style={{ width: '10%', textAlign: 'right' }}>{t('table.headers.actions')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows}
            {!isLoading && allApplications?.data.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" c="dimmed" py="sm">
                    {search ? t('table.emptyStates.noMatch') : t('table.emptyStates.noApplications')}
                  </Text>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>

      {allApplications && allApplications.pagination.totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            total={allApplications.pagination.totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      )}
    </Paper>
  );
}
