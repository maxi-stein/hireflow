import { InterviewStatus, type Interview } from '../services/interview.service';

export const isInterviewPast = (interview: Interview): boolean => {
  return new Date(interview.scheduled_time) < new Date();
};

export const getEffectiveInterviewStatus = (interview: Interview): InterviewStatus => {
  if (interview.status === InterviewStatus.COMPLETED) {
    return InterviewStatus.COMPLETED;
  }

  // If reviews exist, it is effectively completed
  if (interview.reviews && interview.reviews.length > 0) {
    return InterviewStatus.COMPLETED;
  }

  // If scheduled but in the past, treat as completed (pending review)
  if (interview.status === InterviewStatus.SCHEDULED && isInterviewPast(interview)) {
    return InterviewStatus.COMPLETED;
  }

  return interview.status;
};
