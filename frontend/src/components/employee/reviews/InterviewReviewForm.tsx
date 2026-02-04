import { useState, useEffect } from 'react';
import { Paper, Group, Text, Button, Stack, Textarea, NumberInput, TagsInput, LoadingOverlay, Grid, Divider, Box, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { useInterviewQuery } from '../../../hooks/api/useInterviews';
import { useInterviewReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation } from '../../../hooks/api/useInterviewReviews';


import { ScheduleInterviewModal } from '../../../components/employee/interviews/ScheduleInterviewModal';
import { useAppStore } from '../../../store/useAppStore';
import { validateWithJoi } from '../../../utils/form-validation';
import { interviewReviewSchema } from '../../../schemas/interveiw-review.schema';
import { useNavigate } from 'react-router-dom';
import { ScoreBadge } from '../../shared/ScoreBadge';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';

interface InterviewReviewFormProps {
  interviewId: string;
  onSuccess: () => void;
}

import { useTranslation } from 'react-i18next';

export function InterviewReviewForm({ interviewId, onSuccess }: InterviewReviewFormProps) {
  const { t, i18n } = useTranslation('reviews');
  const user = useAppStore(state => state.user);
  const navigate = useNavigate();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: interview, isLoading: isLoadingInterview } = useInterviewQuery(interviewId);
  const candidateId = interview?.applications?.[0]?.candidate?.id;
  const { data: reviews, isLoading: isLoadingReviews } = useInterviewReviewsQuery(interviewId);

  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();

  // Find if current user already reviewed
  const myReview = reviews?.find(r => r.employee_id === user?.id);
  const isEditMode = !!myReview;

  const form = useForm({
    initialValues: {
      score: 5,
      notes: '',
      strengths: [] as string[],
      weaknesses: [] as string[],
    },
    validate: validateWithJoi(interviewReviewSchema),
  });

  useEffect(() => {
    if (myReview) {
      form.initialize({
        score: myReview.score || 5,
        notes: myReview.notes || '',
        strengths: myReview.strengths || [],
        weaknesses: myReview.weaknesses || [],
      });
    }
  }, [myReview]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!interview || !user?.id) {
      notifications.show({ title: 'Error', message: t('form.notifications.missingData'), color: 'red' });
      return;
    }

    const applicationId = interview.applications?.[0]?.id;
    if (!applicationId) {
      notifications.show({ title: 'Error', message: t('form.notifications.noApp'), color: 'red' });
      return;
    }

    const payload = {
      employee_id: user.id,
      interview_id: interview.id,
      candidate_application_id: applicationId,
      ...values,
    };

    try {
      if (isEditMode && myReview) {
        await updateReviewMutation.mutateAsync({ id: myReview.id, data: payload });
        notifications.show({ title: 'Success', message: t('form.notifications.updateSuccess'), color: 'green' });
      } else {
        await createReviewMutation.mutateAsync(payload);
        notifications.show({ title: 'Success', message: t('form.notifications.createSuccess'), color: 'green' });
      }
      onSuccess();
      // Redirect to candidate profile
      if (candidateId) {
        navigate(`/manage/candidates/list/${candidateId}`);
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: t('form.notifications.submitError'), color: 'red' });
    }
  };

  if (isLoadingInterview || isLoadingReviews) {
    return (
      <Box style={{ position: 'relative', minHeight: '200px' }}>
        <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      </Box>
    );
  }

  if (!interview) {
    return <Text>{t('form.notifications.notFound')}</Text>;
  }

  const candidate = interview.applications?.[0]?.candidate?.user;
  const jobOffer = interview.applications?.[0]?.job_offer;

  return (
    <Box>
      <Title order={3}>
        {isEditMode ? t('form.editTitle') : t('form.title')}
      </Title>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <Paper withBorder p="md" radius="md">
              <Stack gap="xs">
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{t('form.labels.candidate')}</Text>
                  <Group gap="xs" align="center">
                    <Text size="lg" fw={500}>{candidate?.first_name} {candidate?.last_name}</Text>
                    {isEditMode && <ScoreBadge score={form.values.score} size="xs" />}
                  </Group>
                  <Text size="sm" c="dimmed">{candidate?.email}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{t('form.labels.position')}</Text>
                  <Text fw={500}>{jobOffer?.position}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{t('form.labels.interviewDate')}</Text>
                  <Text>{new Date(interview.scheduled_time).toLocaleString(i18n.language)}</Text>
                </Box>
                {myReview?.employee?.user && (
                  <>
                    <Divider />
                    <Box>
                      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>{t('form.labels.reviewer')}</Text>
                      <Text fw={500}>{myReview.employee.user.first_name} {myReview.employee.user.last_name}</Text>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>

            <Paper withBorder p="md" radius="md">
              <Stack align="center" justify="center" py="md">
                <CandidateAvatar
                  candidateId={candidateId || ''}
                  firstName={candidate?.first_name}
                  lastName={candidate?.last_name}
                  size={256}
                  radius="md"
                />
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="xl" radius="md">
            <form onSubmit={form.onSubmit(
              handleSubmit,
              (errors) => {
                notifications.show({
                  title: 'Validation Error',
                  message: t('form.notifications.validationError'),
                  color: 'red'
                });
              }
            )}>
              <Stack gap="lg">
                <NumberInput
                  label={t('form.labels.score')}
                  description={t('form.labels.scoreDesc')}
                  min={1}
                  max={10}
                  required
                  {...form.getInputProps('score')}
                />

                <Textarea
                  label={t('form.labels.notes')}
                  placeholder={t('form.labels.notesPlaceholder')}
                  minRows={5}
                  autosize
                  {...form.getInputProps('notes')}
                />

                <TagsInput
                  label={t('form.labels.strengths')}
                  placeholder={t('form.labels.strengthsPlaceholder')}
                  {...form.getInputProps('strengths')}
                />

                <TagsInput
                  label={t('form.labels.weaknesses')}
                  placeholder={t('form.labels.weaknessesPlaceholder')}
                  {...form.getInputProps('weaknesses')}
                />

                <Group justify="flex-end" mt="xl">
                  {isEditMode && (
                    <Button variant="default" onClick={() => form.reset()}>{t('form.buttons.reset')}</Button>
                  )}
                  <Button type="submit" leftSection={<IconDeviceFloppy size={16} />}>
                    {isEditMode ? t('form.buttons.update') : t('form.buttons.submit')}
                  </Button>
                </Group>
              </Stack>
            </form>
          </Paper>
        </Grid.Col>
      </Grid>

      <ScheduleInterviewModal
        opened={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        initialApplicationId={interview.applications[0]?.id}
      />
    </Box>
  );
}
