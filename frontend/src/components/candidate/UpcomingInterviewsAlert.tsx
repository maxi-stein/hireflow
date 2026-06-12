import { Alert, Group, Text, Badge, Stack, Button } from '@mantine/core';
import { IconCalendarEvent, IconClock } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import type { Interview } from '../../services/interview.service';

interface UpcomingInterviewsAlertProps {
    upcomingInterviews: Array<{ interview: Interview; jobPosition: string }>;
}

export function UpcomingInterviewsAlert({ upcomingInterviews }: UpcomingInterviewsAlertProps) {
    const { t, i18n } = useTranslation('applications');

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
        timeRemaining = daysUntil === 1
            ? t('upcomingAlert.inDay')
            : t('upcomingAlert.inDays', { count: daysUntil });
    } else if (hoursUntil > 0) {
        timeRemaining = hoursUntil === 1
            ? t('upcomingAlert.inHour')
            : t('upcomingAlert.inHours', { count: hoursUntil });
    } else {
        timeRemaining = t('upcomingAlert.soon');
    }

    const dateStr = interviewDate.toLocaleDateString(i18n.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = interviewDate.toLocaleTimeString(i18n.language, {
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <Alert
            variant="light"
            color="violet"
            title={
                <Group gap="xs">
                    <IconCalendarEvent size={20} />
                    <Text fw={600}>{t('upcomingAlert.title')}</Text>
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
                        <strong>{nextInterview.jobPosition}</strong> - {t(`timeline.interviewTypes.${nextInterview.interview.type}`)}
                    </Text>
                </Group>

                <Text size="sm" c="dimmed">
                    {t('upcomingAlert.dateTimeFormat', { date: dateStr, time: timeStr })}
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
                            {t('upcomingAlert.joinMeeting')}
                        </Button>
                    </div>
                )}

                {sortedInterviews.length > 1 && (
                    <Text size="xs" c="dimmed">
                        {t('upcomingAlert.moreInterviews', { count: sortedInterviews.length - 1 })}
                    </Text>
                )}
            </Stack>
        </Alert>
    );
}
