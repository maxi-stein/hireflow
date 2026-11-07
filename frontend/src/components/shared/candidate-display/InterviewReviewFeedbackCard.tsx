import {
  Box,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Paper,
  Avatar,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconPencil,
  IconMessageDots,
  IconThumbUp,
  IconThumbDown,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { InterviewReview } from '../../../services/interview-review.service';
import { ScoreBadge } from '../ScoreBadge';

export interface InterviewReviewFeedbackCardProps {
  review: InterviewReview;
  currentUserId?: string;
  onEditReview?: (reviewId: string) => void;
}

export const InterviewReviewFeedbackCard = ({
  review,
  currentUserId,
  onEditReview,
}: InterviewReviewFeedbackCardProps) => {
  const { t } = useTranslation(['reviews']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const reviewerName = review.employee?.user
    ? `${review.employee.user.first_name} ${review.employee.user.last_name}`
    : t('candidateDisplay.by');
  const reviewerInitials = review.employee?.user
    ? `${review.employee.user.first_name?.[0] || ''}${review.employee.user.last_name?.[0] || ''}`.toUpperCase()
    : 'E';
  const isMyReview = review.employee?.id === currentUserId;

  return (
    <Paper
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
            {review.employee?.position && (
              <Text size="xs" c="dimmed" lineClamp={1}>
                {review.employee.position}
              </Text>
            )}
          </Box>
        </Group>

        <Group gap="xs" align="center">
          {isMyReview && onEditReview && (
            <Button
              size="compact-xs"
              variant="subtle"
              color="blue"
              leftSection={<IconPencil size={12} />}
              onClick={(e) => {
                e.stopPropagation();
                onEditReview(review.id);
              }}
            >
              {t('form.editTitle')}
            </Button>
          )}
          <ScoreBadge score={review.score} size="sm" />
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
            {review.strengths && review.strengths.length > 0 ? (
              review.strengths.map((str, idx) => (
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
            {review.weaknesses && review.weaknesses.length > 0 ? (
              review.weaknesses.map((w, idx) => (
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
        {review.notes && (
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
              {review.notes}
            </Text>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

