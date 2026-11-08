import { useState } from 'react';
import { Box, Grid, LoadingOverlay, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useInterviewReviewForm } from '../../../hooks/domain/useInterviewReviewForm';
import { InterviewReviewHeaderSummary } from './InterviewReviewHeaderSummary';
import { InterviewReviewFields } from './InterviewReviewFields';
import { ScheduleInterviewModal } from '../interviews/ScheduleInterviewModal';

interface InterviewReviewFormProps {
  interviewId: string;
  reviewId?: string;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export function InterviewReviewForm({ interviewId, reviewId, readOnly, onSuccess }: InterviewReviewFormProps) {
  const { t } = useTranslation('reviews');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const {
    form,
    interview,
    myReview,
    candidateId,
    isLoading,
    isReadOnly,
    isEditMode,
    handleSubmit,
  } = useInterviewReviewForm({ interviewId, reviewId, readOnly, onSuccess });

    if (isLoading) {
      return (
        <Box style={{ position: 'relative', minHeight: '200px' }}>
          <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        </Box>
      );
    }

    if (!interview) {
      return <Text>{t('form.notifications.notFound')}</Text>;
    }

    const candidate = interview.applications?.[0]?.candidate?.user;
    const jobOffer = interview.applications?.[0]?.job_offer;
    const reviewerName = myReview?.employee?.user
      ? `${myReview.employee.user.first_name} ${myReview.employee.user.last_name}`
      : undefined;

    return (
      <Box pt="xs">
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <InterviewReviewHeaderSummary
              candidateId={candidateId}
              candidateFirstName={candidate?.first_name}
              candidateLastName={candidate?.last_name}
              candidateEmail={candidate?.email}
              score={form.values.score}
              isEditMode={isEditMode}
              jobPosition={jobOffer?.position}
              interviewTitle={interview.title}
              scheduledTime={interview.scheduled_time}
              reviewerName={reviewerName}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <InterviewReviewFields
              form={form}
              isReadOnly={isReadOnly}
              isEditMode={isEditMode}
              onSubmit={handleSubmit}
            />
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
