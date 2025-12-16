import { Modal, Text, Group, Button } from '@mantine/core';

interface CancelInterviewModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function CancelInterviewModal({ opened, onClose, onConfirm, isLoading }: CancelInterviewModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Cancel Interview"
            centered
            zIndex={1000}
        >
            <Text size="sm" mb="lg">
                Are you sure you want to cancel this interview? This action cannot be undone.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>No, keep it</Button>
                <Button color="red" onClick={onConfirm} loading={isLoading}>Yes, cancel interview</Button>
            </Group>
        </Modal>
    );
}
