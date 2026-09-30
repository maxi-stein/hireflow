import { Modal, Text, Button, Group, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface IncompleteProfileModalProps {
  opened: boolean;
  onClose: () => void;
  onApplyAnyway: () => void;
}

export function IncompleteProfileModal({ opened, onClose, onApplyAnyway }: IncompleteProfileModalProps) {
  const { t } = useTranslation(['jobs']);
  const navigate = useNavigate();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon color="yellow" variant="light" size="lg" radius="xl">
            <IconAlertTriangle size={20} />
          </ThemeIcon>
          <Text fw={600} size="lg">{t('jobs:incompleteProfile.title')}</Text>
        </Group>
      }
      centered
    >
      <Text mb="xl" c="dimmed">
        {t('jobs:incompleteProfile.message')}
      </Text>
      <Group justify="flex-end">
        <Button variant="default" onClick={onApplyAnyway}>
          {t('jobs:incompleteProfile.applyAnyway')}
        </Button>
        <Button onClick={() => {
          onClose();
          navigate('/profile');
        }}>
          {t('jobs:incompleteProfile.completeProfile')}
        </Button>
      </Group>
    </Modal>
  );
}
