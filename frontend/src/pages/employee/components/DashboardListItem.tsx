import { Group, Paper, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { CandidateAvatar } from '../../../components/shared/candidate-display/CandidateAvatar';
import { type TimeDisplayColor, TimeDisplay } from '../../../components/shared/TimeDisplay';

interface DashboardListItemProps {
  date: string;
  candidateName: string;
  candidateId: string;
  position: string;
  color?: TimeDisplayColor;
  action?: ReactNode;
}

export const DashboardListItem = ({
  date,
  candidateName,
  candidateId,
  position,
  color,
  action,
}: DashboardListItemProps) => {
  return (
    <Paper p="sm" withBorder radius="md" style={{ transition: 'transform 0.2s' }}>
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md">
          <TimeDisplay
            date={date}
            variant="time-only"
            color={color || 'blue'}
            size="sm"
          />
          <div>
            <Group gap="xs" mb={2}>
              <CandidateAvatar
                candidateId={candidateId}
                firstName={candidateName.split(' ')[0]}
                lastName={candidateName.split(' ')[1] || ''}
                size={24}
              />
              <Text size="sm" fw={600}>
                {candidateName}
              </Text>
            </Group>
            <Text size="xs" c="dimmed">
              {position}
            </Text>
          </div>
        </Group>
        {action}
      </Group>
    </Paper>
  );
};
