import {
  Container,
  Title,
  Box,
  Text,
  Tabs,
  Badge,
  TextInput,
  Group,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { IconClipboardCheck, IconHistory, IconSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useReviews } from '../../hooks/useReviews';
import { PendingReviewsTabContent } from '../../components/employee/reviews/PendingReviewsTabContent';
import { CompletedReviewsTabContent } from '../../components/employee/reviews/CompletedReviewsTabContent';
import { ReviewModal } from '../../components/employee/reviews/ReviewModal';

export function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation(['reviews']);

  const {
    pendingReviews,
    completedReviews,
    filteredPendingReviews,
    myCompletedReviews,
    otherCompletedReviews,
    completedPagination,
    completedPage,
    setCompletedPage,
    isLoadingCompleted,
    searchQuery,
    setSearchQuery,
    selectedInterviewId,
    selectedInterview,
    selectedReviewId,
    handleReviewClick,
    handleCloseReview,
    isMyReview,
  } = useReviews();

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      {/* Page Header */}
      <Group justify="space-between" align="flex-start" mb="xl" wrap="wrap" gap="md">
        <Box>
          <Title order={2} c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
            {t('title')}
          </Title>
          <Text size="sm" c="dimmed" mt={2}>
            {t('subtitle', 'Revisión y feedback técnico de las entrevistas realizadas a los candidatos')}
          </Text>
        </Box>

        <TextInput
          placeholder={t('searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchQuery ? (
              <ActionIcon size="sm" variant="subtle" color="gray" onClick={() => setSearchQuery('')}>
                <IconX size={14} />
              </ActionIcon>
            ) : null
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          w={{ base: '100%', sm: 340 }}
          radius="md"
        />
      </Group>

      {/* Tabs */}
      <Tabs defaultValue={searchParams.get('tab') || 'pending'} keepMounted={false}>
        <Tabs.List mb="xl" style={{ borderBottomColor: isDark ? '#334155' : '#e2e8f0' }}>
          <Tabs.Tab
            value="pending"
            leftSection={<IconClipboardCheck size={16} />}
            style={{ fontWeight: 700, fontSize: '0.9375rem' }}
          >
            <Group gap="xs" align="center">
              <span>{t('tabs.pending')}</span>
              {pendingReviews.length > 0 && (
                <Badge size="sm" radius="xl" color="blue" variant="filled">
                  {pendingReviews.length}
                </Badge>
              )}
            </Group>
          </Tabs.Tab>

          <Tabs.Tab
            value="completed"
            leftSection={<IconHistory size={16} />}
            style={{ fontWeight: 700, fontSize: '0.9375rem' }}
          >
            <Group gap="xs" align="center">
              <span>{t('tabs.completed')}</span>
              {completedPagination?.total !== undefined && completedPagination.total > 0 && (
                <Badge size="sm" radius="xl" color="teal" variant="light">
                  {completedPagination.total}
                </Badge>
              )}
            </Group>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending">
          <PendingReviewsTabContent
            filteredPendingReviews={filteredPendingReviews}
            onReviewClick={handleReviewClick}
          />
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          <CompletedReviewsTabContent
            completedReviews={completedReviews}
            myCompletedReviews={myCompletedReviews}
            otherCompletedReviews={otherCompletedReviews}
            isLoadingCompleted={isLoadingCompleted}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            selectedInterviewId={selectedInterviewId}
            onReviewClick={handleReviewClick}
            onCloseReview={handleCloseReview}
            isMyReview={isMyReview}
            completedPagination={completedPagination}
            completedPage={completedPage}
            onPageChange={setCompletedPage}
          />
        </Tabs.Panel>
      </Tabs>

      <ReviewModal
        opened={!!selectedInterviewId}
        onClose={handleCloseReview}
        interviewId={selectedInterviewId}
        interview={selectedInterview}
        reviewId={selectedReviewId}
        onSuccess={handleCloseReview}
      />
    </Container>
  );
}
