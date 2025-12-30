import { Badge, type MantineColor } from '@mantine/core';

interface ScoreBadgeProps {
    score: number | undefined;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
    const s = score || 0;

    const getColor = (): MantineColor => {
        if (s >= 8) return 'green';
        if (s >= 5) return 'yellow';
        return 'red';
    };

    return (
        <Badge
            size={size}
            color={getColor()}
            variant="light"
            style={{ fontWeight: 700 }}
        >
            {s}/10
        </Badge>
    );
}
