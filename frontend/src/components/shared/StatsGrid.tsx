import { SimpleGrid, Text, ThemeIcon, Group } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { CardBox } from './CardBox';

export interface StatItem {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      {stats.map((stat) => (
        <CardBox
          key={stat.label}
          px="lg"
          py="md"
          isDark={isDark}
          variant="gradient"
          style={{
            boxShadow: isDark
              ? '0 2px 12px rgba(0,0,0,0.3)'
              : '0 2px 12px rgba(15,23,42,0.06)',
            background: isDark
              ? 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = isDark
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(15,23,42,0.1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = isDark
              ? '0 2px 12px rgba(0,0,0,0.3)'
              : '0 2px 12px rgba(15,23,42,0.06)';
          }}
        >
          <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
            <Group gap="sm" align="center" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              <ThemeIcon
                size={42}
                radius="xl"
                variant="light"
                color={stat.color}
                style={{
                  background: `var(--mantine-color-${stat.color}-light)`,
                  flexShrink: 0,
                }}
              >
                <stat.icon size={22} stroke={1.8} />
              </ThemeIcon>
              <Text size="sm" fw={600} c="dimmed" lineClamp={2} style={{ lineHeight: 1.25 }}>
                {stat.label}
              </Text>
            </Group>
            <Text fw={800} size="1.6rem" lh={1} style={{ color: isDark ? '#f8fafc' : '#0f172a', flexShrink: 0 }}>
              {stat.value}
            </Text>
          </Group>
        </CardBox>
      ))}
    </SimpleGrid>
  );
};
