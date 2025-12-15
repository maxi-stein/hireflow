import { Container, Title, Paper, Stack, Group, Box, Text, Button, Tabs, Badge, Collapse, TextInput } from '@mantine/core';
import { useState, useMemo } from 'react';
import { useMyPendingReviewsQuery, useMyCompletedReviewsQuery } from '../../hooks/api/useInterviewReviews';
import { IconClipboardCheck, IconHistory, IconSearch } from '@tabler/icons-react';
import { InterviewReviewForm } from '../../components/employee/reviews/InterviewReviewForm';
import { CandidateAvatar } from '../../components/shared/CandidateAvatar';

export function ReviewsPage() {
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

  const filteredPendingReviews = useMemo(() => {
    return pendingReviews
      .filter(interview => {
        const candidate = interview.applications?.[0]?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.scheduled_time).getTime() - new Date(a.scheduled_time).getTime());
  }, [pendingReviews, searchQuery]);

  const filteredCompletedReviews = useMemo(() => {
    return completedReviews
      .filter(review => {
        const candidate = review.candidate_application?.candidate?.user;
        if (!candidate) return false;
        const fullName = `${candidate.first_name} ${candidate.last_name}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [completedReviews, searchQuery]);

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
            <Stack>
              {filteredPendingReviews.map(interview => (
                  <Box key={interview.id} style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                    <Group justify="space-between" p="sm">
                      <Group>
                        <CandidateAvatar
                          candidateId={interview.applications?.[0]?.candidate?.id || ''}
                          firstName={interview.applications?.[0]?.candidate?.user?.first_name}
                          lastName={interview.applications?.[0]?.candidate?.user?.last_name}
                          radius="xl"
                        />
                        <Box>
                          <Text fw={500}>
                            {interview.applications?.[0]?.candidate?.user?.first_name} {interview.applications?.[0]?.candidate?.user?.last_name}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {interview.applications?.[0]?.job_offer?.position}
                          </Text>
                        </Box>
                      </Group>
                      <Group>
                        <Box style={{ textAlign: 'right' }}>
                          <Text size="sm">
                            {new Date(interview.scheduled_time).toLocaleDateString()}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {new Date(interview.scheduled_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </Text>
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
                    </Group>
                    <Collapse in={selectedInterviewId === interview.id}>
                      <Box p="md">
                        {selectedInterviewId === interview.id && (
                          <InterviewReviewForm 
                            interviewId={interview.id} 
                            onCancel={handleCloseReview}
                            onSuccess={handleCloseReview}
                          />
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
                {filteredPendingReviews.length === 0 && (
                  <Text c="dimmed" ta="center" py="xl">No pending reviews found.</Text>
                )}
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          <Paper withBorder p="md" radius="md">
            <Stack>
              {filteredCompletedReviews.map(review => (
                  <Box key={review.id} style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
                    <Group justify="space-between" p="sm">
                      <Group>
                        <CandidateAvatar
                          candidateId={review.candidate_application?.candidate?.id || ''}
                          firstName={review.candidate_application?.candidate?.user?.first_name}
                          lastName={review.candidate_application?.candidate?.user?.last_name}
                          radius="xl"
                        />
                        <Box>
                          <Text fw={500}>
                            {review.candidate_application?.candidate?.user?.first_name} {review.candidate_application?.candidate?.user?.last_name}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {review.candidate_application?.job_offer?.position}
                          </Text>
                        </Box>
                      </Group>
                      <Group>
                        <Box style={{ textAlign: 'right' }}>
                          <Text size="sm">
                            Reviewed on {new Date(review.created_at).toLocaleDateString()}
                          </Text>
                          <Group gap="xs" justify="flex-end">
                            <Text size="sm" fw={500}>Score: {review.score}/10</Text>
                          </Group>
                        </Box>
                        <Button 
                          variant={selectedInterviewId === review.interview_id ? "filled" : "subtle"}
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReviewClick(review.interview_id);
                          }}
                        >
                          {selectedInterviewId === review.interview_id ? 'Close' : 'View Details'}
                        </Button>
                      </Group>
                    </Group>
                    <Collapse in={selectedInterviewId === review.interview_id}>
                      <Box p="md">
                        {selectedInterviewId === review.interview_id && (
                          <InterviewReviewForm 
                            interviewId={review.interview_id} 
                            onCancel={handleCloseReview}
                            onSuccess={handleCloseReview}
                          />
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
                {filteredCompletedReviews.length === 0 && (
                  <Text c="dimmed" ta="center" py="xl">No completed reviews found.</Text>
                )}
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
