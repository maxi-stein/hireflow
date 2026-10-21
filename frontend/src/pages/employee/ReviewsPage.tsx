import { Container, Title, Paper, Stack, Box, Text, Tabs, Badge, TextInput, Group, useMantineColorScheme } from '@mantine/core';
import { IconClipboardCheck, IconHistory, IconSearch, IconUserCheck, IconUsers } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { APP_MAX_WIDTH } from '../../constants/layout';
import { useReviews } from '../../hooks/useReviews';
import { groupPendingReviewsByDate } from '../../components/employee/reviews/groupPendingReviewsByDate';
import { ReviewDateGroup } from '../../components/employee/reviews/ReviewDateGroup';
import { PendingReviewCard } from '../../components/employee/reviews/PendingReviewCard';
import { groupCompletedReviews } from '../../components/employee/reviews/groupCompletedReviews';
import { CompletedReviewsAccordion } from '../../components/employee/reviews/CompletedReviewsAccordion';
import { ReviewModal } from '../../components/employee/reviews/ReviewModal';

export function ReviewsPage() {
  const [searchParams] = useSearchParams();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation(['reviews', 'profile']);

  const {
    pendingReviews,
    filteredPendingReviews,
    myCompletedReviews,
    otherCompletedReviews,
    searchQuery,
    setSearchQuery,
    selectedInterviewId,
    selectedInterview,
    selectedReviewId,
    handleReviewClick,
    handleCloseReview,
    isMyReview,
  } = useReviews();

  const pendingGroups = groupPendingReviewsByDate(filteredPendingReviews);
  const myCompletedGroups = groupCompletedReviews(myCompletedReviews);
  const otherCompletedGroups = groupCompletedReviews(otherCompletedReviews);

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          w={{ base: '100%', sm: 300 }}
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
            <span>{t('tabs.completed')}</span>
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab 1: Pending Reviews */}
        <Tabs.Panel value="pending">
          <Paper
            withBorder
            p="xl"
            radius="lg"
            bg="light-dark(#ffffff, #1e293b)"
            style={{
              borderColor: 'light-dark(#e2e8f0, #334155)',
              boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            {filteredPendingReviews.length === 0 ? (
              <Paper
                p="3rem"
                radius="md"
                ta="center"
                style={{
                  border: '2px dashed light-dark(#e2e8f0, #334155)',
                  backgroundColor: 'light-dark(#f8fafc, #0f172a)',
                }}
              >
                <Box
                  p={12}
                  bg="light-dark(#ffffff, #1e293b)"
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    margin: '0 auto 12px',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    color: '#2563eb',
                  }}
                >
                  <IconClipboardCheck size={28} />
                </Box>
                <Text fw={700} size="md" c="light-dark(#0f172a, #f8fafc)">
                  {t('empty.pending')}
                </Text>
              </Paper>
            ) : (
              pendingGroups.map(group => (
                <ReviewDateGroup key={group.dateKey} dateKey={group.dateKey}>
                  {group.positions.map(({ position, candidates }) => (
                    <Box key={position} mb="md">
                      <Group gap="xs" mb="sm" pl="xs">
                        <Badge variant="light" color="teal" size="lg" radius="md">
                          {position}
                        </Badge>
                      </Group>
                      <Stack gap="sm">
                        {candidates.map(({ candidateId, interviews }) => (
                          <PendingReviewCard
                            key={candidateId}
                            candidateId={candidateId}
                            interviews={interviews}
                            selectedInterviewId={selectedInterviewId}
                            onReviewClick={handleReviewClick}
                            onCloseReview={handleCloseReview}
                          />
                        ))}
                      </Stack>
                    </Box>
                  ))}
                </ReviewDateGroup>
              ))
            )}
          </Paper>
        </Tabs.Panel>

        {/* Tab 2: Completed Reviews */}
        <Tabs.Panel value="completed">
          <Paper
            withBorder
            p="xl"
            radius="lg"
            bg="light-dark(#ffffff, #1e293b)"
            style={{
              borderColor: 'light-dark(#e2e8f0, #334155)',
              boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
            }}
          >
            <Stack gap="xl">
              {/* My Reviews Section */}
              <Box>
                <Group gap="xs" mb="md" align="center">
                  <Box p={6} bg="light-dark(#eff6ff, rgba(37, 99, 235, 0.15))" style={{ borderRadius: 8, color: '#2563eb' }}>
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
                    onReviewClick={handleReviewClick}
                    onCloseReview={handleCloseReview}
                    isMyReview={isMyReview}
                  />
                )}
              </Box>

              {/* Team Reviews Section */}
              <Box pt="md" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
                <Group gap="xs" mb="md" align="center">
                  <Box p={6} bg="light-dark(#f0fdf4, rgba(22, 163, 74, 0.15))" style={{ borderRadius: 8, color: '#16a34a' }}>
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

      {/* Review Modal */}
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
