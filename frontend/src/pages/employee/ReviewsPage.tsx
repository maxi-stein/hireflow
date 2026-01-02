import { Container, Title, Paper, Stack, Group, Box, Text, Button, Tabs, Badge, Collapse, TextInput, Divider, useMantineColorScheme } from '@mantine/core';
import { useState, useMemo } from 'react';
import { useMyPendingReviewsQuery, useMyCompletedReviewsQuery } from '../../hooks/api/useInterviewReviews';
import { IconClipboardCheck, IconHistory, IconSearch, IconBriefcase } from '@tabler/icons-react'; // removed IconUser
import { InterviewReviewForm } from '../../components/employee/reviews/InterviewReviewForm';
import { CandidateAvatar } from '../../components/shared/CandidateAvatar';
import { ScoreBadge } from '../../components/shared/ScoreBadge';
import { useAppStore } from '../../store/useAppStore';
import type { InterviewReview } from '../../services/interview-review.service';
import type { Interview } from '../../services/interview.service';

export function ReviewsPage() {
  const { colorScheme } = useMantineColorScheme();
  const user = useAppStore(state => state.user);
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: pendingReviewsData } = useMyPendingReviewsQuery();
  const { data: completedReviewsData } = useMyCompletedReviewsQuery();

  const pendingReviews = pendingReviewsData?.data || [];
  const completedReviews = completedReviewsData?.data || [];

  const handleReviewClick = (interviewId: string) => {
    setSelectedInterviewId(currentId => currentId === interviewId ? null : interviewId);
  };

  const handleCloseReview = () => {
    setSelectedInterviewId(null);
  };

  // Filter Pending Reviews
  const filteredPendingReviews = useMemo(() => {
    return pendingReviews
      .filter(interview => {
        const candidate = interview.applications?.[0]?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()); // Chronological
  }, [pendingReviews, searchQuery]);

  // Filter Completed Reviews
  const filteredCompletedReviews = useMemo(() => {
    return completedReviews
      .filter(review => {
        const candidate = review.candidate_application?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); // Newest first
  }, [completedReviews, searchQuery]);


  // Improve ownership check: check employee ID OR user ID
  const isMyReview = (r: InterviewReview) => {
    console.log(user);
    console.log(r);
    if (!user) return false;

    if (user.id && r.employee?.id === user.id) return true;

    return false;
  };

  const myCompletedReviews = filteredCompletedReviews.filter(isMyReview);
  const otherCompletedReviews = filteredCompletedReviews.filter(r => !isMyReview(r));

  // --- Grouping Helpers ---

  // For Pending (Interview[])
  const renderPendingReviews = (interviews: Interview[]) => {
    // 1. Group by Job
    const byJob: Record<string, Record<string, Interview[]>> = {};

    interviews.forEach(interview => {
      const jobTitle = interview.applications?.[0]?.job_offer?.position || 'Unknown Job';
      const candidateId = interview.applications?.[0]?.candidate?.id || 'unknown';

      if (!byJob[jobTitle]) byJob[jobTitle] = {};
      if (!byJob[jobTitle][candidateId]) byJob[jobTitle][candidateId] = [];

      byJob[jobTitle][candidateId].push(interview);
    });

    return Object.entries(byJob).map(([jobTitle, candidatesMap]) => (
      <Box key={jobTitle} mb="xl">
        <Group mb="md">
          <IconBriefcase size={20} style={{ opacity: 0.7 }} />
          <Title order={4}>{jobTitle}</Title>
        </Group>
        <Stack gap="md" pl={{ base: 0, md: 'md' }}>
          {Object.entries(candidatesMap).map(([candidateId, candidateInterviews]) => {
            const first = candidateInterviews[0];
            const candidate = first.applications[0].candidate;

            return (
              <Paper key={candidateId} withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'} p="sm">
                <Group justify="space-between" mb="xs" onClick={() => { }} style={{ cursor: 'default' }}>
                  <Group gap="sm">
                    <CandidateAvatar
                      candidateId={candidateId}
                      firstName={candidate?.user?.first_name}
                      lastName={candidate?.user?.last_name}
                      radius="xl"
                      size={32}
                    />
                    <Text fw={600} size="sm">{candidate?.user?.first_name} {candidate?.user?.last_name}</Text>
                  </Group>
                </Group>
                <Stack gap={0} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
                  {candidateInterviews.map(interview => (
                    <Box key={interview.id} p="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
                      <Group justify="space-between">
                        <Box>
                          <Text size="sm">{new Date(interview.scheduled_time).toLocaleString()}</Text>
                          <Text size="xs" c="dimmed">{interview.type} Interview</Text>
                        </Box>
                        <Button
                          variant={selectedInterviewId === interview.id ? "filled" : "light"}
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewClick(interview.id);
                          }}
                        >
                          {selectedInterviewId === interview.id ? 'Close' : 'Review'}
                        </Button>
                      </Group>
                      <Collapse in={selectedInterviewId === interview.id}>
                        <Box p="md">
                          {selectedInterviewId === interview.id && (
                            <InterviewReviewForm
                              interviewId={interview.id}
                              onSuccess={handleCloseReview}
                            />
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    ));
  };


  // For Completed (InterviewReview[])
  const renderCompletedReviews = (reviews: InterviewReview[]) => {
    // 1. Group by Job
    const byJob: Record<string, Record<string, InterviewReview[]>> = {};

    reviews.forEach(review => {
      const jobTitle = review.candidate_application?.job_offer?.position || 'Unknown Job';
      const candidateId = review.candidate_application?.candidate?.id || 'unknown';

      if (!byJob[jobTitle]) byJob[jobTitle] = {};
      if (!byJob[jobTitle][candidateId]) byJob[jobTitle][candidateId] = [];

      byJob[jobTitle][candidateId].push(review);
    });

    return Object.entries(byJob).map(([jobTitle, candidatesMap]) => (
      <Box key={jobTitle} mb="xl">
        <Group mb="md">
          <IconBriefcase size={20} style={{ opacity: 0.7 }} />
          <Title order={4}>{jobTitle}</Title>
        </Group>
        <Stack gap="md" pl={{ base: 0, md: 'md' }}>
          {Object.entries(candidatesMap).map(([candidateId, candidateReviews]) => {
            const first = candidateReviews[0];
            const candidate = first.candidate_application?.candidate;

            return (
              <Paper key={candidateId} withBorder radius="md" bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'} p="sm">
                <Group justify="space-between" mb="xs">
                  <Group gap="sm">
                    <CandidateAvatar
                      candidateId={candidateId}
                      firstName={candidate?.user?.first_name}
                      lastName={candidate?.user?.last_name}
                      radius="xl"
                      size={32}
                    />
                    <Text fw={600} size="sm">{candidate?.user?.first_name} {candidate?.user?.last_name}</Text>
                  </Group>
                  <Badge variant="light">{candidateReviews.length} {candidateReviews.length > 1 ? `reviews` : 'review'}</Badge>
                </Group>
                <Stack gap={0} style={{ borderTop: '1px solid var(--mantine-color-default-border)' }}>
                  {candidateReviews.map(review => (
                    <Box key={review.id} p="sm" style={{ borderBottom: '1px solid var(--mantine-color-default-border)' }}>
                      <Group justify="space-between" align="flex-start">
                        <Box>
                          <Group gap="xs">
                            <Text size="sm" fw={500}>By: {review.employee?.user.first_name} {review.employee?.user.last_name}</Text>
                            <ScoreBadge score={review.score} size="xs" />
                          </Group>
                          <Text size="xs" c="dimmed">
                            {new Date(review.created_at).toLocaleDateString()}
                          </Text>
                        </Box>
                        <Button
                          variant="subtle"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewClick(review.interview_id);
                          }}
                        >
                          {selectedInterviewId === review.interview_id ? 'Close' : 'Details'}
                        </Button>
                      </Group>
                      <Collapse in={selectedInterviewId === review.interview_id} mt="xs">
                        {selectedInterviewId === review.interview_id && (
                          <InterviewReviewForm
                            interviewId={review.interview_id}
                            onSuccess={handleCloseReview}
                          />
                        )}
                      </Collapse>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    ));
  };


  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>My Reviews</Title>
        <TextInput
          placeholder="Search by candidate name..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          w={300}
        />
      </Group>

      <Tabs defaultValue="pending" keepMounted={false}>
        <Tabs.List mb="md">
          <Tabs.Tab value="pending" leftSection={<IconClipboardCheck size={16} />}>
            <Group gap="xs" align="center">
              Pending Reviews
              {pendingReviews.length > 0 && (
                <Badge size="xs" circle color="blue">
                  {pendingReviews.length}
                </Badge>
              )}
            </Group>
          </Tabs.Tab>
          <Tabs.Tab value="completed" leftSection={<IconHistory size={16} />}>
            Completed Reviews
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending">
          <Paper withBorder p="md" radius="md">
            {filteredPendingReviews.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">No pending reviews found.</Text>
            ) : (
              renderPendingReviews(filteredPendingReviews)
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          <Paper withBorder p="md" radius="md">
            <Stack gap="xl">
              <Box>
                <Title order={4} mb="md" c="dimmed" tt="uppercase" size="sm">My Reviews</Title>
                {myCompletedReviews.length === 0 ? (
                  <Text c="dimmed" size="sm" fs="italic">No reviews yet.</Text>
                ) : (
                  renderCompletedReviews(myCompletedReviews)
                )}
              </Box>

              {otherCompletedReviews.length > 0 && (
                <Box>
                  <Divider mb="lg" />
                  <Title order={4} mb="md" c="dimmed" tt="uppercase" size="sm">Team Reviews</Title>
                  {renderCompletedReviews(otherCompletedReviews)}
                </Box>
              )}
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
