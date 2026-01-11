
import { Timeline, Text } from '@mantine/core';

interface ExperienceTimelineItemProps {
    id: string;
    title: string;
    subtitle: string;
    startDate: string | Date;
    endDate: string | Date | null;
    description?: string;
}

export function ExperienceTimelineItem({
    id,
    title,
    subtitle,
    startDate,
    endDate,
    description
}: ExperienceTimelineItemProps) {
    return (
        <Timeline.Item key={id} title={title}>
            <Text size="sm" fw={500}>{subtitle}</Text>
            <Text size="xs" c="dimmed">
                {new Date(startDate).getFullYear()} - {endDate ? new Date(endDate).getFullYear() : 'Present'}
            </Text>
            {description && (
                <Text size="sm" mt={4}>{description}</Text>
            )}
        </Timeline.Item>
    );
}
