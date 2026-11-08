import { useEffect } from 'react';
import type { FormEvent } from 'react';
import { useForm, type UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useInterviewQuery } from '../api/useInterviews';
import {
  useInterviewReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from '../api/useInterviewReviews';
import { useAppStore } from '../../store/useAppStore';
import { validateWithJoi } from '../../utils/form-validation';
import { interviewReviewSchema } from '../../schemas/interveiw-review.schema';
import { normalizeText } from '../../utils/string';
import type { Interview } from '../../services/interview.service';
import type { InterviewReview } from '../../services/interview-review.service';

export interface InterviewReviewFormValues {
  score: number;
  notes: string;
  strengths: string[];
  weaknesses: string[];
}

export interface UseInterviewReviewFormParams {
  interviewId: string;
  reviewId?: string;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export interface UseInterviewReviewFormReturn {
  form: UseFormReturnType<InterviewReviewFormValues>;
  interview: Interview | undefined;
  myReview: InterviewReview | undefined;
  candidateId: string | undefined;
  isLoading: boolean;
  isReadOnly: boolean;
  isEditMode: boolean;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

export function useInterviewReviewForm({
  interviewId,
  reviewId,
  readOnly,
  onSuccess,
}: UseInterviewReviewFormParams): UseInterviewReviewFormReturn {
  const { t } = useTranslation('reviews');
  const user = useAppStore(state => state.user);
  const navigate = useNavigate();

  const { data: interview, isLoading: isLoadingInterview } = useInterviewQuery(interviewId);
  const candidateId = interview?.applications?.[0]?.candidate?.id;
  const { data: reviews, isLoading: isLoadingReviews } = useInterviewReviewsQuery(interviewId);

  const createReviewMutation = useCreateReviewMutation();
  const updateReviewMutation = useUpdateReviewMutation();

  const myReview = reviewId
    ? reviews?.find(r => r.id === reviewId)
    : reviews?.find(r => r.employee_id === user?.id);

  const isEditMode = !!myReview;
  const isOwner = !!myReview && !!user?.id && myReview.employee_id === user.id;
  const isReadOnly = readOnly || (isEditMode && !isOwner);

  const form = useForm<InterviewReviewFormValues>({
    initialValues: {
      score: 5,
      notes: '',
      strengths: [],
      weaknesses: [],
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

  const onSubmit = async (values: InterviewReviewFormValues) => {
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
      strengths: normalizeText(values.strengths),
      weaknesses: normalizeText(values.weaknesses),
    };

    try {
      if (isEditMode && myReview) {
        await updateReviewMutation.mutateAsync({ id: myReview.id, data: payload });
        notifications.show({ title: 'Success', message: t('form.notifications.updateSuccess'), color: 'green' });
      } else {
        await createReviewMutation.mutateAsync(payload);
        notifications.show({ title: 'Success', message: t('form.notifications.createSuccess'), color: 'green' });
      }

      if (onSuccess) {
        onSuccess();
      } else if (candidateId) {
        navigate(`/manage/candidates/list/${candidateId}`);
      }
    } catch {
      notifications.show({ title: 'Error', message: t('form.notifications.submitError'), color: 'red' });
    }
  };

  const handleSubmit = form.onSubmit(
    onSubmit,
    (_errors) => {
      notifications.show({
        title: 'Validation Error',
        message: t('form.notifications.validationError'),
        color: 'red',
      });
    }
  );

  return {
    form,
    interview,
    myReview,
    candidateId,
    isLoading: isLoadingInterview || isLoadingReviews,
    isReadOnly,
    isEditMode,
    handleSubmit,
  };
}

