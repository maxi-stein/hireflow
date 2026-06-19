import { Badge, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ApplicationStatus } from '../../../services/candidate-application.service';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  hasScheduledInterview?: boolean;
}

const getStatusConfig = (status: ApplicationStatus, hasScheduledInterview: boolean, t: (key: string) => string) => {
  if (hasScheduledInterview) {
    return { label: t('common:applicationStatus.INTERVIEW_SCHEDULED'), color: 'violet', variant: 'light' };
  }

  // Check if status is valid, otherwise fallback
  const translationKey = `common:applicationStatus.${status}`;
  const label = t(translationKey);

  switch (status) {
    case ApplicationStatus.APPLIED:
      return { label, color: 'blue', variant: 'light' };
    case ApplicationStatus.IN_PROGRESS:
      return { label, color: 'yellow', variant: 'light' };
    case ApplicationStatus.HIRED:
      return { label, color: 'green', variant: 'filled' };
    case ApplicationStatus.REJECTED:
      return { label, color: 'red', variant: 'light' };
    default:
      return { label, color: 'gray', variant: 'light' };
  }
};

export const ApplicationStatusBadge = ({ status, hasScheduledInterview = false }: ApplicationStatusBadgeProps) => {
  const { t } = useTranslation(['common']);
  const config = getStatusConfig(status, hasScheduledInterview, t);

  return (
    <Badge
      size="lg"
      color={config.color}
      variant={config.variant}
      radius="sm"
    >
      {config.label}
    </Badge>
  );
};
