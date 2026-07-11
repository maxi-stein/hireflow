import { Group, Title, Text, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export interface ComparisonViewHeaderProps {
  candidateCount: number;
  onBack: () => void;
  title?: string;
}

/**
 * Header component for the comparison view
 * Displays the number of candidates being compared and a back button
 */
export function ComparisonViewHeader({ candidateCount, onBack, title }: ComparisonViewHeaderProps) {
  const { t } = useTranslation('candidates');
  return (
    <Group justify="space-between" mb="lg">
      <div>
        <Title order={2}>{title || t('compare.viewTitle')}</Title>
        <Text c="dimmed" size="sm">{t('compare.viewSubtitle', { count: candidateCount })}</Text>
      </div>
      <Button variant="default" onClick={onBack}>
        {t('compare.buttons.back')}
      </Button>
    </Group>
  );
}
