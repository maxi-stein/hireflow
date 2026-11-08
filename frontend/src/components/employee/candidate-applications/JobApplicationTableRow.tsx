import { Table, Group, Box, Text, Badge, Tooltip, ActionIcon } from '@mantine/core';
import { IconEye, IconScale, IconStarFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import type { useCandidateTechExperience } from '../../../hooks/useCandidateTechExperience';

interface JobApplicationTableRowProps {
  application: CandidateApplication;
  jobOfferId: string;
  techStats: ReturnType<typeof useCandidateTechExperience> | null;
  isDark: boolean;
}

export function JobApplicationTableRow({
  application,
  jobOfferId,
  techStats,
  isDark,
}: JobApplicationTableRowProps) {
  const { t } = useTranslation(['applications', 'candidates', 'common']);
  const navigate = useNavigate();

  return (
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

      {/* 4. Skills & Experience Answers */}
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
  );
}

