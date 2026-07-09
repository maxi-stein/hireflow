import { Modal, Text, Group, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';

interface CancelInterviewModalProps {
    opened: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}

export function CancelInterviewModal({ opened, onClose, onConfirm, isLoading }: CancelInterviewModalProps) {
    const { t } = useTranslation('calendar');

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={t('actions.cancel')}
            centered
            zIndex={1000}
        >
            <Text size="sm" mb="lg">
                {t('modal.cancelMessage')}
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>{t('modal.buttons.keepIt')}</Button>
                <Button color="red" onClick={onConfirm} loading={isLoading}>{t('modal.buttons.confirmCancel')}</Button>
            </Group>
        </Modal>
    );
}
