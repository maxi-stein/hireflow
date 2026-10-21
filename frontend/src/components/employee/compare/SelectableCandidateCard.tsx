import { memo } from 'react';
import { Group, Checkbox, Badge, Text, Box, useMantineColorScheme } from '@mantine/core';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { useTranslation } from 'react-i18next';

export interface SelectableCandidateCardProps {
  application: CandidateApplication;
  isSelected: boolean;
  onToggle: () => void;
  isDark: boolean;
}

function SelectableCandidateCardComponent({
  application,
  isSelected,
  onToggle,
  isDark,
}: SelectableCandidateCardProps) {
  const { t } = useTranslation('common');

  return (
    <Box
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        padding: '10px 14px',
        borderRadius: 12,
        border: `1px solid ${
          isSelected
            ? (isDark ? '#3b82f6' : '#93c5fd')
            : (isDark ? '#334155' : '#e2e8f0')
        }`,
        background: isSelected
          ? (isDark ? 'rgba(59,130,246,0.12)' : '#eff6ff')
          : (isDark ? '#1e293b' : '#ffffff'),
        transition: 'all 0.15s ease',
        boxShadow: isSelected
          ? (isDark ? '0 0 0 1px #3b82f6 inset' : '0 0 0 1px #93c5fd inset')
          : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.background = isDark
            ? '#263347'
            : '#f8faff';
          (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#475569' : '#cbd5e1';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLElement).style.background = isDark ? '#1e293b' : '#ffffff';
          (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#334155' : '#e2e8f0';
        }
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          <Checkbox
            checked={isSelected}
            onChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            color="blue"
            radius="sm"
          />
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            size="sm"
          />
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} size="sm" truncate>
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed" truncate>{application.candidate.user.email}</Text>
          </Box>
        </Group>
        <Badge
          color={getApplicationStatusColor(application.status)}
          variant="light"
          size="sm"
          radius="md"
          style={{ flexShrink: 0 }}
        >
          {t('applicationStatus.' + application.status)}
        </Badge>
      </Group>
    </Box>
  );
}

export const SelectableCandidateCard = memo(SelectableCandidateCardComponent);
