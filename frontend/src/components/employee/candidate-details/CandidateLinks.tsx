import { Paper, Text, Group, Button, ActionIcon, Stack, Title } from '@mantine/core';
import {
  IconDownload,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMail,
  IconPhone,
  IconCalendar
} from '@tabler/icons-react';
import { type CandidateProfile } from '../../../services/candidate.service';
import { type UserFile } from '../../../services/user-file.service';

interface CandidateLinksProps {
  candidate: CandidateProfile;
  resume?: UserFile;
  onDownloadResume: () => void;
}

export function CandidateLinks({
  candidate,
  resume,
  onDownloadResume
}: CandidateLinksProps) {
  const { user } = candidate;

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="lg">Contact & Documents</Title>

      <Group align="flex-start" justify="space-between">
        <Stack gap="sm">
          {candidate.phone && (
            <Group gap="xs">
              <IconPhone size={16} color="gray" />
              <Text size="sm">{candidate.phone}</Text>
            </Group>
          )}
          <Group gap="xs">
            <IconCalendar size={16} color="gray" />
            <Text size="sm">Joined {new Date(candidate.profile_created_at).toLocaleDateString()}</Text>
          </Group>

          <Group gap="md">
            {candidate.linkedin && (
              <ActionIcon component="a" href={candidate.linkedin} target="_blank" size="lg" variant="default">
                <IconBrandLinkedin size={18} />
              </ActionIcon>
            )}
            {candidate.github && (
              <ActionIcon component="a" href={candidate.github} target="_blank" size="lg" variant="default">
                <IconBrandGithub size={18} />
              </ActionIcon>
            )}
            <ActionIcon component="a" href={`mailto:${user.email}`} size="lg" variant="default">
              <IconMail size={18} />
            </ActionIcon>
          </Group>
        </Stack>

        <div style={{ width: 200 }}>
          {resume ? (
            <Button
              onClick={onDownloadResume}
              variant="light"
              fullWidth
              leftSection={<IconDownload size={16} />}
            >
              Download Resume
            </Button>
          ) : (
            <Paper withBorder p="sm">
              <Text size="sm" c="dimmed" ta="center">
                No resume uploaded
              </Text>
            </Paper>
          )}
        </div>
      </Group>
    </Paper>
  );
}
