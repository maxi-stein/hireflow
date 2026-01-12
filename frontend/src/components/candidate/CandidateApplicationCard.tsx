import { Card, Group, Badge, Text, Stack, Divider, Timeline, Box, Button } from '@mantine/core';
import { IconCalendar, IconMapPin, IconBriefcase, IconCash, IconGift, IconClock, IconCheck, IconX, IconExternalLink } from '@tabler/icons-react';
import type { CandidateApplication } from '../../services/candidate-application.service';
import { ApplicationStatus } from '../../services/candidate-application.service';
import type { Interview, Interviewer } from '../../services/interview.service';
import { InterviewStatus } from '../../services/interview.service';
import { getApplicationStatusColor } from '../../utils/application.utils';
import { useNavigate } from 'react-router-dom';

interface CandidateApplicationCardProps {
    application: CandidateApplication;
    interviews: Interview[];
}

export function CandidateApplicationCard({ application, interviews }: CandidateApplicationCardProps) {
    const { job_offer, status, created_at } = application;
    const navigate = useNavigate();

    const getInterviewStatusColor = (status: InterviewStatus) => {
        switch (status) {
            case InterviewStatus.COMPLETED: return 'green';
            case InterviewStatus.CANCELLED: return 'red';
            case InterviewStatus.SCHEDULED: return 'blue';
            case InterviewStatus.NO_SHOW: return 'orange';
            default: return 'gray';
        }
    };

    const getInterviewStatusIcon = (status: InterviewStatus) => {
        switch (status) {
            case InterviewStatus.COMPLETED: return IconCheck;
            case InterviewStatus.CANCELLED: return IconX;
            case InterviewStatus.SCHEDULED: return IconClock;
            case InterviewStatus.NO_SHOW: return IconX;
            default: return IconClock;
        }
    };

    const sortedInterviews = [...interviews].sort((a, b) =>
        new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime()
    );

    const hasScheduledInterview = sortedInterviews.some((i: Interview) => i.status === InterviewStatus.SCHEDULED);
    const badgeStatus = hasScheduledInterview ? 'INTERVIEW SCHEDULED' : status.replace('_', ' ');
    const badgeColor = hasScheduledInterview ? 'violet' : getApplicationStatusColor(status);

    return (
        <Card withBorder padding="lg" radius="md" shadow="sm">
            {/* Header: Position and Status */}
            <Group justify="space-between" mb="md">
                <Box>
                    <Text size="xl" fw={700}>{job_offer.position}</Text>
                    <Group gap="xs" mt="xs">
                        <IconMapPin size={16} />
                        <Text size="sm" c="dimmed">{job_offer.location}</Text>
                        <Text size="sm" c="dimmed">•</Text>
                        <IconBriefcase size={16} />
                        <Text size="sm" c="dimmed">{job_offer.work_mode}</Text>
                    </Group>
                </Box>
                <Badge size="lg" color={badgeColor} variant="filled">
                    {badgeStatus}
                </Badge>
            </Group>

            {/* Application Date */}
            <Group gap="xs" mb="md">
                <IconCalendar size={16} />
                <Text size="sm" c="dimmed">
                    Applied on {new Date(created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </Group>

            <Divider my="md" />

            {/* Job Details */}
            <Stack gap="sm" mb="md">
                {job_offer.salary && (
                    <Group gap="xs">
                        <IconCash size={16} />
                        <Text size="sm" fw={500}>Salary:</Text>
                        <Text size="sm">{job_offer.salary}</Text>
                    </Group>
                )}

                {job_offer.benefits && (
                    <Group gap="xs" align="flex-start">
                        <IconGift size={16} style={{ marginTop: 2 }} />
                        <Text size="sm" fw={500}>Benefits:</Text>
                        <Text size="sm" style={{ flex: 1 }}>{job_offer.benefits}</Text>
                    </Group>
                )}
            </Stack>

            <Divider my="md" />

            {/* Job Offer Button */}
            <Button
                variant="light"
                color="blue"
                fullWidth
                leftSection={<IconExternalLink size={18} />}
                mb="md"
                onClick={() => navigate(`/jobs?highlight=${job_offer.id}`)}
            >
                View Job Offer
            </Button>

            {/* Interview Timeline */}
            {sortedInterviews.length > 0 && (
                <>
                    <Divider my="md" />
                    <Text size="sm" fw={600} mb="md">Interview Timeline</Text>
                    <Timeline active={sortedInterviews.length} bulletSize={24} lineWidth={2}>
                        {sortedInterviews.map((interview: Interview) => {
                            const StatusIcon = getInterviewStatusIcon(interview.status);

                            return (
                                <Timeline.Item
                                    key={interview.id}
                                    bullet={<StatusIcon size={12} />}
                                    title={
                                        <Group gap="xs">
                                            <Text size="sm" fw={500}>
                                                {new Date(interview.scheduled_time).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                                {' at '}
                                                {new Date(interview.scheduled_time).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </Text>
                                            <Badge size="xs" color={getInterviewStatusColor(interview.status)} variant="light">
                                                {interview.status}
                                            </Badge>
                                        </Group>
                                    }
                                    color={getInterviewStatusColor(interview.status)}
                                >
                                    <Stack gap="xs" mt="xs">
                                        <Text size="sm" c="dimmed">{interview.type} Interview</Text>
                                        {interview.meeting_link && new Date(interview.scheduled_time) > new Date() && (
                                            <Text size="sm">
                                                <a href={interview.meeting_link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                                                    Join Meeting
                                                </a>
                                            </Text>
                                        )}
                                        <Box>
                                            <Text size="xs" c="dimmed">
                                                Interviewers: {interview.interviewers.map((i: Interviewer) => `${i.user.first_name} ${i.user.last_name}`).join(', ')}
                                            </Text>
                                        </Box>
                                    </Stack>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
                </>
            )}

            {/* No Interviews State */}
            {sortedInterviews.length === 0 && status === ApplicationStatus.IN_PROGRESS && (
                <>
                    <Divider my="md" />
                    <Text size="sm" c="dimmed" ta="center">
                        No interviews scheduled yet. You will be notified when an interview is scheduled.
                    </Text>
                </>
            )}
        </Card>
    );
}
