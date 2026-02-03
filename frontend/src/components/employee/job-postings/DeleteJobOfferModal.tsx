import { Modal, Title, Stack, Text, Group, Button } from '@mantine/core';
import { useTranslation, Trans } from 'react-i18next';
import { IconTrash } from '@tabler/icons-react';
import { type JobOffer } from '../../../services/job-offer.service';

interface DeleteJobOfferModalProps {
  opened: boolean;
  onClose: () => void;
  jobOffer: JobOffer | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteJobOfferModal({
  opened,
  onClose,
  jobOffer,
  onConfirm,
  isLoading
}: DeleteJobOfferModalProps) {
  const { t } = useTranslation('jobs');
  if (!jobOffer) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>{t('list.deleteModal.title')}</Title>}
      size="sm"
    >
      <Stack gap="md">
        <Text>
          <Trans
            i18nKey="list.deleteModal.message"
            ns="jobs"
            values={{ position: jobOffer.position }}
            components={{ 1: <strong /> }}
          />
        </Text>

        <Group justify="flex-end" mt="md">
          <Button
            variant="default"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('list.deleteModal.cancel')}
          </Button>
          <Button
            color="red"
            onClick={onConfirm}
            loading={isLoading}
            leftSection={<IconTrash size={16} />}
          >
            {t('list.deleteModal.confirm')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
