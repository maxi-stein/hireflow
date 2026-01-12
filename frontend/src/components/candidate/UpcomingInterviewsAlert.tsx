import { Alert, Group, Text, Badge, Stack, Button } from '@mantine/core';
import { IconCalendarEvent, IconClock } from '@tabler/icons-react';
import type { Interview } from '../../services/interview.service';

interface UpcomingInterviewsAlertProps {
    upcomingInterviews: Array<{ interview: Interview; jobPosition: string }>;
}

export function UpcomingInterviewsAlert({ upcomingInterviews }: UpcomingInterviewsAlertProps) {
    if (upcomingInterviews.length === 0) {
        return null;
    }

    // Sort by nearest first
    const sortedInterviews = [...upcomingInterviews].sort((a, b) =>
        new Date(a.interview.scheduled_time).getTime() - new Date(b.interview.scheduled_time).getTime()
    );

    const nextInterview = sortedInterviews[0];
    const interviewDate = new Date(nextInterview.interview.scheduled_time);
    const now = new Date();
    const hoursUntil = Math.floor((interviewDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    const daysUntil = Math.floor(hoursUntil / 24);

    let timeRemaining = '';
    if (daysUntil > 0) {
        timeRemaining = `in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`;
    } else if (hoursUntil > 0) {
        timeRemaining = `in ${hoursUntil} ${hoursUntil === 1 ? 'hour' : 'hours'}`;
    } else {
        timeRemaining = 'soon';
    }

    return (
        <Alert
            variant="light"
            color="violet"
            title={
                <Group gap="xs">
                    <IconCalendarEvent size={20} />
                    <Text fw={600}>Upcoming Interview</Text>
                </Group>
            }
            styles={{
                root: { borderLeft: '4px solid var(--mantine-color-violet-6)' }
            }}
        >
            <Stack gap="sm">
                <Group gap="xs" wrap="wrap">
                    <Badge color="violet" size="lg" leftSection={<IconClock size={14} />}>
                        {timeRemaining}
                    </Badge>
                    <Text size="sm">
                        <strong>{nextInterview.jobPosition}</strong> - {nextInterview.interview.type} Interview
                    </Text>
                </Group>

                <Text size="sm" c="dimmed">
                    {interviewDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}{' '}
                    at{' '}
                    {interviewDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </Text>

                {nextInterview.interview.meeting_link && (
                    <div>
                        <Button
                            component="a"
                            href={nextInterview.interview.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            variant="light"
                            leftSection={<IconCalendarEvent size={16} />}
                        >
                            Join Interview Meeting
                        </Button>
                    </div>
                )}

                {sortedInterviews.length > 1 && (
                    <Text size="xs" c="dimmed">
                        + {sortedInterviews.length - 1} more interview{sortedInterviews.length - 1 !== 1 ? 's' : ''} scheduled
                    </Text>
                )}
            </Stack>
        </Alert>
    );
}
