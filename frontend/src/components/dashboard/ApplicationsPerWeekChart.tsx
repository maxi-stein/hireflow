import { Box, Title, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useTranslation } from 'react-i18next';

interface ApplicationsPerWeekChartProps {
  data: Array<{ date: string; count: number }>;
  isDark: boolean;
}

export function ApplicationsPerWeekChart({ data, isDark }: ApplicationsPerWeekChartProps) {
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
        {t('applicationsPerWeek.title')}
      </Title>
      {data && data.length > 0 ? (
        <LineChart
          h={220}
          data={data}
          dataKey="date"
          withDots
          curveType="monotone"
          gridAxis="y"
          withXAxis
          withYAxis
          series={[{ name: 'count', color: 'blue.5', label: t('applicationsPerWeek.label') }]}
          styles={{
            root: { fontFamily: 'inherit' },
          }}
        />
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          {t('applicationsPerWeek.empty')}
        </Text>
      )}
    </Box>
  );
}

