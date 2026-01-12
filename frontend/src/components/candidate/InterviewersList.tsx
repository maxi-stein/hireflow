import { Group, Avatar, Text, Stack, Tooltip } from '@mantine/core';
import type { Interviewer } from '../../services/interview.service';

interface InterviewersListProps {
    interviewers: Interviewer[];
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function InterviewersList({ interviewers, size = 'sm' }: InterviewersListProps) {
    if (!interviewers || interviewers.length === 0) {
        return <Text size={size} c="dimmed">No interviewers assigned</Text>;
    }

    return (
        <Group gap="xs">
            {interviewers.map((interviewer) => {
                const fullName = `${interviewer.user.first_name} ${interviewer.user.last_name}`;
                const initials = `${interviewer.user.first_name[0]}${interviewer.user.last_name[0]}`.toUpperCase();

                return (
                    <Tooltip key={interviewer.id} label={interviewer.user.email} withArrow>
                        <Group gap="xs">
                            <Avatar size={size} color="blue" radius="xl">
                                {initials}
                            </Avatar>
                            <Stack gap={0}>
                                <Text size={size} fw={500}>{fullName}</Text>
                            </Stack>
                        </Group>
                    </Tooltip>
                );
            })}
        </Group>
    );
}
