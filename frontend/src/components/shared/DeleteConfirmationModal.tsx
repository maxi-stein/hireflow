import { Modal, Text, Group, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('common');
    return (
        <Modal opened={opened} onClose={onClose} title={title} centered>
            <Text size="sm" mb="lg">
                {message}
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>
                    {t('actions.cancel')}
                </Button>
                <Button color="red" onClick={onConfirm}>
                    {t('actions.delete')}
                </Button>
            </Group>
        </Modal>
    );
};
