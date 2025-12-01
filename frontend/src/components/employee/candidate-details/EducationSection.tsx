import { Paper, Group, Title, Timeline, Text } from '@mantine/core';
import { IconSchool } from '@tabler/icons-react';
import { type Education } from '../../../services/candidate.service';

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
            <Timeline.Item key={edu.id} title={edu.institution}>
              <Text size="sm" fw={500}>{edu.degree_type} in {edu.field_of_study}</Text>
              <Text size="xs" c="dimmed">
                {new Date(edu.start_date).getFullYear()} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Text c="dimmed" size="sm">No education history added.</Text>
      )}
    </Paper>
  );
}
