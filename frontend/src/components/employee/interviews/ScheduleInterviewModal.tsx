import { useEffect, useState, useMemo } from 'react';
import { Modal, Button, TextInput, Select, MultiSelect, Stack, Group, Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useCreateInterviewMutation, useUpdateInterviewMutation } from '../../../hooks/api/useInterviews';
import { InterviewType, InterviewStatus } from '../../../services/interview.service';
import type { Interview } from '../../../services/interview.service';
import { useAllCandidateApplicationsQuery } from '../../../hooks/api/useCandidateApplications';
import { useEmployeesQuery } from '../../../hooks/api/useEmployees';
import { useJobOffersQuery } from '../../../hooks/api/useJobOffers';
import { notifications } from '@mantine/notifications';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import type { Employee } from '../../../services/employee.service';
import { validateWithJoi } from '../../../utils/form-validation';
import { scheduleInterviewSchema } from '../../../schemas/interview.schema';

interface ScheduleInterviewModalProps {
  opened: boolean;
  onClose: () => void;
  initialApplicationId?: string;
  interviewToEdit?: Interview | null;
}

export function ScheduleInterviewModal({ opened, onClose, initialApplicationId, interviewToEdit }: ScheduleInterviewModalProps) {
  const createMutation = useCreateInterviewMutation();
  const updateMutation = useUpdateInterviewMutation();
  const [selectedJobOfferId, setSelectedJobOfferId] = useState<string | null>(null);
  
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
  const { data: jobOffersData } = useJobOffersQuery({ limit: 100 });

  // Combine both application lists
  const allApplications = useMemo(() => [
    ...(appliedApplications?.data || []),
    ...(inProgressApplications?.data || [])
  ], [appliedApplications, inProgressApplications]);

  const filteredApplications = useMemo(() => {
    if (!selectedJobOfferId) return [];
    return allApplications.filter(app => app.job_offer.id === selectedJobOfferId);
  }, [allApplications, selectedJobOfferId]);

  const form = useForm({
    initialValues: {
      applicationIds: initialApplicationId ? [initialApplicationId] : [] as string[],
      interviewerIds: [] as string[],
      type: InterviewType.INDIVIDUAL as InterviewType,
      scheduledTime: null as Date | null,
      meetingLink: '',
    },
    validate: validateWithJoi(scheduleInterviewSchema),
  });

  // Set initial values when opening (either for edit or create with context)
  useEffect(() => {
    if (opened) {
      if (interviewToEdit) {
        const jobOfferId = interviewToEdit.applications[0]?.job_offer.id;
        if (jobOfferId) setSelectedJobOfferId(jobOfferId);

        form.setValues({
          applicationIds: interviewToEdit.applications.map(app => app.id),
          interviewerIds: interviewToEdit.interviewers.map(i => i.id),
          type: interviewToEdit.type,
          scheduledTime: new Date(interviewToEdit.scheduled_time),
          meetingLink: interviewToEdit.meeting_link || '',
        });
      } else if (initialApplicationId) {
        const app = allApplications.find(a => a.id === initialApplicationId);
        if (app) setSelectedJobOfferId(app.job_offer.id);

        form.setFieldValue('applicationIds', [initialApplicationId]);
        form.setFieldValue('interviewerIds', []);
        form.setFieldValue('scheduledTime', null);
        form.setFieldValue('meetingLink', '');
      } else {
        setSelectedJobOfferId(null);
        form.reset();
      }
    }
  }, [opened, initialApplicationId, interviewToEdit, allApplications]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!values.scheduledTime) return;

    try {
      // Ensure scheduledTime is a Date object
      const scheduledDate = new Date(values.scheduledTime);

      if (interviewToEdit) {
        await updateMutation.mutateAsync({
          id: interviewToEdit.id,
          data: {
            application_ids: values.applicationIds,
            interviewer_ids: values.interviewerIds,
            type: values.type,
            scheduled_time: scheduledDate.toISOString(),
            meeting_link: values.meetingLink,
          },
        });
        notifications.show({ title: 'Success', message: 'Interview updated successfully', color: 'green' });
      } else {
        await createMutation.mutateAsync({
          application_ids: values.applicationIds,
          interviewer_ids: values.interviewerIds,
          type: values.type,
          scheduled_time: scheduledDate.toISOString(),
          meeting_link: values.meetingLink,
          status: InterviewStatus.SCHEDULED,
        });
        notifications.show({ title: 'Success', message: 'Interview scheduled successfully', color: 'green' });
      }
      
      onClose();
      form.reset();
      setSelectedJobOfferId(null);
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: interviewToEdit ? 'Failed to update interview' : 'Failed to schedule interview',
        color: 'red',
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isCompleted = interviewToEdit?.status === InterviewStatus.COMPLETED;

  return (
    <Modal opened={opened} onClose={onClose} title={interviewToEdit ? "Reschedule Interview" : "Schedule Interview"}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            label="Job Offer"
            placeholder="Select a job offer to filter candidates"
            data={jobOffersData?.data.map(offer => ({
              value: offer.id,
              label: offer.position
            })) || []}
            value={selectedJobOfferId}
            onChange={(val) => {
              setSelectedJobOfferId(val);
              form.setFieldValue('applicationIds', []); // Clear candidates when job offer changes
            }}
            searchable
            clearable
            disabled={!!initialApplicationId || !!interviewToEdit} // Lock job offer if context is fixed
          />

          <Select
            label="Type"
            data={[
              { value: InterviewType.INDIVIDUAL, label: 'Individual' },
              { value: InterviewType.GROUP, label: 'Group' },
            ]}
            {...form.getInputProps('type')}
          />

          {form.values.type === InterviewType.GROUP ? (
            <MultiSelect
              label="Candidates"
              placeholder={selectedJobOfferId ? "Select candidates" : "Select a job offer first"}
              data={filteredApplications.map(app => ({
                value: app.id,
                label: `${app.candidate.user.first_name} ${app.candidate.user.last_name}`
              }))}
              searchable
              {...form.getInputProps('applicationIds')}
              disabled={!selectedJobOfferId}
            />
          ) : (
            <Select
              label="Candidate"
              placeholder={selectedJobOfferId ? "Select candidate" : "Select a job offer first"}
              data={filteredApplications.map(app => ({
                value: app.id,
                label: `${app.candidate.user.first_name} ${app.candidate.user.last_name}`
              }))}
              searchable
              value={form.values.applicationIds[0] || ''}
              onChange={(val) => form.setFieldValue('applicationIds', val ? [val] : [])}
              error={form.errors.applicationIds}
              disabled={!selectedJobOfferId}
            />
          )}

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

          {isCompleted && (
            <Text c="red" size="sm">This interview is completed and cannot be updated.</Text>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button type="submit" loading={isSubmitting} disabled={isCompleted}>
              {interviewToEdit ? 'Update' : 'Schedule'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
