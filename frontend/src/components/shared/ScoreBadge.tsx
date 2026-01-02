import { Badge } from '@mantine/core';
import { getScoreColor } from '../../utils/score.utils';

interface ScoreBadgeProps {
    score: number | undefined;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
    const s = score || 0;

    return (
        <Badge
            size={size}
            color={getScoreColor(s)}
            variant="light"
            style={{ fontWeight: 700 }}
        >
            {s}/10
        </Badge>
    );
}
