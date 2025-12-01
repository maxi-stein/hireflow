import { useEffect } from 'react';
import { Modal, Button, TextInput, Select, MultiSelect, Stack, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useCreateInterviewMutation } from '../../../hooks/api/useInterviews';
import { InterviewType, InterviewStatus } from '../../../services/interview.service';
import { useAllCandidateApplicationsQuery } from '../../../hooks/api/useCandidateApplications';
import { useEmployeesQuery } from '../../../hooks/api/useEmployees';
import { notifications } from '@mantine/notifications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import type { Employee } from '../../../services/employee.service';
import { validateWithJoi } from '../../../utils/form-validation';
import { scheduleInterviewSchema } from '../../../schemas/interview.schema';

interface ScheduleInterviewModalProps {
  opened: boolean;
  onClose: () => void;
  initialApplicationId?: string;
}

export function ScheduleInterviewModal({ opened, onClose, initialApplicationId }: ScheduleInterviewModalProps) {
  const createMutation = useCreateInterviewMutation();
  
  // Fetch applications with APPLIED or IN_PROGRESS status
  const { data: appliedApplications } = useAllCandidateApplicationsQuery({ 
    limit: 100, 
    status: ApplicationStatus.APPLIED 
  });
  const { data: inProgressApplications } = useAllCandidateApplicationsQuery({ 
    limit: 100, 
    status: ApplicationStatus.IN_PROGRESS 
  });
  const { data: employees } = useEmployeesQuery({ limit: 40 });

  // Combine both application lists
  const allApplications = [
    ...(appliedApplications?.data || []),
    ...(inProgressApplications?.data || [])
  ];

  const form = useForm({
    initialValues: {
      applicationId: initialApplicationId || '',
      interviewerIds: [],
      type: InterviewType.INDIVIDUAL,
      scheduledTime: null as Date | null,
      meetingLink: '',
    },
    validate: validateWithJoi(scheduleInterviewSchema),
  });

  // Set initial application if provided (when navigating from Candidate Applications page or Candidate page)
  useEffect(() => {
    if (initialApplicationId) {
      form.setFieldValue('applicationId', initialApplicationId);
    }
  }, [initialApplicationId]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.scheduledTime) return;

    try {
      // Ensure scheduledTime is a Date object
      const scheduledDate = new Date(values.scheduledTime);

      await createMutation.mutateAsync({
        application_ids: [values.applicationId],
        interviewer_ids: values.interviewerIds,
        type: values.type,
        scheduled_time: scheduledDate.toISOString(),
        meeting_link: values.meetingLink,
        status: InterviewStatus.SCHEDULED,
      });
      notifications.show({
        title: 'Success',
        message: 'Interview scheduled successfully',
        color: 'green',
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to schedule interview',
        color: 'red',
      });
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Schedule Interview">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Candidate Application"
            placeholder="Select candidate"
            data={allApplications.map(app => ({
              value: app.id,
              label: `${app.candidate.user.first_name} ${app.candidate.user.last_name} - ${app.job_offer.position}`
            }))}
            searchable
            {...form.getInputProps('applicationId')}
            disabled={!!initialApplicationId}
          />

          <MultiSelect
            label="Interviewers"
            placeholder="Select interviewers"
            data={employees?.data.map((emp: Employee) => ({
              value: emp.id,
              label: `${emp.user.first_name} ${emp.user.last_name}`
            })) || []}
            searchable
            {...form.getInputProps('interviewerIds')}
          />

          <Select
            label="Type"
            data={[
              { value: InterviewType.INDIVIDUAL, label: 'Individual' },
              { value: InterviewType.GROUP, label: 'Group' },
            ]}
            {...form.getInputProps('type')}
          />

          <DateTimePicker
            label="Date and Time"
            placeholder="Pick date and time"
            {...form.getInputProps('scheduledTime')}
          />

          <TextInput
            label="Meeting Link"
            placeholder="https://meet.google.com/..."
            {...form.getInputProps('meetingLink')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={createMutation.isPending}>Schedule</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
