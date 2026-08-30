import { Group, Paper, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { CandidateAvatar } from '../../../components/shared/candidate-display/CandidateAvatar';
import { type TimeDisplayColor, TimeDisplay } from '../../../components/shared/TimeDisplay';
import { getDateHeader } from '../../../utils/date-utils';

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
    <div>
      <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="xs" mt="sm">
        {getDateHeader(date)}
      </Text>
      <Paper p="md" withBorder radius="md" style={{ transition: 'transform 0.2s' }}>
        <Group justify="space-between" wrap="nowrap">
          {/* Left: Avatar + Details */}
          <Group gap="md" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
            <CandidateAvatar
              candidateId={candidateId}
              firstName={candidateName.split(' ')[0]}
              lastName={candidateName.split(' ')[1] || ''}
              size={42}
            />
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Text size="sm" fw={600} truncate="end">
                {candidateName}
              </Text>
              <Text size="xs" c="dimmed" truncate="end" mt={2}>
                {position}
              </Text>
            </div>
          </Group>

          {/* Right: Time + Action */}
          <Group gap="md" wrap="nowrap" style={{ flexShrink: 0 }}>
            <TimeDisplay
              date={date}
              variant="time-only"
              color={color || 'blue'}
              size="sm"
            />
            {action}
          </Group>
        </Group>
      </Paper>
    </div>
  );
};
