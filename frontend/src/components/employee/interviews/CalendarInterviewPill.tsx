import { Box, Group, Text } from '@mantine/core';
import { IconVideo, IconUsers } from '@tabler/icons-react';
import { type Interview, InterviewType } from '../../../services/interview.service';

interface CalendarInterviewPillProps {
  interview: Interview;
  onClick: (interview: Interview) => void;
}

export function CalendarInterviewPill({ interview, onClick }: CalendarInterviewPillProps) {
  return (
    <Box
      p="4px 6px"
      bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
      style={{
        borderRadius: 6,
        cursor: 'pointer',
        border: '1px solid light-dark(#bfdbfe, rgba(37, 99, 235, 0.3))',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      onClick={() => onClick(interview)}
    >
      <Group gap={4} wrap="nowrap">
        <IconVideo size={11} color="#2563eb" />
        <Text size="xs" truncate fw={700} c="light-dark(#1d4ed8, #93c5fd)">
          {new Date(interview.scheduled_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Text>
      </Group>
      {interview.title && (
        <Text size="xs" truncate fw={600} c="light-dark(#1d4ed8, #93c5fd)" style={{ opacity: 0.85 }}>
          {interview.title}
        </Text>
      )}
      {interview.type === InterviewType.GROUP ? (
        <Group gap={3} wrap="nowrap">
          <IconUsers size={10} color="#2563eb" style={{ flexShrink: 0 }} />
          <Text size="xs" truncate fw={500} c="light-dark(#1e40af, #bfdbfe)">
            {interview.applications
              .map((app) => `${app.candidate.user.first_name} ${app.candidate.user.last_name}`)
              .join(', ')}
          </Text>
        </Group>
      ) : (
        <Text size="xs" truncate fw={500} c="light-dark(#1e40af, #bfdbfe)">
          {interview.applications[0]?.candidate.user.first_name}{' '}
          {interview.applications[0]?.candidate.user.last_name}
        </Text>
      )}
    </Box>
  );
}

