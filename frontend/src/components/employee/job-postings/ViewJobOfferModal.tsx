import { Modal, Title, Stack, Text, Group, Badge, Button, LoadingOverlay, Alert } from '@mantine/core';
import { IconEdit, IconAlertCircle } from '@tabler/icons-react';
import { JobOfferStatus } from '../../../services/job-offer.service';
import { useJobOfferQuery } from '../../../hooks/api/useJobOffers';

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
        <Stack gap="md">
          <div>
            <Text size="sm" c="dimmed" fw={500}>Position</Text>
            <Text size="lg" fw={600}>{jobOffer.position}</Text>
          </div>

          <Group grow>
            <div>
              <Text size="sm" c="dimmed" fw={500}>Location</Text>
              <Text>{jobOffer.location}</Text>
            </div>
            <div>
              <Text size="sm" c="dimmed" fw={500}>Work Mode</Text>
              <Badge variant="light" color="gray">{jobOffer.work_mode}</Badge>
            </div>
          </Group>

          <Group grow>
            <div>
              <Text size="sm" c="dimmed" fw={500}>Status</Text>
              <Badge
                color={jobOffer.status === JobOfferStatus.OPEN ? 'green' : 'red'}
                variant="light"
              >
                {jobOffer.status}
              </Badge>
            </div>
            <div>
              <Text size="sm" c="dimmed" fw={500}>Applicants</Text>
              <Text>{jobOffer.applicants_count}</Text>
            </div>
          </Group>

          <div>
            <Text size="sm" c="dimmed" fw={500}>Description</Text>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{jobOffer.description}</Text>
          </div>

          {jobOffer.salary && (
            <div>
              <Text size="sm" c="dimmed" fw={500}>Salary</Text>
              <Text>{jobOffer.salary}</Text>
            </div>
          )}

          {jobOffer.benefits && (
            <div>
              <Text size="sm" c="dimmed" fw={500}>Benefits</Text>
              <Text style={{ whiteSpace: 'pre-wrap' }}>{jobOffer.benefits}</Text>
            </div>
          )}

          {jobOffer.skills.length > 0 && (
            <div>
              <Text size="sm" c="dimmed" fw={500} mb="xs">Required Skills</Text>
              <Group gap="xs">
                {jobOffer.skills.map((skill) => (
                  <Badge key={skill.id} variant="light">{skill.skill_name}</Badge>
                ))}
              </Group>
            </div>
          )}

          <Group justify="space-between" align="flex-end" mt="md">
            <Group gap="xl">
              <div>
                <Text size="sm" c="dimmed" fw={500}>Posted Date</Text>
                <Text>{new Date(jobOffer.created_at).toLocaleDateString()}</Text>
              </div>

              {jobOffer.deadline && (
                <div>
                  <Text size="sm" c="dimmed" fw={500}>Deadline</Text>
                  <Text c="red.9" fw={500}>{new Date(jobOffer.deadline).toLocaleDateString()}</Text>
                </div>
              )}
            </Group>

            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
}
