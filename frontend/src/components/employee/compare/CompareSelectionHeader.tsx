import { Group, Title, Text, Button } from '@mantine/core';
import { IconX, IconScale } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface CompareSelectionHeaderProps {
  selectedCount: number;
  onClearSelection: () => void;
  onCompare: () => void;
}

/**
 * Header component for the selection view
 * Shows title, description, and action buttons for selecting candidates
 */
export function CompareSelectionHeader({
  selectedCount,
  onClearSelection,
  onCompare,
}: CompareSelectionHeaderProps) {
  const { t } = useTranslation('candidates');
  return (
    <Group justify="space-between" align="flex-end">
      <div>
        <Title order={2}>{t('compare.title')}</Title>
        <Text c="dimmed" size="sm">{t('compare.subtitle')}</Text>
      </div>
      <Group gap="sm">
        <Button
          variant="subtle"
          color="gray"
          onClick={onClearSelection}
          disabled={selectedCount === 0}
          leftSection={<IconX size={16} />}
        >
          {t('compare.buttons.clear')}
        </Button>
        <Button
          leftSection={<IconScale size={20} />}
          disabled={selectedCount < 2}
          onClick={onCompare}
        >
          {t('compare.buttons.compare')}
        </Button>
      </Group>
    </Group>
  );
}
