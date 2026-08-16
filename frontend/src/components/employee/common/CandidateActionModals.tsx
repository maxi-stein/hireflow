import { Text } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { useTranslation, Trans } from 'react-i18next';
import { ConfirmActionModal } from '../../shared/ConfirmActionModal';
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
  const { t } = useTranslation('profile');
  return (
    <>
      {/* Reject Confirmation Modal */}
      <ConfirmActionModal
        opened={!!candidateToReject}
        onClose={onRejectClose}
        onConfirm={onRejectConfirm}
        title={t('candidate.actions.modals.rejectTitle')}
        message={
          rejectMessage || (
            <Text>
              <Trans
                i18nKey="candidate.actions.modals.rejectMessage"
                ns="profile"
                values={{ name: candidateToReject?.name }}
                components={{ 1: <strong />, br: <br /> }}
              />
            </Text>
          )
        }
        confirmLabel={t('candidate.actions.modals.rejectConfirm')}
        confirmColor="red"
        confirmIcon={<IconX size={16} />}
        isLoading={isRejecting}
      />

      {/* Hire Confirmation Modal */}
      <ConfirmActionModal
        opened={!!candidateToHire}
        onClose={onHireClose}
        onConfirm={onHireConfirm}
        title={t('candidate.actions.modals.hireTitle')}
        message={
          hireMessage || (
            <Text>
              <Trans
                i18nKey="candidate.actions.modals.hireMessage"
                ns="profile"
                values={{ name: candidateToHire?.name }}
                components={{ 1: <strong />, br: <br /> }}
              />
            </Text>
          )
        }
        confirmLabel={t('candidate.actions.modals.hireConfirm')}
        confirmColor="green"
        confirmIcon={<IconCheck size={16} />}
        isLoading={isHiring}
      />
    </>
  );
}
