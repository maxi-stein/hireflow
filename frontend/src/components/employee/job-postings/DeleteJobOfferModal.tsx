import { Modal, Title, Stack, Text, Group, Button } from '@mantine/core';
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
  if (!jobOffer) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Confirm Deletion</Title>}
      size="sm"
    >
      <Stack gap="md">
        <Text>
          Are you sure you want to delete the job posting <strong>"{jobOffer.position}"</strong>?
          This action cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button 
            variant="default" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={onConfirm}
            loading={isLoading}
            leftSection={<IconTrash size={16} />}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
