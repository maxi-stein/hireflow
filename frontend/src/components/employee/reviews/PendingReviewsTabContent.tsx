import { Paper, Box, Text, Group, Stack, Badge, useMantineColorScheme } from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Interview } from '../../../services/interview.service';
import { groupPendingReviewsByDate } from './groupPendingReviewsByDate';
import { ReviewDateGroup } from './ReviewDateGroup';
import { PendingReviewCard } from './PendingReviewCard';

export interface PendingReviewsTabContentProps {
  filteredPendingReviews: Interview[];
  onReviewClick: (interviewId: string) => void;
}

export const PendingReviewsTabContent = ({
  filteredPendingReviews,
  onReviewClick,
}: PendingReviewsTabContentProps) => {
  const { t } = useTranslation(['reviews']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const pendingGroups = groupPendingReviewsByDate(filteredPendingReviews);

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      bg="light-dark(#ffffff, #1e293b)"
      style={{
        borderColor: 'light-dark(#e2e8f0, #334155)',
        boxShadow: isDark
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
          : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      {filteredPendingReviews.length === 0 ? (
        <Paper
          p="3rem"
          radius="md"
          ta="center"
          style={{
            border: '2px dashed light-dark(#e2e8f0, #334155)',
            backgroundColor: 'light-dark(#f8fafc, #0f172a)',
          }}
        >
          <Box
            p={12}
            bg="light-dark(#ffffff, #1e293b)"
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              margin: '0 auto 12px',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              color: '#2563eb',
            }}
          >
            <IconClipboardCheck size={28} />
          </Box>
          <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
            {t('empty.pending')}
          </Text>
        </Paper>
      ) : (
        pendingGroups.map(group => (
          <ReviewDateGroup key={group.dateKey} dateKey={group.dateKey}>
            {group.positions.map(({ position, candidates }) => (
              <Box key={position} mb="md">
                <Group gap="xs" mb="sm" pl="xs">
                  <Badge variant="light" color="teal" size="lg" radius="md">
                    {position}
                  </Badge>
                </Group>
                <Stack gap="sm">
                  {candidates.map(({ candidateId, interviews }) => (
                    <PendingReviewCard
                      key={candidateId}
                      candidateId={candidateId}
                      interviews={interviews}
                      onReviewClick={onReviewClick}
                    />
                  ))}
                </Stack>
              </Box>
            ))}
          </ReviewDateGroup>
        ))
      )}
    </Paper>
  );
};

