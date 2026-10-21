import { Modal, Text, Group, Box } from '@mantine/core';
import { IconClipboardCheck } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { InterviewReviewForm } from './InterviewReviewForm';

interface ReviewModalProps {
  opened: boolean;
  onClose: () => void;
  interviewId: string | null;
  interview?: unknown; // accepted but not used — kept for API compatibility
  reviewId?: string;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export function ReviewModal({
  opened,
  onClose,
  interviewId,
  reviewId,
  readOnly,
  onSuccess,
}: ReviewModalProps) {
  const { t } = useTranslation('reviews');

  if (!interviewId) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      radius="lg"
      centered
      title={
        <Group gap="xs">
          <Box
            p={6}
            bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
            style={{ borderRadius: 8, color: '#2563eb' }}
          >
            <IconClipboardCheck size={18} />
          </Box>
          <Text fw={700} size="md">
            {readOnly ? t('candidateDisplay.interviewReview') : reviewId ? t('form.editTitle') : t('form.title')}
          </Text>
        </Group>
      }
    >
      <InterviewReviewForm
        interviewId={interviewId}
        reviewId={reviewId}
        readOnly={readOnly}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    </Modal>
  );
}
