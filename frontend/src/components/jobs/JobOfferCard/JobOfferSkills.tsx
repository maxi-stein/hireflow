import { Group, Badge, Tooltip, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { JobOfferSkill } from '../../../services/job-offer.service';

interface JobOfferSkillsProps {
  skills: JobOfferSkill[];
}

export const JobOfferSkills = ({ skills }: JobOfferSkillsProps) => {
  const { t } = useTranslation('jobs');

  if (!skills || skills.length === 0) return null;

  return (
    <Stack gap={6}>
      <Text size="md" fw={700} tt="uppercase" c="light-dark(var(--mantine-color-gray-5), var(--mantine-color-gray-5))">
        Stack
      </Text>
      <Group gap={10} wrap="wrap">
        {skills.slice(0, 5).map((skill) => (
          <Badge
            key={skill.id}
            radius="xl"
            size="lg"
            bg="light-dark(var(--mantine-color-blue-1), #181b27)"
            c="blue.9"
            style={{
              textTransform: 'capitalize',
              paddingLeft: '10px',
              paddingRight: '10px',
            }}
          >
            {skill.skill_name}
          </Badge>
        ))}
        {skills.length > 5 && (
          <Tooltip label={skills.slice(5).map((s) => s.skill_name).join(', ')}>
            <Badge
              variant="light"
              radius="xl"
              size="lg"
              c="dimmed"
              bg="gray.1"
              style={{
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              {t('skillsMore', { count: skills.length - 5 })}
            </Badge>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
};
