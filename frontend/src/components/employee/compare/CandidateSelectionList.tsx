import { Stack, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { SelectableCandidateCard } from './SelectableCandidateCard';
import type { CandidateApplication } from '../../../services/candidate-application.service';

export interface CandidateSelectionListProps {
  candidates: CandidateApplication[];
  selectedCandidates: Set<string>;
  onCandidateToggle: (candidateId: string) => void;
  isDark: boolean;
}

/**
 * List of selectable candidate cards
 * Shows an empty state when no candidates are available
 */
export function CandidateSelectionList({
  candidates,
  selectedCandidates,
  onCandidateToggle,
  isDark,
}: CandidateSelectionListProps) {
  if (candidates.length === 0) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
        No candidates available for comparison
      </Alert>
    );
  }

  return (
    <Stack gap="xs">
      {candidates.map(application => (
        <SelectableCandidateCard
          key={`${application.candidate.id}-${application.id}`}
          application={application}
          isSelected={selectedCandidates.has(application.candidate.id)}
          onToggle={() => onCandidateToggle(application.candidate.id)}
          isDark={isDark}
        />
      ))}
    </Stack>
  );
}
