import { Group, Badge, Tooltip, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { JobOfferSkill } from '../../../services/job-offer.service';

interface JobOfferSkillsProps {
  skills: JobOfferSkill[];
  hideTitle?: boolean;
}

export const JobOfferSkills = ({ skills, hideTitle = false }: JobOfferSkillsProps) => {
  const { t } = useTranslation('jobs');

  if (!skills || skills.length === 0) return null;

  return (
    <Stack gap={6}>
      {!hideTitle && (
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: '0.5px' }}>
          {t('jobCard.requiredSkills', 'Habilidades requeridas')}
        </Text>
      )}
      <Group gap={6} wrap="wrap">
        {skills.slice(0, 5).map((skill) => (
          <Badge
            key={skill.id}
            radius="md"
            size="md"
            variant="outline"
            color="blue"
            style={{
              textTransform: 'none',
              fontWeight: 600,
              paddingLeft: '10px',
              paddingRight: '10px',
              backgroundColor: 'rgba(37, 99, 235, 0.04)',
              borderColor: 'rgba(191, 219, 254, 0.9)',
            }}
          >
            {skill.skill_name}
          </Badge>
        ))}
        {skills.length > 5 && (
          <Tooltip label={skills.slice(5).map((s) => s.skill_name).join(', ')}>
            <Badge
              variant="light"
              radius="md"
              size="md"
              color="gray"
              style={{
                cursor: 'pointer',
                fontWeight: 600,
                paddingLeft: '8px',
                paddingRight: '8px',
              }}
            >
              {t('skillsMore', { count: skills.length - 5, defaultValue: `+${skills.length - 5}` })}
            </Badge>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
};
