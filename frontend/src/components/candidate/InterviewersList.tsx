import { Group, Text, Stack, Tooltip } from '@mantine/core';
import { CandidateAvatar } from '../shared/candidate-display/CandidateAvatar';
import type { Interviewer } from '../../services/interview.service';
import { useTranslation } from 'react-i18next';

interface InterviewersListProps {
    interviewers: Interviewer[];
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function InterviewersList({ interviewers, size = 'sm' }: InterviewersListProps) {
    const { t } = useTranslation('applications');

    if (!interviewers || interviewers.length === 0) {
        return <Text size={size} c="dimmed">{t('timeline.noInterviewers')}</Text>;
    }

    return (
        <Group gap="xs">
            {interviewers.map((interviewer) => {
                const fullName = `${interviewer.user.first_name} ${interviewer.user.last_name}`;
                const initials = `${interviewer.user.first_name[0]}${interviewer.user.last_name[0]}`.toUpperCase();

                return (
                    <Tooltip key={interviewer.id} label={interviewer.user.email} withArrow>
                        <Group gap="xs">
                            <CandidateAvatar size={size} color="blue">
                                {initials}
                            </CandidateAvatar>
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
