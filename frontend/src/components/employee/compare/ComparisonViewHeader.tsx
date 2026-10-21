import { Group, Title, Text, Button, Box, Badge, useMantineColorScheme } from '@mantine/core';
import { IconChevronLeft, IconScale } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface ComparisonViewHeaderProps {
  candidateCount: number;
  onBack: () => void;
  title?: string;
}

export function ComparisonViewHeader({ candidateCount, onBack, title }: ComparisonViewHeaderProps) {
  const { t } = useTranslation('candidates');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box>
      <Button
        variant="subtle"
        leftSection={<IconChevronLeft size={16} />}
        onClick={onBack}
        mb="md"
        color="gray"
        size="sm"
      >
        {t('compare.buttons.back')}
      </Button>

      <Group justify="space-between" align="center" wrap="wrap" gap="md">
        <Box>
          <Group gap="sm" align="center" mb={4}>
            <Box
              p={8}
              style={{
                borderRadius: 10,
                background: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff',
                display: 'flex',
              }}
            >
              <IconScale size={18} color="#6366f1" />
            </Box>
            <Title order={2} style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
              {title || t('compare.viewTitle')}
            </Title>
          </Group>
          <Text c="dimmed" size="sm">
            {t('compare.viewSubtitle', { count: candidateCount })}
          </Text>
        </Box>

        <Badge
          size="lg"
          radius="md"
          variant="light"
          color="indigo"
          leftSection={<IconScale size={13} />}
        >
          {t('compare.candidateCount', { count: candidateCount })}
        </Badge>
      </Group>
    </Box>
  );
}
