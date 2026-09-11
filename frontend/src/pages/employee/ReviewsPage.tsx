import { Container, Title, Paper, Stack, Box, Text, Tabs, Badge, TextInput, Group } from '@mantine/core';
import { IconClipboardCheck, IconHistory, IconSearch } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useReviews } from '../../hooks/useReviews';
import { groupByJob, pendingExtractor, completedExtractor } from '../../components/employee/reviews/groupByJob';
import { ReviewJobGroup } from '../../components/employee/reviews/ReviewJobGroup';
import { PendingReviewCard } from '../../components/employee/reviews/PendingReviewCard';
import { CompletedReviewCard } from '../../components/employee/reviews/CompletedReviewCard';

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

  const pendingGroups = groupByJob(filteredPendingReviews, pendingExtractor, t('card.unknownJob'));
  const myCompletedGroups = groupByJob(myCompletedReviews, completedExtractor, t('card.unknownJob'));
  const otherCompletedGroups = groupByJob(otherCompletedReviews, completedExtractor, t('card.unknownJob'));

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
        <Tabs.List mb="md">
          <Tabs.Tab value="pending" leftSection={<IconClipboardCheck size={16} />}>
            <Group gap="xs" align="center">
              {t('tabs.pending')}
              {pendingReviews.length > 0 && (
                <Badge size="xs" circle color="blue">
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
                <ReviewJobGroup key={group.jobTitle} jobTitle={group.jobTitle}>
                  {group.candidates.map(({ candidateId, items }) => (
                    <PendingReviewCard
                      key={candidateId}
                      candidateId={candidateId}
                      interviews={items}
                      selectedInterviewId={selectedInterviewId}
                      onReviewClick={handleReviewClick}
                      onCloseReview={handleCloseReview}
                    />
                  ))}
                </ReviewJobGroup>
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
                  myCompletedGroups.map(group => (
                    <ReviewJobGroup key={group.jobTitle} jobTitle={group.jobTitle}>
                      {group.candidates.map(({ candidateId, items }) => (
                        <CompletedReviewCard
                          key={candidateId}
                          candidateId={candidateId}
                          reviews={items}
                          selectedInterviewId={selectedInterviewId}
                          onReviewClick={handleReviewClick}
                          onCloseReview={handleCloseReview}
                          isMyReview={isMyReview}
                        />
                      ))}
                    </ReviewJobGroup>
                  ))
                )}
              </Box>

              <Box>
                <Title order={4} mb="md" c="dimmed" tt="uppercase" size="sm">{t('sections.teamReviews')}</Title>
                {otherCompletedReviews.length === 0 ? (
                  <Text c="dimmed" size="sm" fs="italic">{t('empty.completed')}</Text>
                ) : (
                  otherCompletedGroups.map(group => (
                    <ReviewJobGroup key={group.jobTitle} jobTitle={group.jobTitle}>
                      {group.candidates.map(({ candidateId, items }) => (
                        <CompletedReviewCard
                          key={candidateId}
                          candidateId={candidateId}
                          reviews={items}
                          selectedInterviewId={selectedInterviewId}
                          onReviewClick={handleReviewClick}
                          onCloseReview={handleCloseReview}
                          isMyReview={isMyReview}
                        />
                      ))}
                    </ReviewJobGroup>
                  ))
                )}
              </Box>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
