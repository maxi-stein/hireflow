import { Badge } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import { IconCalendarEvent, IconClock, IconCheck, IconX, IconSend } from '@tabler/icons-react';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  hasScheduledInterview?: boolean;
}

const getStatusConfig = (status: ApplicationStatus, hasScheduledInterview: boolean, t: (key: string) => string) => {
  if (hasScheduledInterview) {
    return {
      label: t('common:applicationStatus.INTERVIEW_SCHEDULED') || 'Entrevista programada',
      color: 'violet',
      variant: 'light',
      icon: <IconCalendarEvent size={13} />,
    };
  }

  const translationKey = `common:applicationStatus.${status}`;
  const label = t(translationKey) || status;

  switch (status) {
    case ApplicationStatus.APPLIED:
      return { label: label || 'Postulado', color: 'blue', variant: 'light', icon: <IconSend size={13} /> };
    case ApplicationStatus.IN_PROGRESS:
      return { label: label || 'En revisión', color: 'indigo', variant: 'light', icon: <IconClock size={13} /> };
    case ApplicationStatus.HIRED:
      return { label: label || 'Seleccionado / Contratado', color: 'teal', variant: 'filled', icon: <IconCheck size={13} /> };
    case ApplicationStatus.REJECTED:
      return { label: label || 'No seleccionado', color: 'red', variant: 'light', icon: <IconX size={13} /> };
    default:
      return { label: label || status, color: 'gray', variant: 'light', icon: <IconClock size={13} /> };
  }
};

export const ApplicationStatusBadge = ({ status, hasScheduledInterview = false }: ApplicationStatusBadgeProps) => {
  const { t } = useTranslation(['common']);
  const config = getStatusConfig(status, hasScheduledInterview, t);

  return (
    <Badge
      size="md"
      color={config.color}
      variant={config.variant}
      radius="md"
      leftSection={config.icon}
      style={{ fontWeight: 700 }}
    >
      {config.label}
    </Badge>
  );
};
