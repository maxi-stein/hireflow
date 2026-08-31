import { useState } from 'react';
import { Box, Group, Stack, Text, Badge, Card, Button, Collapse, Title } from '@mantine/core';
import { IconCalendarEvent, IconClock, IconStarFilled, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InterviewStatus, type Interview } from '../../../services/interview.service';
import { getEffectiveInterviewStatus } from '../../../utils/interview.utils';
import { getScoreColor } from '../../../utils/score.utils';

import { useAppStore } from '../../../store/useAppStore';

function InterviewCard({ interview, applicationId }: { interview: Interview; applicationId: string }) {
  const { t, i18n } = useTranslation('reviews');
  const navigate = useNavigate();
  const user = useAppStore(state => state.user);
  const [showMoreStrengths, setShowMoreStrengths] = useState(false);
  const [showMoreWeaknesses, setShowMoreWeaknesses] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const effectiveStatus = getEffectiveInterviewStatus(interview);
  const reviews = interview.reviews?.filter(r => r.candidate_application_id === applicationId) || [];

  const isScheduled = effectiveStatus === InterviewStatus.SCHEDULED;
  const isPendingReview = effectiveStatus === InterviewStatus.COMPLETED && reviews.length === 0;
  const isReviewed = effectiveStatus === InterviewStatus.COMPLETED && reviews.length > 0;

  const isInterviewer = interview.interviewers?.some(i => i.id === user?.id) || false;
  const hasUserReviewed = reviews.some(r => r.employee?.id === user?.id);
  const canUploadReview = effectiveStatus === InterviewStatus.COMPLETED && isInterviewer && !hasUserReviewed;

  // Colors based on status
  let mainColor = 'gray';
  if (isScheduled) mainColor = 'blue';
  if (isPendingReview) mainColor = 'orange';
  if (isReviewed) {
    const avgScore = reviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / reviews.length;
    mainColor = getScoreColor(avgScore);
  }

  const interviewersText = interview.interviewers?.map(i => `${i.user.first_name} ${i.user.last_name} (${i.position})`).join(', ') || t('card.unknownPosition');

  return (
    <Card withBorder shadow="sm" radius="md" p="md">
      {/* Row 1 */}
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Box>
          <Group gap="xs" mb={4}>
            <Title order={4} c="light-dark(var(--mantine-color-blue-7), var(--mantine-color-white))">{interview.title}</Title>
            {isPendingReview && (
              <Badge color="orange" variant="light" leftSection={<IconClock size={12} />}>
                {t('candidateDisplay.reviewPendingBadge')}
              </Badge>
            )}
            {isScheduled && (
              <Badge color="blue" variant="light" leftSection={<IconCalendarEvent size={12} />}>
                {t('candidateDisplay.scheduledBadge')}
              </Badge>
            )}
          </Group>
          <Text size="md" c="dimmed" mb={8}>
            {interviewersText}
          </Text>
          <Group gap="xs">
            <IconCalendarEvent size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
            <Text size="sm" c="dimmed">
              {new Date(interview.scheduled_time).toLocaleDateString(i18n.language, { month: 'long', day: 'numeric', year: 'numeric' })} • {new Date(interview.scheduled_time).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Group>
        </Box>

        <Box
          style={{
            backgroundColor: `var(--mantine-color-${mainColor}-light)`,
            borderRadius: 'var(--mantine-radius-md)',
            padding: '2px 8px',
            border: `1px solid var(--mantine-color-${mainColor}-outline)`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {isReviewed ? (
            <>
              <IconStarFilled size={14} style={{ color: `var(--mantine-color-${mainColor}-filled)` }} />
              <Text fw={600} size="xs" c={`${mainColor}.7`}>
                {(reviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / reviews.length).toFixed(1)}
              </Text>
            </>
          ) : isScheduled ? (
            <Text fw={600} size="xs" c="blue.7">{t('candidateDisplay.notHappenedYet')}</Text>
          ) : (
            <Text fw={600} size="xs" c="orange.7">{t('candidateDisplay.noScore')}</Text>
          )}
        </Box>
      </Group>

      {/* Row 2: Strengths and Weaknesses */}
      {isReviewed && reviews.length > 0 && (
        <Stack gap="md" mt="md">
          {/* Strengths section */}
          <Box>
            <Text c="green.8" fw={700} size="sm" mb="xs">{t('candidateDisplay.strengths').toUpperCase()}</Text>
            <Text size="sm" c="dimmed" fw={600} mb={4}>
              {reviews[0].employee?.user?.first_name} {reviews[0].employee?.user?.last_name}
            </Text>
            <Group gap="xs">
              {reviews[0].strengths?.map((s, idx) => (
                <Badge key={idx} size="md" color="green" variant="light" bd="1px solid var(--mantine-color-green-filled)">
                  {s}
                </Badge>
              ))}
              {(!reviews[0].strengths || reviews[0].strengths.length === 0) && <Text size="sm" c="dimmed">-</Text>}
            </Group>

            {reviews.length > 1 && (
              <>
                <Collapse in={showMoreStrengths}>
                  {reviews.slice(1).map((r) => (
                    <Box key={r.id} mt="sm">
                      <Text size="sm" c="dimmed" fw={600} mb={4}>
                        {r.employee?.user?.first_name} {r.employee?.user?.last_name}
                      </Text>
                      <Group gap="xs">
                        {r.strengths?.map((s, idx) => (
                          <Badge key={idx} size="md" color="green" variant="light" bd="1px solid var(--mantine-color-green-filled)">
                            {s}
                          </Badge>
                        ))}
                        {(!r.strengths || r.strengths.length === 0) && <Text size="sm" c="dimmed">-</Text>}
                      </Group>
                    </Box>
                  ))}
                </Collapse>
                <Group justify="center" mt="xs">
                  <Button
                    variant="subtle"
                    color="green"
                    size="xs"
                    rightSection={showMoreStrengths ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    onClick={() => setShowMoreStrengths(!showMoreStrengths)}
                  >
                    {showMoreStrengths ? t('candidateDisplay.showLess') : t('candidateDisplay.showMore')}
                  </Button>
                </Group>
              </>
            )}
          </Box>

          {/* Weaknesses section */}
          <Box>
            <Text c="red.8" fw={700} size="sm" mb="xs">{t('candidateDisplay.weaknesses').toUpperCase()}</Text>
            <Text size="sm" c="dimmed" fw={600} mb={4}>
              {reviews[0].employee?.user?.first_name} {reviews[0].employee?.user?.last_name}
            </Text>
            <Group gap="xs">
              {reviews[0].weaknesses?.map((w, idx) => (
                <Badge key={idx} size="md" color="red" variant="light" bd="1px solid var(--mantine-color-red-filled)">
                  {w}
                </Badge>
              ))}
              {(!reviews[0].weaknesses || reviews[0].weaknesses.length === 0) && <Text size="sm" c="dimmed">-</Text>}
            </Group>

            {reviews.length > 1 && (
              <>
                <Collapse in={showMoreWeaknesses}>
                  {reviews.slice(1).map((r) => (
                    <Box key={r.id} mt="sm">
                      <Text size="sm" c="dimmed" fw={600} mb={4}>
                        {r.employee?.user?.first_name} {r.employee?.user?.last_name}
                      </Text>
                      <Group gap="xs">
                        {r.weaknesses?.map((w, idx) => (
                          <Badge key={idx} size="md" color="red" variant="light" bd="1px solid var(--mantine-color-red-filled)">
                            {w}
                          </Badge>
                        ))}
                        {(!r.weaknesses || r.weaknesses.length === 0) && <Text size="sm" c="dimmed">-</Text>}
                      </Group>
                    </Box>
                  ))}
                </Collapse>
                <Group justify="center" mt="xs">
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    rightSection={showMoreWeaknesses ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                    onClick={() => setShowMoreWeaknesses(!showMoreWeaknesses)}
                  >
                    {showMoreWeaknesses ? t('candidateDisplay.showLess') : t('candidateDisplay.showMore')}
                  </Button>
                </Group>
              </>
            )}
          </Box>
        </Stack>
      )}

      {/* Row 3 */}
      <Box mt="lg">
        {canUploadReview ? (
          <Card withBorder style={{ borderColor: 'var(--mantine-color-orange-5)' }}>
            <Group justify="space-between">
              <Text size="sm">{t('candidateDisplay.interviewPastNoReview')}</Text>
              <Button color="orange" size="sm" onClick={() => navigate('/manage/reviews?tab=completed')}>
                {t('candidateDisplay.uploadReview')}
              </Button>
            </Group>
          </Card>
        ) : isReviewed ? (
          <Card withBorder style={{ borderColor: 'var(--mantine-color-gray-3)' }}>
            <Group justify="space-between">
              <Text size="sm" fw={500}>{t('candidateDisplay.notes')}</Text>
              <Button
                variant="light"
                color="blue"
                size="xs"
                rightSection={showNotes ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                onClick={() => setShowNotes(!showNotes)}
              >
                {showNotes ? t('candidateDisplay.hideNotes') : t('candidateDisplay.viewNotes')}
              </Button>
            </Group>
            <Collapse in={showNotes}>
              <Stack gap="md" mt="md">
                {reviews.map((r, idx) => (
                  <Box key={r.id || idx}>
                    <Text size="sm" c="dimmed" fw={600} mb={4}>
                      {r.employee?.user?.first_name} {r.employee?.user?.last_name}
                    </Text>
                    <Text size="sm">
                      {r.notes || '-'}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Collapse>
          </Card>
        ) : isScheduled ? (
          <Card withBorder style={{ borderColor: 'var(--mantine-color-blue-5)' }}>
            <Group justify="space-between">
              <Text size="md" fw={500} c="blue.6">{t('candidateDisplay.interviewNotHappenedYet')}</Text>
              <Button color="blue" size="sm" onClick={() => {
                const date = new Date(interview.scheduled_time).toISOString().split('T')[0];
                navigate(`/manage/interviews?date=${date}&interviewId=${interview.id}`);
              }}>
                {t('candidateDisplay.viewSchedule')}
              </Button>
            </Group>
          </Card>
        ) : null}
      </Box>
    </Card>
  );
}

interface CandidateInterviewsDisplayProps {
  interviews: Interview[];
  applicationId: string;
}

export function CandidateInterviewsDisplay({ interviews, applicationId }: CandidateInterviewsDisplayProps) {
  const { t } = useTranslation('reviews');

  if (!interviews || interviews.length === 0) {
    return (
      <Card withBorder p="md" mt="md" bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
        <Text size="md" fw={500} c="dimmed">{t('candidateDisplay.noInterviews')}</Text>
      </Card>
    );
  }

  return (
    <Stack gap="xs" mt="md">
      {interviews.map(interview => (
        <InterviewCard key={interview.id} interview={interview} applicationId={applicationId} />
      ))}
    </Stack>
  );
}
