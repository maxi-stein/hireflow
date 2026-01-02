import { Card, Stack, Group, Title, Badge, Text } from '@mantine/core';
import { IconMapPin, IconBriefcase, IconCurrencyDollar, IconClock } from '@tabler/icons-react';
import type { JobOffer } from '../../services/job-offer.service';
import type { ReactNode } from 'react';

interface JobOfferCardProps {
  job: JobOffer;
  action?: ReactNode;
  showSensitiveData?: boolean;
}

export const JobOfferCard = ({ job, action, showSensitiveData = false }: JobOfferCardProps) => {
  return (
    <Card withBorder p="lg" radius="md" shadow="sm">
      <Stack gap="md">
        <div>
          <Group justify="space-between" mb="xs">
            <Title order={3}>{job.position}</Title>
            <Badge color="green" variant="light">
              {job.status}
            </Badge>
          </Group>

          <Group gap="md" mb="md">
            <Group gap="xs">
              <IconMapPin size={16} />
              <Text size="sm" c="dimmed">{job.location}</Text>
            </Group>
            <Group gap="xs">
              <IconBriefcase size={16} />
              <Text size="sm" c="dimmed">{job.work_mode}</Text>
            </Group>
          </Group>
        </div>

        <Text lineClamp={3}>{job.description}</Text>

        {job.salary && (
          <Group gap="xs">
            <IconCurrencyDollar size={16} />
            <Text size="sm" fw={500}>{job.salary}</Text>
          </Group>
        )}

        {job.benefits && (
          <div>
            <Text size="sm" fw={500} mb={5}>Benefits:</Text>
            <Text size="sm" c="dimmed">{job.benefits}</Text>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb={5}>Required Skills:</Text>
            <Group gap="xs">
              {job.skills.map((skill) => (
                <Badge key={skill.id} variant="outline">
                  {skill.skill_name}
                </Badge>
              ))}
            </Group>
          </div>
        )}

        {showSensitiveData && job.deadline && (
          <Group gap="xs">
            <IconClock size={16} />
            <Text size="sm" c="dimmed">
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </Text>
          </Group>
        )}

        <Group gap="xs">
          <Text size="sm" c="dimmed">{job.applicants_count} applicants</Text>
        </Group>

        {action}
      </Stack>
    </Card>
  );
};
