import { Box, Stack, Button, useMantineColorScheme } from '@mantine/core';
import { IconCheck, IconCalendarEvent, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { ApplicationStatus } from '../../../services/candidate-application.service';

export interface CandidateComparisonFooterProps {
  status: ApplicationStatus;
  onHire: () => void;
  onSchedule: () => void;
  onReject: () => void;
}

export const CandidateComparisonFooter = ({
  status,
  onHire,
  onSchedule,
  onReject,
}: CandidateComparisonFooterProps) => {
  const { t } = useTranslation(['profile']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      p="md"
      style={{
        borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
        background: isDark ? '#0f172a' : '#f8fafc',
      }}
    >
      <Stack gap="xs">
        {status !== ApplicationStatus.HIRED && status !== ApplicationStatus.REJECTED && (
          <Button
            leftSection={<IconCheck size={15} />}
            variant="filled"
            color="green"
            fullWidth
            radius="md"
            size="sm"
            onClick={onHire}
            style={{ fontWeight: 700 }}
          >
            {t('candidate.actions.hire')}
          </Button>
        )}
        <Button
          leftSection={<IconCalendarEvent size={15} />}
          variant="light"
          fullWidth
          radius="md"
          size="sm"
          onClick={onSchedule}
        >
          {t('candidate.actions.schedule')}
        </Button>
        <Button
          leftSection={<IconX size={15} />}
          variant="subtle"
          color="red"
          fullWidth
          radius="md"
          size="sm"
          onClick={onReject}
        >
          {t('candidate.actions.reject')}
        </Button>
      </Stack>
    </Box>
  );
};

