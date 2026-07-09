import { Paper, Group, Title, Timeline, Text } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import { ExperienceTimelineItem } from './ExperienceTimelineItem';
import type { WorkExperience } from '../../../services/work-experience.service';
import { useTranslation } from 'react-i18next';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
}

export function WorkExperienceSection({ experiences }: WorkExperienceSectionProps) {
  const { t } = useTranslation(['profile', 'candidates']);

  return (
    <Paper withBorder radius="md" p="lg">
      <Group mb="md">
        <IconBriefcase size={20} />
        <Title order={4}>{t('experience.title')}</Title>
      </Group>

      {experiences.length > 0 ? (
        <Timeline active={experiences.length} bulletSize={24} lineWidth={2}>
          {experiences.map((exp) => (
            <ExperienceTimelineItem
              key={exp.id}
              id={exp.id}
              title={exp.position}
              subtitle={exp.company_name}
              startDate={exp.start_date}
              endDate={exp.end_date}
              description={exp.description}
            />
          ))}
        </Timeline>
      ) : (
        <Text c="dimmed" size="sm">{t('compare.card.empty.experience', { ns: 'candidates' })}</Text>
      )}
    </Paper>
  );
}
