import type { MantineColor } from '@mantine/core';
import { InterviewStatus } from '../services/interview.service';
import { ApplicationStatus } from '../services/candidate-application.service';

//Returns a Mantine color for application status badges.
export const getApplicationStatusColor = (status: ApplicationStatus): MantineColor => {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 'cyan';
    case ApplicationStatus.IN_PROGRESS:
      return 'blue';
    case ApplicationStatus.HIRED:
      return 'green';
    case ApplicationStatus.REJECTED:
      return 'red';
    default:
      return 'violet';
  }
};

//Returns a Mantine color for interview status badges.
export const getInterviewStatusColor = (status: InterviewStatus): MantineColor => {
  switch (status) {
    case InterviewStatus.COMPLETED:
      return 'green';
    case InterviewStatus.CANCELLED:
      return 'red';
    case InterviewStatus.SCHEDULED:
      return 'blue';
    case InterviewStatus.RESCHEDULED:
      return 'orange';
    default:
      return 'violet';
  }
};
