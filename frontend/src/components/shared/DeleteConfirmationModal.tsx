import { Modal, Text, Group, Button } from '@mantine/core';

interface DeleteConfirmationModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const DeleteConfirmationModal = ({
    opened,
    onClose,
    onConfirm,
    title,
    message,
}: DeleteConfirmationModalProps) => {
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
            <Text size="sm" mb="lg">
                {message}
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="red" onClick={onConfirm}>
                    Delete
                </Button>
            </Group>
        </Modal>
    );
};
