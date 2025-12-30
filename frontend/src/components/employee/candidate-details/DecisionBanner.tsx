import { Alert, Button, Group, Text, Box } from '@mantine/core';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';
import { ScoreBadge } from '../../shared/ScoreBadge';

interface DecisionBannerProps {
    score: number;
    onHire: () => void;
    onReject: () => void;
    isLoading?: boolean;
}

export function DecisionBanner({ score, onHire, onReject, isLoading }: DecisionBannerProps) {
    return (
        <Alert
            variant="light"
            color="blue"
            title="Interview Process Completed"
            icon={<IconInfoCircle />}
            mb="lg"
        >
            <Group justify="space-between" align="center">
                <Box>
                    <Text size="sm" mb={4}>
                        The candidate has completed the interview process. Based on the reviews, please make a final decision.
                    </Text>
                    <Group gap="xs">
                        <Text size="sm" fw={500}>Overall Score:</Text>
                        <ScoreBadge score={score} size="md" />
                    </Group>
                </Box>
                <Group>
                    <Button
                        color="red"
                        variant="subtle"
                        leftSection={<IconX size={16} />}
                        onClick={onReject}
                        loading={isLoading}
                    >
                        Reject
                    </Button>
                    <Button
                        color="green"
                        leftSection={<IconCheck size={16} />}
                        onClick={onHire}
                        loading={isLoading}
                    >
                        Hire Candidate
                    </Button>
                </Group>
            </Group>
        </Alert>
    );
}
