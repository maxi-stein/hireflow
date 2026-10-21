import { Group, Box, Text, Button, Badge, Stack, Divider, useMantineColorScheme } from '@mantine/core';
import { IconCalendarEvent, IconPencil, IconEye, IconUser, IconClock, IconQuote } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { ScoreBadge } from '../../shared/ScoreBadge';
import type { InterviewReview } from '../../../services/interview-review.service';
import type { GroupedCompletedReviews } from './groupCompletedReviews';
import { useTranslation } from 'react-i18next';

interface CompletedReviewCardProps {
  candidateGroup: GroupedCompletedReviews['candidates'][0];
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string, reviewId?: string) => void;
  onCloseReview: () => void;
  isMyReview: (review: InterviewReview) => boolean;
  jobWorkMode: string;
}

export function CompletedReviewCard({
  candidateGroup,
  onReviewClick,
  isMyReview,
}: CompletedReviewCardProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t, i18n } = useTranslation(['reviews']);

  const { candidateId, candidateData, interviews } = candidateGroup;
  const candidateUser = candidateData?.user;

  return (
    <Box
      p="md"
      style={{
        borderRadius: 12,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark ? '#1e293b' : '#ffffff',
      }}
    >
      {/* Candidate header */}
      <Group gap="md" align="center" mb="md">
        <CandidateAvatar
          candidateId={candidateId}
          firstName={candidateUser?.first_name}
          lastName={candidateUser?.last_name}
          size={44}
        />
        <Box style={{ flex: 1 }}>
          <Text fw={700} size="md" c={isDark ? '#f8fafc' : '#0f172a'}>
            {candidateUser?.first_name} {candidateUser?.last_name}
          </Text>
          {candidateData?.headline && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              {candidateData.headline}
            </Text>
          )}
        </Box>
      </Group>

      {/* Interviews — flat, no wrapping boxes */}
      <Stack gap={0}>
        {interviews.map(({ interviewData, reviews }, idx) => (
          <Box key={interviewData.id}>
            {idx > 0 && (
              <Divider
                my="sm"
                style={{ borderColor: isDark ? '#1e293b' : '#f1f5f9' }}
              />
            )}

            {/* ── Interview label row ── */}
            <Group gap="xs" align="center" mb="sm" pl={2}>
              <Text size="sm" fw={700} c={isDark ? '#93c5fd' : '#2563eb'} style={{ letterSpacing: 0.2 }}>
                {interviewData.title || '—'}
              </Text>
              <Badge variant="dot" color="blue" size="sm" radius="sm">
                {interviewData.type === 'INDIVIDUAL' ? 'Individual' : 'Grupal'}
              </Badge>
              <Text size="xs" c="dimmed" ml="auto">
                <Group gap={4} align="center" wrap="nowrap">
                  <IconCalendarEvent size={13} />
                  {new Date(interviewData.scheduled_time).toLocaleDateString(i18n.language, {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  <IconClock size={12} style={{ marginLeft: 4 }} />
                  {new Date(interviewData.scheduled_time).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Group>
              </Text>
            </Group>

            {/* ── Reviewer rows — no nested box ── */}
            <Stack gap="xs" pl={2}>
              {reviews.map(review => {
                const isAuthor = isMyReview(review);

                return (
                  <Box key={review.id}>
                    {/* Reviewer line */}
                    <Group justify="space-between" align="center" wrap="wrap" gap="sm">
                      <Group gap="xs" align="center">
                        <Box
                          p={3}
                          bg={isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff'}
                          style={{ borderRadius: 6, color: '#2563eb', display: 'flex' }}
                        >
                          <IconUser size={13} />
                        </Box>
                        <Box>
                          <Text size="sm" fw={600} c={isDark ? '#e2e8f0' : '#1e293b'}>
                            {review.employee?.user.first_name} {review.employee?.user.last_name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(review.created_at).toLocaleDateString(i18n.language, {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </Text>
                        </Box>
                      </Group>

                      <Group gap="sm" align="center">
                        {review.score !== undefined && (
                          <ScoreBadge score={review.score} size="md" />
                        )}
                        <Button
                          size="xs"
                          variant={isAuthor ? 'filled' : 'light'}
                          color="blue"
                          radius="md"
                          leftSection={isAuthor ? <IconPencil size={13} /> : <IconEye size={13} />}
                          onClick={(e) => {
                            e.stopPropagation();
                            onReviewClick(review.interview_id, review.id);
                          }}
                          style={{ fontWeight: 600 }}
                        >
                          {isAuthor ? t('buttons.review', { defaultValue: 'Editar reseña' }) : t('buttons.details', { defaultValue: 'Ver detalles' })}
                        </Button>
                      </Group>
                    </Group>

                    {/* Notes — left-accent strip, no card */}
                    {review.notes && (
                      <Box
                        mt={8}
                        pl="sm"
                        style={{
                          borderLeft: `2px solid ${isDark ? '#334155' : '#dbeafe'}`,
                        }}
                      >
                        <Group gap={6} align="flex-start" wrap="nowrap">
                          <IconQuote size={14} color="#2563eb" style={{ flexShrink: 0, marginTop: 3, opacity: 0.6 }} />
                          <Text size="sm" c={isDark ? '#94a3b8' : '#475569'} style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                            {review.notes}
                          </Text>
                        </Group>
                      </Box>
                    )}

                    {/* Strengths & Weaknesses */}
                    {((review.strengths && review.strengths.length > 0) || (review.weaknesses && review.weaknesses.length > 0)) && (
                      <Group gap="lg" mt={8} pl={2} wrap="wrap">
                        {review.strengths && review.strengths.length > 0 && (
                          <Group gap={6} align="center">
                            <Text size="sm" fw={700} c="teal">{t('form.labels.strengths')}:</Text>
                            <Group gap={4} wrap="wrap">
                              {review.strengths.map(s => (
                                <Badge key={s} size="sm" color="teal" variant="light" radius="sm">{s}</Badge>
                              ))}
                            </Group>
                          </Group>
                        )}
                        {review.weaknesses && review.weaknesses.length > 0 && (
                          <Group gap={6} align="center">
                            <Text size="sm" fw={700} c="red">{t('form.labels.weaknesses')}:</Text>
                            <Group gap={4} wrap="wrap">
                              {review.weaknesses.map(w => (
                                <Badge key={w} size="sm" color="red" variant="light" radius="sm">{w}</Badge>
                              ))}
                            </Group>
                          </Group>
                        )}
                      </Group>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
