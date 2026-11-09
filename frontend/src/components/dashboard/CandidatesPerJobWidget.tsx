import { Box, Title, Stack, Group, Text, Progress } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface CandidatesPerJobWidgetProps {
  candidatesPerJob: Array<{ jobTitle: string; count: number }>;
  maxCandidates: number;
  isDark: boolean;
}

const BAR_COLORS = ['blue', 'violet', 'teal', 'orange', 'pink', 'indigo'];

export function CandidatesPerJobWidget({
  candidatesPerJob,
  maxCandidates,
  isDark,
}: CandidatesPerJobWidgetProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Box
      style={{
        borderRadius: 16,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark
          ? 'linear-gradient(160deg, #1e293b 0%, #0f172a 100%)'
          : '#ffffff',
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(15,23,42,0.05)',
        padding: '24px',
      }}
    >
      <Title order={4} mb="lg" fw={700} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
        {t('candidatesPerJob.title')}
      </Title>
      <Stack gap="md" justify="center" h="100%">
        {candidatesPerJob.length > 0 ? (
          candidatesPerJob.map((item, i) => {
            const col = BAR_COLORS[i % BAR_COLORS.length];
            return (
              <div key={item.jobTitle}>
                <Group justify="space-between" mb={6}>
                  <Text size="sm" fw={500} lineClamp={1} style={{ maxWidth: 200 }} title={item.jobTitle}>
                    {item.jobTitle}
                  </Text>
                  <Text size="xs" fw={700} c={`${col}.6`}>{item.count}</Text>
                </Group>
                <Progress
                  value={maxCandidates > 0 ? (item.count / maxCandidates) * 100 : 0}
                  size="sm"
                  radius="xl"
                  color={col}
                />
              </div>
            );
          })
        ) : (
          <Text c="dimmed" ta="center">
            {t('candidatesPerJob.empty', 'No hay datos suficientes')}
          </Text>
        )}
      </Stack>
    </Box>
  );
}

