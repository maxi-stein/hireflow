import { memo } from 'react';
import { Paper, Group, Checkbox, Badge, Text } from '@mantine/core';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { getApplicationStatusColor } from '../../../utils/application.utils';
import type { CandidateApplication } from '../../../services/candidate-application.service';

export interface SelectableCandidateCardProps {
  application: CandidateApplication;
  isSelected: boolean;
  onToggle: () => void;
  isDark: boolean;
}

/**
 * Individual candidate card with checkbox selection
 * Displays avatar, name, email, and application status
 * Memoized to prevent unnecessary re-renders when other candidates change
 */
function SelectableCandidateCardComponent({
  application,
  isSelected,
  onToggle,
  isDark,
}: SelectableCandidateCardProps) {
  return (
    <Paper
      p="sm"
      withBorder
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDark
          ? 'var(--mantine-color-dark-6)'
          : 'var(--mantine-color-gray-0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '';
      }}
    >
      <Group justify="space-between">
        <Group>
          <Checkbox
            checked={isSelected}
            onChange={onToggle}
            onClick={(e) => e.stopPropagation()}
          />
          <CandidateAvatar
            candidateId={application.candidate.id}
            firstName={application.candidate.user.first_name}
            lastName={application.candidate.user.last_name}
            radius="xl"
          />
          <div>
            <Text fw={500}>
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            <Text size="xs" c="dimmed">{application.candidate.user.email}</Text>
          </div>
        </Group>
        <Badge color={getApplicationStatusColor(application.status)} variant="light">
          {application.status}
        </Badge>
      </Group>
    </Paper>
  );
}

export const SelectableCandidateCard = memo(SelectableCandidateCardComponent);
