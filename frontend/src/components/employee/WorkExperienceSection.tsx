import { Paper, Group, Title, Timeline, Text } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';
import { type WorkExperience } from '../../services/candidate.service';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
}

export function WorkExperienceSection({ experiences }: WorkExperienceSectionProps) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Group mb="md">
        <IconBriefcase size={20} />
        <Title order={4}>Work Experience</Title>
      </Group>
      
      {experiences.length > 0 ? (
        <Timeline active={experiences.length} bulletSize={24} lineWidth={2}>
          {experiences.map((exp) => (
            <Timeline.Item key={exp.id} title={exp.position}>
              <Text size="sm" fw={500}>{exp.company_name}</Text>
              <Text size="xs" c="dimmed">
                {new Date(exp.start_date).getFullYear()} - {exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}
              </Text>
              {exp.description && (
                <Text size="sm" mt={4}>{exp.description}</Text>
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <Text c="dimmed" size="sm">No work experience added.</Text>
      )}
    </Paper>
  );
}
