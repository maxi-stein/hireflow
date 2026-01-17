import { Group, Title, Text, Button } from '@mantine/core';
import { IconX, IconScale } from '@tabler/icons-react';

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
  return (
    <Group justify="space-between" align="flex-end">
      <div>
        <Title order={2}>Compare Candidates</Title>
        <Text c="dimmed" size="sm">Select candidates from a job offer to compare</Text>
      </div>
      <Group gap="sm">
        <Button
          variant="subtle"
          color="gray"
          onClick={onClearSelection}
          disabled={selectedCount === 0}
          leftSection={<IconX size={16} />}
        >
          Clear Selection
        </Button>
        <Button
          leftSection={<IconScale size={20} />}
          disabled={selectedCount < 2}
          onClick={onCompare}
        >
          Compare Candidates
        </Button>
      </Group>
    </Group>
  );
}
