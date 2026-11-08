import {
  Paper,
  Box,
  Text,
  Stack,
  Group,
  Title,
  Button,
  Pagination,
  LoadingOverlay,
  useMantineColorScheme,
} from '@mantine/core';
import { IconUserCheck, IconUsers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { InterviewReview } from '../../../services/interview-review.service';
import type { PaginationMeta } from '../../../types/common';
import { groupCompletedReviews } from './groupCompletedReviews';
import { CompletedReviewsAccordion } from './CompletedReviewsAccordion';

export interface CompletedReviewsTabContentProps {
  completedReviews: InterviewReview[];
  myCompletedReviews: InterviewReview[];
  otherCompletedReviews: InterviewReview[];
  isLoadingCompleted: boolean;
  searchQuery: string;
  onClearSearch: () => void;
  selectedInterviewId: string | null;
  onReviewClick: (interviewId: string, reviewId?: string) => void;
  onCloseReview: () => void;
  isMyReview: (review: InterviewReview) => boolean;
  completedPagination?: PaginationMeta;
  completedPage: number;
  onPageChange: (page: number) => void;
}

export const CompletedReviewsTabContent = ({
  completedReviews,
  myCompletedReviews,
  otherCompletedReviews,
  isLoadingCompleted,
  searchQuery,
  onClearSearch,
  selectedInterviewId,
  onReviewClick,
  onCloseReview,
  isMyReview,
  completedPagination,
  completedPage,
  onPageChange,
}: CompletedReviewsTabContentProps) => {
  const { t } = useTranslation(['reviews']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const myCompletedGroups = groupCompletedReviews(myCompletedReviews);
  const otherCompletedGroups = groupCompletedReviews(otherCompletedReviews);

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      pos="relative"
      bg="light-dark(#ffffff, #1e293b)"
      style={{
        borderColor: 'light-dark(#e2e8f0, #334155)',
        boxShadow: isDark
          ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)'
          : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
      }}
    >
      <LoadingOverlay visible={isLoadingCompleted} zIndex={100} overlayProps={{ radius: 'lg', blur: 2 }} />

      {completedReviews.length === 0 && !isLoadingCompleted ? (
        <Paper
          p="3rem"
          radius="md"
          ta="center"
          style={{
            border: '2px dashed light-dark(#e2e8f0, #334155)',
            backgroundColor: 'light-dark(#f8fafc, #0f172a)',
          }}
        >
          <Text fw={600} size="md" c="dimmed">
            {searchQuery
              ? t('empty.noSearchResults', {
                  defaultValue: 'No se encontraron evaluaciones que coincidan con la búsqueda.',
                })
              : t('empty.completed')}
          </Text>
          {searchQuery && (
            <Button variant="subtle" size="xs" mt="sm" onClick={onClearSearch}>
              {t('empty.clearSearch', { defaultValue: 'Limpiar búsqueda' })}
            </Button>
          )}
        </Paper>
      ) : (
        <Stack gap="xl">
          {/* My Reviews Section */}
          <Box>
            <Group gap="xs" mb="md" align="center">
              <Box
                p={6}
                bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))"
                style={{ borderRadius: 8, color: '#2563eb' }}
              >
                <IconUserCheck size={16} />
              </Box>
              <Title order={4} c="light-dark(#0f172a, #f8fafc)" size="h4" style={{ fontWeight: 800 }}>
                {t('sections.myReviews')}
              </Title>
            </Group>

            {myCompletedReviews.length === 0 ? (
              <Paper
                p="2rem"
                radius="md"
                ta="center"
                style={{
                  border: '1px dashed light-dark(#e2e8f0, #334155)',
                  backgroundColor: 'light-dark(#f8fafc, #0f172a)',
                }}
              >
                <Text c="dimmed" size="sm">
                  {t('empty.completed')}
                </Text>
              </Paper>
            ) : (
              <CompletedReviewsAccordion
                groups={myCompletedGroups}
                selectedInterviewId={selectedInterviewId}
                onReviewClick={onReviewClick}
                onCloseReview={onCloseReview}
                isMyReview={isMyReview}
              />
            )}
          </Box>

          {/* Team Reviews Section */}
          <Box pt="md" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
            <Group gap="xs" mb="md" align="center">
              <Box
                p={6}
                bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))"
                style={{ borderRadius: 8, color: '#16a34a' }}
              >
                <IconUsers size={16} />
              </Box>
              <Title order={4} c="light-dark(#0f172a, #f8fafc)" size="h4" style={{ fontWeight: 800 }}>
                {t('sections.teamReviews')}
              </Title>
            </Group>

            {otherCompletedReviews.length === 0 ? (
              <Paper
                p="2rem"
                radius="md"
                ta="center"
                style={{
                  border: '1px dashed light-dark(#e2e8f0, #334155)',
                  backgroundColor: 'light-dark(#f8fafc, #0f172a)',
                }}
              >
                <Text c="dimmed" size="sm">
                  {t('empty.team', { defaultValue: 'No se encontraron evaluaciones del equipo.' })}
                </Text>
              </Paper>
            ) : (
              <CompletedReviewsAccordion
                groups={otherCompletedGroups}
                selectedInterviewId={selectedInterviewId}
                onReviewClick={onReviewClick}
                onCloseReview={onCloseReview}
                isMyReview={isMyReview}
              />
            )}
          </Box>

          {/* Pagination */}
          {completedPagination && completedPagination.totalPages > 1 && (
            <Group
              justify="center"
              mt="lg"
              pt="md"
              style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}
            >
              <Pagination
                total={completedPagination.totalPages}
                value={completedPage}
                onChange={onPageChange}
                size="sm"
              />
            </Group>
          )}
        </Stack>
      )}
    </Paper>
  );
};

