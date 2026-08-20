import { Alert, Group, Text, Stack, Button, Box } from '@mantine/core';
import { IconCalendarEvent, IconExternalLink } from '@tabler/icons-react';
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
			icon={null}
			styles={{
				root: {
					borderLeft: '4px solid var(--mantine-color-violet-6)',
					padding: '18px 20px',
					borderRadius: '10px'
				},
				body: {
					width: '100%'
				}
			}}
		>
			<Group
				justify="space-between"
				align="center"
				gap="md"
				wrap="wrap"
			>
				<Group gap="md" wrap="nowrap" style={{ flex: 1, minWidth: 260 }}>
					<Box
						c="violet.7"
						bg="violet.1"
						p={10}
						style={{
							borderRadius: 10,
							display: 'grid',
							placeItems: 'center'
						}}
					>
						<IconCalendarEvent size={22} />
					</Box>

					<Stack gap={3}>
						<Text
							size="xs"
							fw={800}
							c="violet.7"
							tt="uppercase"
							style={{ letterSpacing: '0.4px' }}
						>
							{t('upcomingAlert.title')} · {timeRemaining}
						</Text>

						<Text fw={700} size="md">
							{nextInterview.jobPosition}
							<Text component="span" fw={400}>
								{' · '}
								{t(`timeline.interviewTypes.${nextInterview.interview.type}`)}
							</Text>
						</Text>

						<Text size="sm" c="dimmed">
							{t('upcomingAlert.dateTimeFormat', {
								date: dateStr,
								time: timeStr
							})}
						</Text>

						{sortedInterviews.length > 1 && (
							<Text size="xs" c="dimmed">
								{t('upcomingAlert.moreInterviews', {
									count: sortedInterviews.length - 1
								})}
							</Text>
						)}
					</Stack>
				</Group>

				{nextInterview.interview.meeting_link && (
					<Button
						component="a"
						href={nextInterview.interview.meeting_link}
						target="_blank"
						color="blue"
						variant="filled"
						leftSection={<IconExternalLink size={16} />}
					>
						{t('upcomingAlert.joinMeeting')}
					</Button>
				)}
			</Group>
		</Alert>
	);
}
