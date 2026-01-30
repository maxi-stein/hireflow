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
      <Group wrap="nowrap" align="flex-start" gap="xl">
        {/* Left side - Main content */}
        <Stack gap="sm" style={{ flex: 1 }}>
          <div>
            <Title order={3} mb="xs">{job.position}</Title>

            <Group gap="md" mb="sm">
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

          <Text lineClamp={2}>{job.description}</Text>

          <Group gap="lg">
            {job.salary && (
              <Group gap="xs">
                <IconCurrencyDollar size={16} />
                <Text size="sm" fw={500}>{job.salary}</Text>
              </Group>
            )}

            {showSensitiveData && job.deadline && (
              <Group gap="xs">
                <IconClock size={16} />
                <Text size="sm" c="dimmed">
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </Text>
              </Group>
            )}

            <Text size="sm" c="dimmed">{job.applicants_count} applicants</Text>
          </Group>

          {job.skills && job.skills.length > 0 && (
            <Group gap="xs">
              {job.skills.slice(0, 5).map((skill) => (
                <Badge key={skill.id} variant="outline" size="sm">
                  {skill.skill_name}
                </Badge>
              ))}
              {job.skills.length > 5 && (
                <Badge variant="outline" size="sm" c="dimmed">
                  +{job.skills.length - 5} more
                </Badge>
              )}
            </Group>
          )}
        </Stack>

        {/* Right side - Action button */}
        {action && (
          <div style={{ minWidth: '180px', alignSelf: 'flex-start' }}>
            {action}
          </div>
        )}
      </Group>

      {/* Optional: Benefits shown at bottom if exist */}
      {job.benefits && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Text size="sm" fw={500} mb={5}>Benefits:</Text>
          <Text size="sm" c="dimmed">{job.benefits}</Text>
        </div>
      )}
    </Card>
  );
};
