import { Group, Title, Text, Button } from '@mantine/core';

export interface ComparisonViewHeaderProps {
  candidateCount: number;
  onBack: () => void;
}

/**
 * Header component for the comparison view
 * Displays the number of candidates being compared and a back button
 */
export function ComparisonViewHeader({ candidateCount, onBack }: ComparisonViewHeaderProps) {
  return (
    <Group justify="space-between" mb="lg">
      <div>
        <Title order={2}>Candidate Comparison</Title>
        <Text c="dimmed" size="sm">Comparing {candidateCount} candidates</Text>
      </div>
      <Button variant="default" onClick={onBack}>
        Back to Selection
      </Button>
    </Group>
  );
}
