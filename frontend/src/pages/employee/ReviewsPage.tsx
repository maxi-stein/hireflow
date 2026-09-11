import { Container, Title, Paper, Stack, Box, Text, Tabs, Badge, TextInput, Group } from '@mantine/core';
import { IconClipboardCheck, IconHistory, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useReviews } from '../../hooks/useReviews';
import { groupPendingReviewsByDate } from '../../components/employee/reviews/groupPendingReviewsByDate';
import { ReviewDateGroup } from '../../components/employee/reviews/ReviewDateGroup';
import { PendingReviewCard } from '../../components/employee/reviews/PendingReviewCard';
import { groupCompletedReviews } from '../../components/employee/reviews/groupCompletedReviews';
import { CompletedReviewsAccordion } from '../../components/employee/reviews/CompletedReviewsAccordion';

export function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(['reviews', 'profile']);

  const {
    pendingReviews,
    filteredPendingReviews,
    myCompletedReviews,
    otherCompletedReviews,
    searchQuery,
    setSearchQuery,
    selectedInterviewId,
    handleReviewClick,
    handleCloseReview,
    isMyReview,
  } = useReviews();

  const pendingGroups = groupPendingReviewsByDate(filteredPendingReviews);
  const myCompletedGroups = groupCompletedReviews(myCompletedReviews);
  const otherCompletedGroups = groupCompletedReviews(otherCompletedReviews);

  return (
    <Container size={APP_MAX_WIDTH} py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>{t('title')}</Title>
        <TextInput
          placeholder={t('searchPlaceholder')}
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          w={300}
        />
      </Group>

      <Tabs defaultValue={searchParams.get('tab') || 'pending'} keepMounted={false}>
        <Tabs.List mb="lg">
          <Tabs.Tab value="pending" leftSection={<IconClipboardCheck size={16} />}>
            <Group gap="md" align="center">
              {t('tabs.pending')}
              {pendingReviews.length > 0 && (
                <Badge size="lg" circle color="blue">
                  {pendingReviews.length}
                </Badge>
              )}
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="completed" leftSection={<IconHistory size={16} />}>
            {t('tabs.completed')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending">
          <Paper withBorder p="md" radius="md">
            {filteredPendingReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">{t('empty.pending')}</Text>
            ) : (
              pendingGroups.map(group => (
                <ReviewDateGroup key={group.dateKey} dateKey={group.dateKey}>
                  {group.candidates.map(({ candidateId, interviews }) => (
                    <PendingReviewCard
                      key={candidateId}
                      candidateId={candidateId}
                      interviews={interviews}
                      selectedInterviewId={selectedInterviewId}
                      onReviewClick={handleReviewClick}
                      onCloseReview={handleCloseReview}
                    />
                  ))}
                </ReviewDateGroup>
              ))
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          <Paper withBorder p="md" radius="md">
            <Stack gap="xl">
              <Box>
                <Title order={4} mb="md" c="dimmed" tt="uppercase" size="sm">{t('sections.myReviews')}</Title>
                {myCompletedReviews.length === 0 ? (
                  <Text c="dimmed" size="sm" fs="italic">{t('empty.completed')}</Text>
                ) : (
                  <CompletedReviewsAccordion
                    groups={myCompletedGroups}
                    selectedInterviewId={selectedInterviewId}
                    onReviewClick={handleReviewClick}
                    onCloseReview={handleCloseReview}
                    isMyReview={isMyReview}
                  />
                )}
              </Box>

              <Box>
                <Title order={4} mb="md" c="dimmed" tt="uppercase" size="sm">{t('sections.teamReviews')}</Title>
                {otherCompletedReviews.length === 0 ? (
                  <Text c="dimmed" size="sm" fs="italic">{t('empty.completed')}</Text>
                ) : (
                  <CompletedReviewsAccordion
                    groups={otherCompletedGroups}
                    selectedInterviewId={selectedInterviewId}
                    onReviewClick={handleReviewClick}
                    onCloseReview={handleCloseReview}
                    isMyReview={isMyReview}
                  />
                )}
              </Box>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
