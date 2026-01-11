import { Paper, Group, Title, Timeline, Text } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { ExperienceTimelineItem } from './ExperienceTimelineItem';
import type { Education } from '../../../services/education.service';

interface EducationSectionProps {
  educations: Education[];
}

export function EducationSection({ educations }: EducationSectionProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group mb="md">
        <IconSchool size={20} />
        <Title order={4}>Education</Title>
      </Group>
      {educations.length > 0 ? (
        <Timeline active={educations.length} bulletSize={24} lineWidth={2}>
          {educations.map((edu) => (
            <ExperienceTimelineItem
              key={edu.id}
              id={edu.id}
              title={edu.institution}
              subtitle={`${edu.degree_type} in ${edu.field_of_study}`}
              startDate={edu.start_date}
              endDate={edu.end_date}
              description={edu.description}
            />
          ))}
        </Timeline>
      ) : (
        <Text c="dimmed" size="sm">No education history added.</Text>
      )}
    </Paper>
  );
}
