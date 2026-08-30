import { Button } from '@mantine/core';
import { IconVideo } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface JoinMeetingButtonProps {
  meetingLink: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'filled' | 'outline' | 'subtle';
  color?: string;
}

export function JoinMeetingButton({
  meetingLink,
  size = 'xs',
  variant = 'light',
  color = 'blue',
}: JoinMeetingButtonProps) {
  const { t } = useTranslation('dashboard');

  return (
    <Button
      component="a"
      href={meetingLink}
      target="_blank"
      rel="noopener noreferrer"
      variant={variant}
      color={color}
      size={size}
      radius="md"
      leftSection={<IconVideo size={14} />}
    >
      {t('upcomingInterviews.join')}
    </Button>
  );
}
