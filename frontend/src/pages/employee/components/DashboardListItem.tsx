import { Group, Text, useMantineColorScheme } from '@mantine/core';
import type { ReactNode } from 'react';
import { CandidateAvatar } from '../../../components/shared/candidate-display/CandidateAvatar';
import { type TimeDisplayColor, TimeDisplay } from '../../../components/shared/TimeDisplay';
import { getDateHeader } from '../../../utils/date-utils';
import { useNavigate } from 'react-router-dom';

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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();

  return (
    <div>
      <Text size="xs" fw={600} c="dimmed" mb="xs" mt="sm" style={{ letterSpacing: '0.02em' }}>
        {getDateHeader(date)}
      </Text>
      <div
        onClick={() => navigate(`/manage/candidates/list/${candidateId}`)}
        style={{
          padding: '12px 16px',
          borderRadius: 12,
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          background: isDark ? '#1e293b' : '#ffffff',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = isDark ? '#263347' : '#f8faff';
          (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#3b82f6' : '#93c5fd';
          (e.currentTarget as HTMLElement).style.transform = 'translateX(2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = isDark ? '#1e293b' : '#ffffff';
          (e.currentTarget as HTMLElement).style.borderColor = isDark ? '#334155' : '#e2e8f0';
          (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          {/* Left: Avatar + Details */}
          <Group gap="sm" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
            <CandidateAvatar
              candidateId={candidateId}
              firstName={candidateName.split(' ')[0]}
              lastName={candidateName.split(' ')[1] || ''}
              size={44}
            />
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <Text size="sm" fw={600} truncate="end" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {candidateName}
              </Text>
              <Text size="xs" c="dimmed" truncate="end" mt={2}>
                {position}
              </Text>
            </div>
          </Group>

          {/* Right: Time + Action */}
          <Group gap="sm" wrap="nowrap" style={{ flexShrink: 0 }}>
            <TimeDisplay
              date={date}
              variant="time-only"
              color={color || 'blue'}
              size="md"
            />
            {action}
          </Group>
        </Group>
      </div>
    </div>
  );
};
