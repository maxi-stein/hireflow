import { Modal, Title, Stack, Text, Group, Button } from '@mantine/core';
import { type ReactNode } from 'react';

interface ConfirmActionModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  confirmColor?: string;
  confirmIcon?: ReactNode;
  isLoading?: boolean;
}

export function ConfirmActionModal({ 
  opened, 
  onClose, 
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'blue',
  confirmIcon,
  isLoading 
}: ConfirmActionModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>{title}</Title>}
      size="sm"
    >
      <Stack gap="md">
        {typeof message === 'string' ? <Text>{message}</Text> : message}

        <Group justify="flex-end" mt="md">
          <Button 
            variant="default" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color={confirmColor} 
            onClick={onConfirm}
            loading={isLoading}
            leftSection={confirmIcon}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
