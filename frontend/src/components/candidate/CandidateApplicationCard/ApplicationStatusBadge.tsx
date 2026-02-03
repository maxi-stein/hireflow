import { Badge, Tooltip } from '@mantine/core';
import { ApplicationStatus } from '../../../services/candidate-application.service';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  hasScheduledInterview?: boolean;
}

const getStatusConfig = (status: ApplicationStatus, hasScheduledInterview: boolean) => {
  if (hasScheduledInterview) {
    return { label: 'INTERVIEW SCHEDULED', color: 'violet', variant: 'light' };
  }

  switch (status) {
    case ApplicationStatus.APPLIED:
      return { label: 'APPLIED', color: 'blue', variant: 'light' };
    case ApplicationStatus.IN_PROGRESS:
      return { label: 'IN PROGRESS', color: 'yellow', variant: 'light' };
    case ApplicationStatus.HIRED:
      return { label: 'HIRED', color: 'green', variant: 'filled' };
    case ApplicationStatus.REJECTED:
      return { label: 'REJECTED', color: 'red', variant: 'light' };
    default:
      return { label: status, color: 'gray', variant: 'light' };
  }
};

export const ApplicationStatusBadge = ({ status, hasScheduledInterview = false }: ApplicationStatusBadgeProps) => {
  const config = getStatusConfig(status, hasScheduledInterview);

  return (
    <Tooltip label={`Current status: ${config.label}`}>
      <Badge
        size="lg"
        color={config.color}
        variant={config.variant}
        radius="sm"
      >
        {config.label}
      </Badge>
    </Tooltip>
  );
};
