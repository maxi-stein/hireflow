import { Group, Title, Text, Button, Badge } from '@mantine/core';
import { IconX, IconScale } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface CompareSelectionHeaderProps {
  selectedCount: number;
  onClearSelection: () => void;
  onCompare: () => void;
}

export function CompareSelectionHeader({
  selectedCount,
  onClearSelection,
  onCompare,
}: CompareSelectionHeaderProps) {
  const { t } = useTranslation('candidates');

  return (
    <Group justify="space-between" align="flex-end" wrap="wrap" gap="lg">
      <div>
        <Title order={2}>{t('compare.title')}</Title>
        <Text c="dimmed" size="sm" mt={4}>{t('compare.subtitle')}</Text>
      </div>

      <Group gap="md" align="center">

        <Button
          variant="subtle"
          color="gray"
          onClick={onClearSelection}
          disabled={selectedCount === 0}
          leftSection={<IconX size={15} />}
          size="sm"
        >
          {t('compare.buttons.clear')}
        </Button>

        <Button
          leftSection={<IconScale size={18} />}
          disabled={selectedCount < 2}
          onClick={onCompare}
          size="sm"
          style={{
            background: selectedCount >= 2
              ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
              : undefined,
          }}
        >
          {t('compare.buttons.compare')}
          {selectedCount >= 2 && (
            <Badge size="xs" circle ml="xs" color="white" style={{ color: '#2563eb', fontWeight: 800 }}>
              {selectedCount}
            </Badge>
          )}
        </Button>
      </Group>
    </Group>
  );
}
