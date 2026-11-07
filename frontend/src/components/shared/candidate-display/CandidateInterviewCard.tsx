import {
  Box,
  Group,
  Stack,
  Text,
  Badge,
  Collapse,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconStarFilled,
  IconChevronDown,
  IconUser,
  IconMessageDots,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { getScoreColor } from '../../../utils/score.utils';
import { InterviewReviewFeedbackCard } from './InterviewReviewFeedbackCard';
import { InterviewActionBanners } from './InterviewActionBanners';

export interface CandidateInterviewCardProps {
  interview: Interview;
  applicationId: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onOpenCreateReview: (interviewId: string) => void;
  onOpenEditReview: (interviewId: string, reviewId: string) => void;
  currentUserId?: string;
}

export const CandidateInterviewCard = ({
  interview,
  applicationId,
  isExpanded,
  onToggleExpand,
  onOpenCreateReview,
  onOpenEditReview,
  currentUserId,
}: CandidateInterviewCardProps) => {
  const { t, i18n } = useTranslation(['reviews', 'calendar']);
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const effectiveStatus = getEffectiveInterviewStatus(interview);
  const reviews = interview.reviews?.filter(r => r.candidate_application_id === applicationId) || [];

  const isScheduled = effectiveStatus === InterviewStatus.SCHEDULED;
  const isPendingReview = effectiveStatus === InterviewStatus.COMPLETED && reviews.length === 0;
  const isReviewed = effectiveStatus === InterviewStatus.COMPLETED && reviews.length > 0;

  const isInterviewer = interview.interviewers?.some(i => i.id === currentUserId) || false;
  const hasUserReviewed = reviews.some(r => r.employee?.id === currentUserId);
  const canUploadReview = effectiveStatus === InterviewStatus.COMPLETED && isInterviewer && !hasUserReviewed;

  const avgScore = reviews.length > 0
    ? reviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / reviews.length
    : 0;

  const scoreColor = isReviewed ? getScoreColor(avgScore) : isScheduled ? 'blue' : 'orange';

  const interviewersText = interview.interviewers && interview.interviewers.length > 0
    ? interview.interviewers.map(i => `${i.user.first_name} ${i.user.last_name}`).join(', ')
    : t('card.unknownPosition');

  const interviewDate = new Date(interview.scheduled_time);
  const formattedDate = interviewDate.toLocaleDateString(i18n.language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = interviewDate.toLocaleTimeString(i18n.language, {
    hour: '2-digit',
    minute: '2-digit',
  });

  const reviewedEmployeeIds = new Set(reviews.map(r => r.employee?.id));
  const pendingInterviewers = interview.interviewers?.filter(i => !reviewedEmployeeIds.has(i.id)) || [];

  return (
    <Box
      style={{
        borderRadius: 14,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        borderLeft: `4px solid ${
          isReviewed
            ? (scoreColor === 'green' ? '#10b981' : scoreColor === 'yellow' ? '#f59e0b' : '#ef4444')
            : isScheduled
              ? '#3b82f6'
              : '#f59e0b'
        }`,
        background: isDark ? '#1e293b' : '#ffffff',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        boxShadow: isDark ? '0 2px 10px rgba(0, 0, 0, 0.25)' : '0 1px 4px rgba(15, 23, 42, 0.05)',
      }}
    >
      {/* Header: Clickable to toggle accordion */}
      <Box
        p="md"
        onClick={onToggleExpand}
        style={{
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.15s ease',
        }}
      >
        <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
          {/* Left: Info */}
          <Group gap="sm" align="flex-start" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Group gap="xs" mb={3} align="center" wrap="wrap">
                <Text fw={700} size="sm" lineClamp={1} c="light-dark(#0f172a, #f8fafc)">
                  {interview.title}
                </Text>
                {isPendingReview && (
                  <Badge color="orange" variant="light" size="xs" radius="sm" leftSection={<IconClock size={11} />}>
                    {t('candidateDisplay.reviewPendingBadge')}
                  </Badge>
                )}
                {isScheduled && (
                  <Badge color="blue" variant="light" size="xs" radius="sm" leftSection={<IconCalendarEvent size={11} />}>
                    {t('candidateDisplay.scheduledBadge')}
                  </Badge>
                )}
                {isReviewed && (
                  <Badge color={scoreColor} variant="light" size="xs" radius="sm">
                    {reviews.length} {reviews.length === 1 ? t('buttons.reviewSingular', 'evaluación') : t('buttons.reviews', 'evaluaciones')}
                  </Badge>
                )}
              </Group>

              <Group gap="xs" wrap="wrap">
                <Group gap={4}>
                  <IconCalendarEvent size={13} color={isDark ? '#94a3b8' : '#64748b'} />
                  <Text size="xs" c="dimmed">
                    {formattedDate} • {formattedTime}
                  </Text>
                </Group>

                <Text size="xs" c="dimmed">•</Text>

                <Group gap={4}>
                  <IconUser size={13} color={isDark ? '#94a3b8' : '#64748b'} />
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {interviewersText}
                  </Text>
                </Group>
              </Group>
            </Box>
          </Group>

          {/* Right: Score Pill & Chevron */}
          <Group gap="xs" align="center" style={{ flexShrink: 0 }}>
            <Box
              px="xs"
              py={4}
              style={{
                borderRadius: 8,
                background: isReviewed
                  ? (scoreColor === 'green'
                    ? (isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5')
                    : scoreColor === 'yellow'
                      ? (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb')
                      : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2'))
                  : isScheduled
                    ? (isDark ? 'rgba(59, 130, 246, 0.15)' : '#eff6ff')
                    : (isDark ? 'rgba(245, 158, 11, 0.15)' : '#fffbeb'),
                border: `1px solid ${
                  isReviewed
                    ? (scoreColor === 'green'
                      ? (isDark ? 'rgba(16, 185, 129, 0.3)' : '#a7f3d0')
                      : scoreColor === 'yellow'
                        ? (isDark ? 'rgba(245, 158, 11, 0.3)' : '#fde68a')
                        : (isDark ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'))
                    : isScheduled
                      ? (isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe')
                      : (isDark ? 'rgba(245, 158, 11, 0.3)' : '#fde68a')
                }`,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                whiteSpace: 'nowrap',
              }}
            >
              {isReviewed ? (
                <>
                  <IconStarFilled
                    size={13}
                    style={{
                      color: scoreColor === 'green' ? '#10b981' : scoreColor === 'yellow' ? '#f59e0b' : '#ef4444',
                    }}
                  />
                  <Text
                    fw={700}
                    size="xs"
                    c={
                      scoreColor === 'green'
                        ? (isDark ? '#34d399' : '#059669')
                        : scoreColor === 'yellow'
                          ? (isDark ? '#fbbf24' : '#d97706')
                          : (isDark ? '#f87171' : '#dc2626')
                    }
                  >
                    {avgScore.toFixed(1)} / 10
                  </Text>
                </>
              ) : isScheduled ? (
                <Text fw={600} size="xs" c="blue.7">{t('candidateDisplay.notHappenedYet')}</Text>
              ) : (
                <Text fw={600} size="xs" c="orange.7">{t('candidateDisplay.noScore')}</Text>
              )}
            </Box>

            <IconChevronDown
              size={18}
              color={isDark ? '#94a3b8' : '#64748b'}
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            />
          </Group>
        </Group>
      </Box>

      {/* Collapsible Panel Content */}
      <Collapse in={isExpanded}>
        <Box
          p="md"
          style={{
            borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
            background: isDark ? '#0f172a' : '#f8fafc',
          }}
        >
          <Stack gap="md">
            {/* 1. Reviewer Feedback Cards */}
            {isReviewed && (
              <Stack gap="sm">
                <Group justify="space-between" align="center">
                  <Group gap="xs">
                    <IconMessageDots size={16} color="#3b82f6" />
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.04em' }}>
                      {t('sections.teamReviews', { defaultValue: 'Evaluaciones del equipo' })}
                    </Text>
                  </Group>
                </Group>

                {reviews.map(r => (
                  <InterviewReviewFeedbackCard
                    key={r.id}
                    review={r}
                    currentUserId={currentUserId}
                    onEditReview={(reviewId) => onOpenEditReview(interview.id, reviewId)}
                  />
                ))}
              </Stack>
            )}

            {/* 2, 3, 4. Banners */}
            <InterviewActionBanners
              effectiveStatus={effectiveStatus}
              isScheduled={isScheduled}
              canUploadReview={canUploadReview}
              pendingInterviewers={pendingInterviewers}
              formattedDate={formattedDate}
              formattedTime={formattedTime}
              meetingLink={interview.meeting_link}
              onUploadReview={() => onOpenCreateReview(interview.id)}
              onViewSchedule={() => {
                const date = new Date(interview.scheduled_time).toISOString().split('T')[0];
                navigate(`/manage/interviews?date=${date}&interviewId=${interview.id}`);
              }}
            />
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

