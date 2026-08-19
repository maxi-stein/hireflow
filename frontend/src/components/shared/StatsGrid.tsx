import { SimpleGrid, Card, Group, Text } from '@mantine/core';

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
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
      {stats.map((stat) => (
        <Card withBorder p="md" radius="md" key={stat.label}>
          <Group>
            <stat.icon size={28} stroke={1.5} color={`var(--mantine-color-${stat.color}-6)`} />
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
            </div>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
};
