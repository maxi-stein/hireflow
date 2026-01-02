import type { MantineColor } from '@mantine/core';
import { ApplicationStatus } from '../services/candidate-application.service';

export const getApplicationStatusColor = (status: ApplicationStatus): MantineColor => {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 'gray';
    case ApplicationStatus.IN_PROGRESS:
      return 'blue';
    case ApplicationStatus.HIRED:
      return 'green';
    case ApplicationStatus.REJECTED:
      return 'red';
    default:
      return 'gray';
  }
};
