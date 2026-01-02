import { Paper, Title, Text, Group } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/CandidateAvatar';
import { type CandidateProfile } from '../../../services/candidate.service';

interface CandidateHeaderProps {
  candidate: CandidateProfile;
}

export function CandidateHeader({ candidate }: CandidateHeaderProps) {
  const { user } = candidate;

  return (
    <Paper withBorder radius="md" p="xl">
      <Group>
        <CandidateAvatar
          candidateId={candidate.id}
          firstName={user.first_name}
          lastName={user.last_name}
          size={80}
          radius={80}
        />
        <div>
          <Title order={2}>
            {user.first_name} {user.last_name}
          </Title>
          <Text c="dimmed">{user.email}</Text>

          {(candidate.city || candidate.country) && (
            <Group gap="xs" mt={4}>
              <IconMapPin size={16} color="gray" />
              <Text size="sm" c="dimmed">
                {[candidate.city, candidate.country].filter(Boolean).join(', ')}
              </Text>
            </Group>
          )}
        </div>
      </Group>
    </Paper>
  );
}
