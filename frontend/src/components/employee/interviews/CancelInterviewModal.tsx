import { Modal, Text, Group, Button, Box, Stack } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface CancelInterviewModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function CancelInterviewModal({ opened, onClose, onConfirm, isLoading }: CancelInterviewModalProps) {
  const { t } = useTranslation('calendar');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      radius="lg"
      title={
        <Group gap="xs">
          <Box p={6} bg="light-dark(#fef2f2, rgba(239, 68, 68, 0.15))" style={{ borderRadius: 8, color: '#dc2626' }}>
            <IconAlertTriangle size={18} />
          </Box>
          <Text fw={700} size="md">
            {t('actions.cancel')}
          </Text>
        </Group>
      }
      centered
      zIndex={1000}
    >
      <Stack gap="lg" pt="xs">
        <Text size="sm" c="dimmed" lh={1.6}>
          {t('modal.cancelMessage')}
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="default" radius="md" onClick={onClose}>
            {t('modal.buttons.keepIt')}
          </Button>
          <Button color="red" radius="md" onClick={onConfirm} loading={isLoading} style={{ fontWeight: 600 }}>
            {t('modal.buttons.confirmCancel')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
