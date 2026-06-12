import { Box, Group, Alert, Stack, Text, Badge, SimpleGrid, Button } from '@mantine/core';
import { IconCalendarEvent, IconHistory, IconMessageCircle, IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { getScoreColor } from '../../../utils/score.utils';
import { TimeDisplay } from '../TimeDisplay';

interface CandidateInterviewsDisplayProps {
  interviews: Interview[];
  applicationId: string;
}

export function CandidateInterviewsDisplay({ interviews, applicationId }: CandidateInterviewsDisplayProps) {
  const { t } = useTranslation('reviews');
  const navigate = useNavigate();

  // Always render a Detail to maintain alignment
  if (!interviews || interviews.length === 0) {
    return (
      <Alert variant="light" color="gray" p="xs">
        <Text size="sm" c="dimmed">{t('candidateDisplay.noInterviews')}</Text>
      </Alert>
    );
  }

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
              title={t('candidateDisplay.interviewScheduled')}
              icon={<IconCalendarEvent size={16} />}
            >
              <TimeDisplay
                date={interview.scheduled_time}
                variant="date-time"
                color="blue"
                size="sm"
              />
            </Alert>
          );
        }

        // 2. Completed / Pending Review / Reviewed
        if (effectiveStatus === InterviewStatus.COMPLETED) {
          const reviews = interview.reviews?.filter(r => r.candidate_application_id === applicationId) || [];

          return (
            <Box key={interview.id}>
              <Group gap="sm" mb="xs">
                <TimeDisplay
                  date={interview.scheduled_time}
                  variant="date-only"
                  color="gray"
                  size="xs"
                />
                <Group gap="xs">
                  <IconHistory size={14} style={{ opacity: 0.7 }} />
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">
                    {t('candidateDisplay.interviewCompleted')}
                  </Text>
                </Group>
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
                            <Text fw={600} size="sm" lh={1.2} mb={2}>{t('candidateDisplay.interviewReview')}</Text>
                            <Text size="sm" fw={500} mb={4}>
                              {review.employee?.user?.first_name} {review.employee?.user?.last_name}
                            </Text>
                            <Group gap={6}>
                              <Badge color={getScoreColor(review.score)} variant="filled" size="sm">
                                {review.score ? `${review.score}/10` : 'N/A'}
                              </Badge>
                            </Group>
                          </Box>
                        </Group>
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Button 
                            variant="light" 
                            size="xs" 
                            onClick={() => navigate('/manage/reviews?tab=completed')}
                          >
                            {t('candidateDisplay.viewDetails')}
                          </Button>
                        </Box>
                      </SimpleGrid>
                    </Alert>
                  ))}
                </Stack>
              ) : (
                <Alert
                  variant="light"
                  color="orange"
                  title={t('candidateDisplay.reviewPending')}
                  icon={<IconClock size={16} />}
                >
                  <Text size="sm">{t('candidateDisplay.waitingFeedback')}</Text>
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
