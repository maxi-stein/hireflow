import { Title, Text } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useTranslation } from 'react-i18next';
import { CardBox } from '../shared/CardBox';

interface ApplicationsPerWeekChartProps {
  data: Array<{ date: string; count: number }>;
  isDark: boolean;
}

export function ApplicationsPerWeekChart({ data, isDark }: ApplicationsPerWeekChartProps) {
  const { t } = useTranslation('dashboard');

  return (
    <CardBox isDark={isDark} variant="gradient" style={{ padding: '24px' }}>
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
    </CardBox>
  );
}

