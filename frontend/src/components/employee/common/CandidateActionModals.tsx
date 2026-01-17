import { Text } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { ConfirmActionModal } from '../../common/ConfirmActionModal';
import type { CandidateActionTarget } from '../../../hooks/useCandidateActions';

export interface CandidateActionModalsProps {
  // Reject modal
  candidateToReject: CandidateActionTarget | null;
  onRejectClose: () => void;
  onRejectConfirm: () => Promise<void>;
  isRejecting: boolean;
  rejectMessage?: React.ReactNode;

  // Hire modal
  candidateToHire: CandidateActionTarget | null;
  onHireClose: () => void;
  onHireConfirm: () => Promise<void>;
  isHiring: boolean;
  hireMessage?: React.ReactNode;
}

/**
 * Reusable component that renders both reject and hire confirmation modals
 * Used across multiple employee pages for consistent candidate action UX
 */
export function CandidateActionModals({
  candidateToReject,
  onRejectClose,
  onRejectConfirm,
  isRejecting,
  rejectMessage,
  candidateToHire,
  onHireClose,
  onHireConfirm,
  isHiring,
  hireMessage,
}: CandidateActionModalsProps) {
  return (
    <>
      {/* Reject Confirmation Modal */}
      <ConfirmActionModal
        opened={!!candidateToReject}
        onClose={onRejectClose}
        onConfirm={onRejectConfirm}
        title="Reject Candidate"
        message={
          rejectMessage || (
            <Text>
              Are you sure you want to reject <strong>{candidateToReject?.name}</strong>?
              <br /><br />
              This will change their application status to REJECTED and they will be removed from the comparison.
            </Text>
          )
        }
        confirmLabel="Reject"
        confirmColor="red"
        confirmIcon={<IconX size={16} />}
        isLoading={isRejecting}
      />

      {/* Hire Confirmation Modal */}
      <ConfirmActionModal
        opened={!!candidateToHire}
        onClose={onHireClose}
        onConfirm={onHireConfirm}
        title="Hire Candidate"
        message={
          hireMessage || (
            <Text>
              Are you sure you want to hire <strong>{candidateToHire?.name}</strong>?
              <br /><br />
              This will change their application status to HIRED.
            </Text>
          )
        }
        confirmLabel="Hire"
        confirmColor="green"
        confirmIcon={<IconCheck size={16} />}
        isLoading={isHiring}
      />
    </>
  );
}
