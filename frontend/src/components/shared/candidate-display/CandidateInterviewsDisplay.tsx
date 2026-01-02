import { Box, Group, Alert, Stack, Text, Badge, SimpleGrid } from '@mantine/core';
import { IconCalendarEvent, IconHistory, IconMessageCircle, IconClock } from '@tabler/icons-react';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { getScoreColor } from '../../../utils/score.utils';

interface CandidateInterviewsDisplayProps {
  interviews: Interview[];
  applicationId: string;
}

export function CandidateInterviewsDisplay({ interviews, applicationId }: CandidateInterviewsDisplayProps) {
  if (!interviews || interviews.length === 0) return null;

  return (
    <Stack gap="xs" mt="md">
      {interviews.map(interview => {
        const effectiveStatus = getEffectiveInterviewStatus(interview);

        // 1. Scheduled Interview (Future)
        if (effectiveStatus === InterviewStatus.SCHEDULED) {
          return (
            <Alert
              key={interview.id}
              variant="light"
              color="blue"
              title="Interview Scheduled"
              icon={<IconCalendarEvent size={16} />}
            >
              <Text size="sm">{new Date(interview.scheduled_time).toLocaleString()}</Text>
            </Alert>
          );
        }

        // 2. Completed / Pending Review / Reviewed
        if (effectiveStatus === InterviewStatus.COMPLETED) {
          const reviews = interview.reviews?.filter(r => r.candidate_application_id === applicationId) || [];

          return (
            <Box key={interview.id}>
              <Group gap="xs" mb="xs">
                <IconHistory size={14} style={{ opacity: 0.7 }} />
                <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                  Interview - {new Date(interview.scheduled_time).toLocaleDateString()}
                </Text>
              </Group>

              {reviews.length > 0 ? (
                <Stack gap="xs">
                  {reviews.map(review => (
                    <Alert
                      key={review.id}
                      variant="light"
                      color="gray"
                      p="xs"
                    >
                      <SimpleGrid cols={2}>
                        <Group align="flex-start" wrap="nowrap">
                          <IconMessageCircle size={18} style={{ marginTop: 2 }} />
                          <Box>
                            <Text fw={600} size="sm" lh={1.2}>Interview Review</Text>
                            <Text size="xs" c="dimmed" mb={4}>
                              By: {review.employee?.user?.first_name} {review.employee?.user?.last_name}
                            </Text>
                            <Group gap={6}>
                              <Text size="xs" c="dimmed">Score:</Text>
                              <Badge color={getScoreColor(review.score)} variant="filled" size="xs">
                                {review.score ? `${review.score}/10` : 'N/A'}
                              </Badge>
                            </Group>
                          </Box>
                        </Group>
                        <Box>
                          {review.strengths && review.strengths.length > 0 && (
                            <Group gap={4} mb={4}>
                              <Text size="xs" fw={700} c="green" style={{ width: 70 }}>Strengths:</Text>
                              <Group gap={4} style={{ flex: 1 }}>
                                {review.strengths.slice(0, 3).map(s => <Badge key={s} size="xs" variant="outline" color="green" radius="sm">{s}</Badge>)}
                              </Group>
                            </Group>
                          )}
                          {review.weaknesses && review.weaknesses.length > 0 && (
                            <Group gap={4}>
                              <Text size="xs" fw={700} c="red" style={{ width: 70 }}>Weaknesses:</Text>
                              <Group gap={4} style={{ flex: 1 }}>
                                {review.weaknesses.slice(0, 3).map(w => <Badge key={w} size="xs" variant="outline" color="red" radius="sm">{w}</Badge>)}
                              </Group>
                            </Group>
                          )}
                        </Box>
                      </SimpleGrid>
                    </Alert>
                  ))}
                </Stack>
              ) : (
                <Alert
                  variant="light"
                  color="orange"
                  title="Review Pending"
                  icon={<IconClock size={16} />}
                >
                  <Text size="sm">Interview completed. Waiting for feedback.</Text>
                </Alert>
              )}
            </Box>
          );
        }

        return null;
      })}
    </Stack>
  );
}
