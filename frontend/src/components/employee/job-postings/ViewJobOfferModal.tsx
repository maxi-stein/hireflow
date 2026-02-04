import { Modal, Title, Stack, Text, Group, Button, LoadingOverlay, Alert } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconAlertCircle } from '@tabler/icons-react';
import { useJobOfferQuery } from '../../../hooks/api/useJobOffers';
import { JobOfferCard } from '../../jobs/JobOfferCard';

interface ViewJobOfferModalProps {
  opened: boolean;
  onClose: () => void;
  jobOfferId: string | null;
}

export function ViewJobOfferModal({ opened, onClose, jobOfferId }: ViewJobOfferModalProps) {
  const { t } = useTranslation(['jobs', 'common']);
  const { data: jobOffer, isLoading, isError, error, refetch } = useJobOfferQuery(jobOfferId || '');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>{t('list.viewModal.title')}</Title>}
      size="lg"
    >
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {isError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title={t('list.viewModal.errorTitle')}
          color="red"
          variant="light"
        >
          <Stack gap="sm">
            <Text size="sm">
              {error?.message || t('list.viewModal.errorMessage')}
            </Text>
            <Group>
              <Button size="xs" variant="light" onClick={() => refetch()}>
                {t('common:actions.retry')}
              </Button>
            </Group>
          </Stack>
        </Alert>
      )}

      {jobOffer && (
        <Stack>
          <JobOfferCard
            job={jobOffer}
            showSensitiveData
          />
        </Stack>
      )}
    </Modal>
  );
}
