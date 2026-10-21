import { useState } from 'react';
import {
  Box,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Paper,
  Avatar,
  Collapse,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconCalendarEvent,
  IconClock,
  IconStarFilled,
  IconChevronDown,
  IconUser,
  IconVideo,
  IconPencil,
  IconAlertCircle,
  IconMessageDots,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { getScoreColor } from '../../../utils/score.utils';
import { useAppStore } from '../../../store/useAppStore';
import { ScoreBadge } from '../ScoreBadge';
import { ReviewModal } from '../../employee/reviews/ReviewModal';

interface CandidateInterviewsDisplayProps {
  interviews: Interview[];
  applicationId: string;
}

interface ModalState {
  opened: boolean;
  interviewId: string | null;
  reviewId?: string;
  readOnly?: boolean;
}

export function CandidateInterviewsDisplay({ interviews, applicationId }: CandidateInterviewsDisplayProps) {
  const { t, i18n } = useTranslation(['reviews', 'calendar']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const user = useAppStore(state => state.user);

  // Keep track of which interviews are expanded.
  // By default, expand the first interview if available.
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    if (!interviews || interviews.length === 0) return {};
    return { [interviews[0].id]: true };
  });

  const [modalState, setModalState] = useState<ModalState>({
    opened: false,
    interviewId: null,
  });

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreateReview = (interviewId: string) => {
    setModalState({
      opened: true,
      interviewId,
      reviewId: undefined,
      readOnly: false,
    });
  };

  const openEditReview = (interviewId: string, reviewId: string) => {
    setModalState({
      opened: true,
      interviewId,
      reviewId,
      readOnly: false,
    });
  };

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
        {interviews.map(interview => {
          const effectiveStatus = getEffectiveInterviewStatus(interview);
          const reviews = interview.reviews?.filter(r => r.candidate_application_id === applicationId) || [];

          const isScheduled = effectiveStatus === InterviewStatus.SCHEDULED;
          const isPendingReview = effectiveStatus === InterviewStatus.COMPLETED && reviews.length === 0;
          const isReviewed = effectiveStatus === InterviewStatus.COMPLETED && reviews.length > 0;

          const isInterviewer = interview.interviewers?.some(i => i.id === user?.id) || false;
          const hasUserReviewed = reviews.some(r => r.employee?.id === user?.id);
          const canUploadReview = effectiveStatus === InterviewStatus.COMPLETED && isInterviewer && !hasUserReviewed;

          const avgScore = reviews.length > 0
            ? reviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / reviews.length
            : 0;

          const scoreColor = isReviewed ? getScoreColor(avgScore) : isScheduled ? 'blue' : 'orange';
          const isExpanded = !!expandedIds[interview.id];

          // Format interviewers text
          const interviewersText = interview.interviewers && interview.interviewers.length > 0
            ? interview.interviewers.map(i => `${i.user.first_name} ${i.user.last_name}`).join(', ')
            : t('card.unknownPosition');

          // Date formatting
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

          // Pending reviewers who haven't submitted
          const reviewedEmployeeIds = new Set(reviews.map(r => r.employee?.id));
          const pendingInterviewers = interview.interviewers?.filter(i => !reviewedEmployeeIds.has(i.id)) || [];

          return (
            <Box
              key={interview.id}
              style={{
                borderRadius: 14,
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderLeft: `4px solid ${isReviewed
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
                onClick={() => toggleExpanded(interview.id)}
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
                        border: `1px solid ${isReviewed
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

                        {reviews.map(r => {
                          const reviewerName = r.employee?.user
                            ? `${r.employee.user.first_name} ${r.employee.user.last_name}`
                            : t('candidateDisplay.by');
                          const reviewerInitials = r.employee?.user
                            ? `${r.employee.user.first_name?.[0] || ''}${r.employee.user.last_name?.[0] || ''}`.toUpperCase()
                            : 'E';
                          const isMyReview = r.employee?.id === user?.id;

                          return (
                            <Paper
                              key={r.id}
                              withBorder
                              radius="md"
                              p="sm"
                              bg={isDark ? '#1e293b' : '#ffffff'}
                              style={{
                                borderColor: isDark ? '#334155' : '#e2e8f0',
                                boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 3px rgba(15,23,42,0.03)',
                              }}
                            >
                              {/* Reviewer Header */}
                              <Group justify="space-between" align="center" mb="xs" wrap="nowrap">
                                <Group gap="xs" align="center" wrap="nowrap" style={{ minWidth: 0 }}>
                                  <Avatar
                                    size="sm"
                                    radius="xl"
                                    color={isMyReview ? 'blue' : 'gray'}
                                    style={{ fontWeight: 700, fontSize: '0.75rem' }}
                                  >
                                    {reviewerInitials}
                                  </Avatar>
                                  <Box style={{ minWidth: 0 }}>
                                    <Group gap={6} align="center">
                                      <Text fw={700} size="sm" lineClamp={1} c="light-dark(#0f172a, #f8fafc)">
                                        {reviewerName}
                                      </Text>
                                      {isMyReview && (
                                        <Badge size="xs" color="blue" variant="light" radius="sm">
                                          {t('candidateDisplay.by')} ti
                                        </Badge>
                                      )}
                                    </Group>
                                    {r.employee?.position && (
                                      <Text size="xs" c="dimmed" lineClamp={1}>
                                        {r.employee.position}
                                      </Text>
                                    )}
                                  </Box>
                                </Group>

                                <Group gap="xs" align="center">
                                  {isMyReview && (
                                    <Button
                                      size="compact-xs"
                                      variant="subtle"
                                      color="blue"
                                      leftSection={<IconPencil size={12} />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openEditReview(interview.id, r.id);
                                      }}
                                    >
                                      {t('form.editTitle')}
                                    </Button>
                                  )}
                                  <ScoreBadge score={r.score} size="sm" />
                                </Group>
                              </Group>

                              {/* Strengths & Weaknesses */}
                              <Stack gap="xs" mt="xs">
                                {/* Strengths */}
                                <Box>
                                  <Group gap={6} mb={4} align="center">
                                    <IconThumbUp size={13} color="#10b981" />
                                    <Text size="xs" fw={700} c="green.7">
                                      {t('candidateDisplay.strengths')}
                                    </Text>
                                  </Group>
                                  <Group gap={6} wrap="wrap">
                                    {r.strengths && r.strengths.length > 0 ? (
                                      r.strengths.map((str, idx) => (
                                        <Badge
                                          key={idx}
                                          size="sm"
                                          color="teal"
                                          variant="light"
                                          radius="sm"
                                        >
                                          {str}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Text size="xs" c="dimmed">-</Text>
                                    )}
                                  </Group>
                                </Box>

                                {/* Weaknesses */}
                                <Box>
                                  <Group gap={6} mb={4} align="center">
                                    <IconThumbDown size={13} color="#ef4444" />
                                    <Text size="xs" fw={700} c="red.7">
                                      {t('candidateDisplay.weaknesses')}
                                    </Text>
                                  </Group>
                                  <Group gap={6} wrap="wrap">
                                    {r.weaknesses && r.weaknesses.length > 0 ? (
                                      r.weaknesses.map((w, idx) => (
                                        <Badge
                                          key={idx}
                                          size="sm"
                                          color="red"
                                          variant="light"
                                          radius="sm"
                                        >
                                          {w}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Text size="xs" c="dimmed">-</Text>
                                    )}
                                  </Group>
                                </Box>

                                {/* Notes Callout */}
                                {r.notes && (
                                  <Box
                                    mt={4}
                                    p="xs"
                                    style={{
                                      borderRadius: 8,
                                      background: isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc',
                                      borderLeft: `3px solid ${isDark ? '#3b82f6' : '#2563eb'}`,
                                    }}
                                  >
                                    <Group gap={6} mb={3}>
                                      <IconMessageDots size={13} color={isDark ? '#60a5fa' : '#2563eb'} />
                                      <Text size="xs" fw={700} c={isDark ? '#93c5fd' : '#1d4ed8'}>
                                        {t('candidateDisplay.notes')}
                                      </Text>
                                    </Group>
                                    <Text
                                      size="xs"
                                      c={isDark ? '#cbd5e1' : '#334155'}
                                      style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
                                    >
                                      {r.notes}
                                    </Text>
                                  </Box>
                                )}
                              </Stack>
                            </Paper>
                          );
                        })}
                      </Stack>
                    )}

                    {/* 2. Notification if some interviewers haven't submitted yet */}
                    {effectiveStatus === InterviewStatus.COMPLETED && pendingInterviewers.length > 0 && (
                      <Text size="xs" c="dimmed" fs="italic">
                        <IconClock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                        {t('candidateDisplay.waitingFeedback')} ({pendingInterviewers.map(i => `${i.user.first_name} ${i.user.last_name}`).join(', ')})
                      </Text>
                    )}

                    {/* 3. Action Banner for Pending Review by Current User */}
                    {canUploadReview && (
                      <Paper
                        withBorder
                        radius="md"
                        p="sm"
                        style={{
                          background: isDark ? 'rgba(245, 158, 11, 0.12)' : '#fffbeb',
                          borderColor: isDark ? 'rgba(245, 158, 11, 0.35)' : '#fde68a',
                        }}
                      >
                        <Group justify="space-between" align="center" gap="sm" wrap="wrap">
                          <Group gap="xs" style={{ flex: 1, minWidth: 200 }}>
                            <IconAlertCircle size={18} color="#d97706" />
                            <Text size="xs" fw={600} c={isDark ? '#fbbf24' : '#92400e'}>
                              {t('candidateDisplay.interviewPastNoReview')}
                            </Text>
                          </Group>
                          <Button
                            size="xs"
                            color="orange"
                            radius="md"
                            leftSection={<IconPencil size={14} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              openCreateReview(interview.id);
                            }}
                            style={{ fontWeight: 600 }}
                          >
                            {t('candidateDisplay.uploadReview')}
                          </Button>
                        </Group>
                      </Paper>
                    )}

                    {/* 4. Action Banner for Scheduled Interview */}
                    {isScheduled && (
                      <Paper
                        withBorder
                        radius="md"
                        p="sm"
                        style={{
                          background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                          borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : '#bfdbfe',
                        }}
                      >
                        <Group justify="space-between" align="center" gap="sm" wrap="wrap">
                          <Group gap="xs" style={{ flex: 1, minWidth: 200 }}>
                            <IconCalendarEvent size={18} color="#2563eb" />
                            <Box>
                              <Text size="xs" fw={600} c={isDark ? '#60a5fa' : '#1d4ed8'}>
                                {t('candidateDisplay.interviewNotHappenedYet')}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {formattedDate} • {formattedTime}
                              </Text>
                            </Box>
                          </Group>

                          <Group gap="xs">
                            {interview.meeting_link && (
                              <Button
                                component="a"
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                size="xs"
                                variant="light"
                                color="teal"
                                radius="md"
                                leftSection={<IconVideo size={14} />}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {t('card.googleMeet')}
                              </Button>
                            )}
                            <Button
                              size="xs"
                              variant="light"
                              color="blue"
                              radius="md"
                              leftSection={<IconCalendarEvent size={14} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                const date = new Date(interview.scheduled_time).toISOString().split('T')[0];
                                navigate(`/manage/interviews?date=${date}&interviewId=${interview.id}`);
                              }}
                            >
                              {t('candidateDisplay.viewSchedule')}
                            </Button>
                          </Group>
                        </Group>
                      </Paper>
                    )}
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </Stack>

      {/* Embedded ReviewModal for loading or editing evaluations on the fly */}
      <ReviewModal
        opened={modalState.opened}
        onClose={() => setModalState(prev => ({ ...prev, opened: false }))}
        interviewId={modalState.interviewId}
        reviewId={modalState.reviewId}
        readOnly={modalState.readOnly}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['interviews'] });
          queryClient.invalidateQueries({ queryKey: ['interview-reviews'] });
        }}
      />
    </>
  );
}
