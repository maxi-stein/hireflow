import { Box, Title, Group, Button, Stack, Text } from '@mantine/core';
import { CardBox } from '../shared/CardBox';
import { IconExternalLink } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { DashboardListItem } from './DashboardListItem';

interface PendingReviewsWidgetProps {
  pendingReviews: any[];
  isDark: boolean;
  onViewAll: () => void;
}

export function PendingReviewsWidget({
  pendingReviews,
  isDark,
  onViewAll,
}: PendingReviewsWidgetProps) {
  const { t } = useTranslation('dashboard');

  return (
    <CardBox isDark={isDark} variant="gradient" style={{ padding: '24px' }}>
      <Group justify="space-between" mb="lg">
        <Title order={4} fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
          {t('pendingReviews.title')}
        </Title>
        <Button
          variant="subtle"
          size="xs"
          rightSection={<IconExternalLink size={13} />}
          onClick={onViewAll}
          style={{ fontWeight: 600 }}
        >
          {t('pendingReviews.viewAll')}
        </Button>
      </Group>

      {pendingReviews.length === 0 ? (
        <Box
          py="xl"
          style={{
            textAlign: 'center',
            borderRadius: 12,
            border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
          }}
        >
          <Text c="dimmed" size="sm">{t('pendingReviews.empty')}</Text>
        </Box>
      ) : (
        <Stack gap={2}>
          {pendingReviews.flatMap((interview) => {
            return (interview.applications || []).map((app: any) => {
              const candidate = app.candidate;
              const jobOffer = app.job_offer;

              if (!candidate || !jobOffer) return null;

              return (
                <DashboardListItem
                  key={`${interview.id}-${app.id}`}
                  date={interview.scheduled_time}
                  candidateName={`${candidate.user?.first_name} ${candidate.user?.last_name}`}
                  candidateId={candidate.id}
                  color="orange"
                  position={jobOffer.position}
                />
              );
            });
          })}
        </Stack>
      )}
    </CardBox>
  );
}

