import {
  Box,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Interview } from '../../../services/interview.service';
import { useAppStore } from '../../../store/useAppStore';
import { ReviewModal } from '../../employee/reviews/ReviewModal';
import { useCandidateInterviewsState } from '../../../hooks/domain/useCandidateInterviewsState';
import { CandidateInterviewCard } from './CandidateInterviewCard';

interface CandidateInterviewsDisplayProps {
  interviews: Interview[];
  applicationId: string;
}

export function CandidateInterviewsDisplay({ interviews, applicationId }: CandidateInterviewsDisplayProps) {
  const { t } = useTranslation(['reviews']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useAppStore(state => state.user);

  const {
    expandedIds,
    toggleExpanded,
    modalState,
    openCreateReview,
    openEditReview,
    closeReview,
    handleReviewSuccess,
  } = useCandidateInterviewsState(interviews);

  if (!interviews || interviews.length === 0) {
    return (
      <Box
        p="lg"
        ta="center"
        mt="sm"
        style={{
          borderRadius: 14,
          border: `1px dashed ${isDark ? '#334155' : '#cbd5e1'}`,
          background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc',
        }}
      >
        <Box
          p={10}
          mb="xs"
          style={{
            display: 'inline-flex',
            borderRadius: '50%',
            background: isDark ? 'rgba(51, 65, 85, 0.5)' : '#e2e8f0',
            color: isDark ? '#94a3b8' : '#64748b',
          }}
        >
          <IconCalendarEvent size={22} />
        </Box>
        <Text fw={600} size="sm" c="dimmed">
          {t('candidateDisplay.noInterviews')}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Stack gap="sm" mt="sm">
        {interviews.map(interview => (
          <CandidateInterviewCard
            key={interview.id}
            interview={interview}
            applicationId={applicationId}
            isExpanded={!!expandedIds[interview.id]}
            onToggleExpand={() => toggleExpanded(interview.id)}
            onOpenCreateReview={openCreateReview}
            onOpenEditReview={openEditReview}
            currentUserId={user?.id}
          />
        ))}
      </Stack>

      <ReviewModal
        opened={modalState.opened}
        onClose={closeReview}
        interviewId={modalState.interviewId}
        reviewId={modalState.reviewId}
        readOnly={modalState.readOnly}
        onSuccess={handleReviewSuccess}
      />
    </>
  );
}
