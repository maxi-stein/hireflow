import { useState, useMemo, useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { useCreateInterviewMutation, useUpdateInterviewMutation } from '../api/useInterviews';
import { useAllCandidateApplicationsQuery, useCandidateApplicationQuery } from '../api/useCandidateApplications';
import { useEmployeesQuery } from '../api/useEmployees';
import { useJobOffersQuery } from '../api/useJobOffers';
import { ApplicationStatus } from '../../services/candidate-application.service';
import { type Interview, InterviewType, InterviewStatus } from '../../services/interview.service';
import { validateWithJoi } from '../../utils/form-validation';
import { scheduleInterviewSchema } from '../../schemas/interview.schema';

interface UseScheduleInterviewFormProps {
  opened: boolean;
  onClose: () => void;
  initialApplicationId?: string;
  interviewToEdit?: Interview | null;
  onSuccess?: () => void;
}

export function useScheduleInterviewForm({
  opened,
  onClose,
  initialApplicationId,
  interviewToEdit,
  onSuccess,
}: UseScheduleInterviewFormProps) {
  const { t } = useTranslation(['calendar']);
  const createMutation = useCreateInterviewMutation();
  const updateMutation = useUpdateInterviewMutation();
  const [selectedJobOfferId, setSelectedJobOfferId] = useState<string | null>(null);

  // Fetch applications with APPLIED or IN_PROGRESS status
  const { data: appliedApplications } = useAllCandidateApplicationsQuery({
    limit: 100,
    status: [ApplicationStatus.APPLIED],
  });
  const { data: inProgressApplications } = useAllCandidateApplicationsQuery({
    limit: 100,
    status: [ApplicationStatus.IN_PROGRESS],
  });
  const { data: singleApplication } = useCandidateApplicationQuery(initialApplicationId || null);
  const { data: employees } = useEmployeesQuery({ limit: 40 });
  const { data: jobOffersData } = useJobOffersQuery({ limit: 100 });

  // Combine both application lists
  const allApplications = useMemo(() => {
    const list = [
      ...(appliedApplications?.data || []),
      ...(inProgressApplications?.data || []),
    ];
    if (singleApplication) {
      if (!list.some((app) => app.id === singleApplication.id)) {
        list.push(singleApplication);
      }
    }
    return list;
  }, [appliedApplications, inProgressApplications, singleApplication]);

  const jobOffersOptions = useMemo(() => {
    const options =
      jobOffersData?.data.map((offer) => ({
        value: offer.id,
        label: offer.position,
      })) || [];

    if (selectedJobOfferId && !options.some((opt) => opt.value === selectedJobOfferId)) {
      const app = allApplications.find((a) => a.job_offer.id === selectedJobOfferId);
      if (app) {
        options.push({
          value: app.job_offer.id,
          label: app.job_offer.position,
        });
      }
    }
    return options;
  }, [jobOffersData, selectedJobOfferId, allApplications]);

  const filteredApplications = useMemo(() => {
    if (!selectedJobOfferId) return [];
    return allApplications.filter((app) => app.job_offer.id === selectedJobOfferId);
  }, [allApplications, selectedJobOfferId]);

  const form = useForm({
    initialValues: {
      title: '',
      applicationIds: initialApplicationId ? [initialApplicationId] : ([] as string[]),
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
          title: interviewToEdit.title,
          applicationIds: interviewToEdit.applications.map((app) => app.id),
          interviewerIds: interviewToEdit.interviewers.map((i) => i.id),
          type: interviewToEdit.type,
          scheduledTime: new Date(interviewToEdit.scheduled_time),
          meetingLink: interviewToEdit.meeting_link || '',
        });
      } else if (initialApplicationId) {
        const app = allApplications.find((a) => a.id === initialApplicationId);
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
      const scheduledDate = new Date(values.scheduledTime);

      if (interviewToEdit) {
        await updateMutation.mutateAsync({
          id: interviewToEdit.id,
          data: {
            title: values.title,
            application_ids: values.applicationIds,
            interviewer_ids: values.interviewerIds,
            type: values.type,
            scheduled_time: scheduledDate.toISOString(),
            meeting_link: values.meetingLink,
          },
        });
        notifications.show({ title: 'Success', message: t('modal.updateSuccess'), color: 'green' });
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          application_ids: values.applicationIds,
          interviewer_ids: values.interviewerIds,
          type: values.type,
          scheduled_time: scheduledDate.toISOString(),
          meeting_link: values.meetingLink,
          status: InterviewStatus.SCHEDULED,
        });
        notifications.show({ title: 'Success', message: t('modal.success'), color: 'green' });
      }

      if (onSuccess) onSuccess();
      onClose();
      form.reset();
      setSelectedJobOfferId(null);
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: interviewToEdit ? t('modal.updateError') : t('modal.error'),
        color: 'red',
      });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isCompleted = interviewToEdit?.status === InterviewStatus.COMPLETED;

  return {
    form,
    selectedJobOfferId,
    setSelectedJobOfferId,
    jobOffersOptions,
    filteredApplications,
    employees,
    isSubmitting,
    isCompleted,
    handleSubmit,
  };
}

