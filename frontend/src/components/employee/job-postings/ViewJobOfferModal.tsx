import { Modal, Title, Stack, Text, Group, Button, LoadingOverlay, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useJobOfferQuery } from '../../../hooks/api/useJobOffers';
import { JobOfferCard } from '../../jobs/JobOfferCard';

interface ViewJobOfferModalProps {
  opened: boolean;
  onClose: () => void;
  jobOfferId: string | null;
}

export function ViewJobOfferModal({ opened, onClose, jobOfferId }: ViewJobOfferModalProps) {
  const { data: jobOffer, isLoading, isError, error, refetch } = useJobOfferQuery(jobOfferId || '');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Job Posting Details</Title>}
      size="lg"
    >
      <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

      {isError && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error loading job posting"
          color="red"
          variant="light"
        >
          <Stack gap="sm">
            <Text size="sm">
              {error?.message || 'Failed to load job posting details. Please try again.'}
            </Text>
            <Group>
              <Button size="xs" variant="light" onClick={() => refetch()}>
                Retry
              </Button>
            </Group>
          </Stack>
        </Alert>
      )}

      {jobOffer && (
        <Stack>
          <JobOfferCard
            job={jobOffer}
            action={
              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={onClose}>
                  Close
                </Button>
              </Group>
            }
            showSensitiveData
          />
        </Stack>
      )}
    </Modal>
  );
}
