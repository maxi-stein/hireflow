import { useState, useEffect } from 'react';
import { Paper, Group, Text, Button, Stack, Textarea, NumberInput, TagsInput, LoadingOverlay, Grid, Divider, Box, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendarEvent, IconCheck, IconDeviceFloppy } from '@tabler/icons-react';
import { useInterviewQuery } from '../../../hooks/api/useInterviews';
import { useInterviewReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation } from '../../../hooks/api/useInterviewReviews';
import { useUpdateApplicationStatusMutation } from '../../../hooks/api/useCandidateApplications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { ScheduleInterviewModal } from '../../../components/employee/interviews/ScheduleInterviewModal';
import { useAppStore } from '../../../store/useAppStore';
import { validateWithJoi } from '../../../utils/form-validation';
import { interviewReviewSchema } from '../../../schemas/interveiw-review.schema';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../router/routes.config';
import { CandidateAvatar } from '../../shared/CandidateAvatar';

interface InterviewReviewFormProps {
  interviewId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function InterviewReviewForm({ interviewId, onCancel, onSuccess }: InterviewReviewFormProps) {
  const user = useAppStore(state => state.user);
  const navigate = useNavigate();
  
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: interview, isLoading: isLoadingInterview } = useInterviewQuery(interviewId);
  const candidateId = interview?.applications?.[0]?.candidate?.id;
  const { data: reviews, isLoading: isLoadingReviews } = useInterviewReviewsQuery(interviewId);
  
  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();
  const updateStatusMutation = useUpdateApplicationStatusMutation();

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
      form.setValues({
        score: myReview.score || 5,
        notes: myReview.notes || '',
        strengths: myReview.strengths || [],
        weaknesses: myReview.weaknesses || [],
      });
    }
  }, [myReview]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!interview || !user?.id) {
      notifications.show({ title: 'Error', message: 'Missing user or interview data', color: 'red' });
      return;
    }
    
    const applicationId = interview.applications?.[0]?.id;
    if (!applicationId) {
      notifications.show({ title: 'Error', message: 'No application found for this interview', color: 'red' });
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
        notifications.show({ title: 'Success', message: 'Review updated successfully', color: 'green' });
      } else {
        await createReviewMutation.mutateAsync(payload);
        notifications.show({ title: 'Success', message: 'Review submitted successfully', color: 'green' });
      }
      onSuccess();
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to submit review', color: 'red' });
    }
  };

  const handleHire = async () => {
    if (!interview) return;
    const applicationId = interview.applications?.[0]?.id;
    if (!applicationId) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: applicationId,
        status: ApplicationStatus.HIRED,
      });
      notifications.show({ title: 'Success', message: 'Candidate hired successfully!', color: 'green' });
      // Redirect to candidates list (using first child of group)
      navigate(ROUTES.EMPLOYEE.CANDIDATES_GROUP.children?.[0].path || '/manage/candidates/applications');
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to hire candidate', color: 'red' });
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
    return <Text>Interview not found</Text>;
  }

  const candidate = interview.applications?.[0]?.candidate?.user;
  const jobOffer = interview.applications?.[0]?.job_offer;

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Title order={3}>
          {isEditMode ? 'Edit Review' : 'Create Review'}
        </Title>
        <Group>
          <Button 
            variant="light" 
            size="xs"
            leftSection={<IconCalendarEvent size={16} />}
            onClick={() => setIsScheduleModalOpen(true)}
          >
            Schedule Next
          </Button>
          <Button 
            color="green" 
            size="xs"
            leftSection={<IconCheck size={16} />}
            onClick={handleHire}
          >
            Hire Candidate
          </Button>
        </Group>
      </Group>

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <Paper withBorder p="md" radius="md">
              <Stack gap="xs">
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Candidate</Text>
                  <Text size="lg" fw={500}>{candidate?.first_name} {candidate?.last_name}</Text>
                  <Text size="sm" c="dimmed">{candidate?.email}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Position</Text>
                  <Text fw={500}>{jobOffer?.position}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Interview Date</Text>
                  <Text>{new Date(interview.scheduled_time).toLocaleString()}</Text>
                </Box>
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
                console.log('Validation errors:', errors);
                notifications.show({ 
                  title: 'Validation Error', 
                  message: 'Please check the form for errors', 
                  color: 'red' 
                });
              }
            )}>
              <Stack gap="lg">
                <NumberInput
                  label="Score (1-10)"
                  description="Rate the candidate's performance"
                  min={1}
                  max={10}
                  required
                  {...form.getInputProps('score')}
                />

                <Textarea
                  label="Notes"
                  placeholder="Enter your detailed feedback here..."
                  minRows={5}
                  autosize
                  {...form.getInputProps('notes')}
                />

                <TagsInput
                  label="Strengths"
                  placeholder="Add strengths"
                  {...form.getInputProps('strengths')}
                />

                <TagsInput
                  label="Weaknesses"
                  placeholder="Add weaknesses"
                  {...form.getInputProps('weaknesses')}
                />

                <Group justify="flex-end" mt="xl">
                  <Button variant="default" onClick={onCancel}>Cancel</Button>
                  <Button type="submit" leftSection={<IconDeviceFloppy size={16} />}>
                    {isEditMode ? 'Update Review' : 'Submit Review'}
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
