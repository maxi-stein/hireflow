import { Group, Badge, Tooltip } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { JobOfferSkill } from '../../../services/job-offer.service';

interface JobOfferSkillsProps {
  skills: JobOfferSkill[];
}

export const JobOfferSkills = ({ skills }: JobOfferSkillsProps) => {
  const { t } = useTranslation('jobs');

  if (!skills || skills.length === 0) return null;

  return (
    <Group gap={6}>
      {skills.slice(0, 5).map((skill) => (
        <Badge
          key={skill.id}
          variant="light"
          radius="sm"
          size="sm"
          bg="blue.1" // Very light blue background
          c="blue.8"  // Dark blue text
          style={{ textTransform: 'capitalize' }}
        >
          {skill.skill_name}
        </Badge>
      ))}
      {skills.length > 5 && (
        <Tooltip label={skills.slice(5).map(s => s.skill_name).join(', ')}>
          <Badge variant="light" radius="sm" size="sm" c="dimmed" bg="gray.1">
            {t('skillsMore', { count: skills.length - 5 })}
          </Badge>
        </Tooltip>
      )}
    </Group>
  );
};
