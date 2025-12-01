import { Paper, Avatar, Title, Text, Group, Button, ActionIcon, Stack } from '@mantine/core';
import { 
  IconMapPin, 
  IconDownload, 
  IconBrandLinkedin, 
  IconBrandGithub, 
  IconMail, 
  IconPhone, 
  IconCalendar 
} from '@tabler/icons-react';
import { type CandidateProfile } from '../../../services/candidate.service';
import { type UserFile } from '../../../services/user-file.service';

interface CandidateProfileCardProps {
  candidate: CandidateProfile;
  profilePictureUrl: string | null;
  resume?: UserFile;
  onDownloadResume: () => void;
}

export function CandidateProfileCard({ 
  candidate, 
  profilePictureUrl, 
  resume, 
  onDownloadResume 
}: CandidateProfileCardProps) {
  const { user } = candidate;

  return (
    <Paper withBorder radius="md" p="xl" style={{ textAlign: 'center' }}>
      <Avatar 
        src={profilePictureUrl} 
        size={120} 
        radius={120} 
        mx="auto" 
        color="blue"
      >
        {user.first_name[0]}{user.last_name[0]}
      </Avatar>
      <Title order={2} mt="md">
        {user.first_name} {user.last_name}
      </Title>
      <Text c="dimmed" size="sm">{user.email}</Text>
      
      {(candidate.city || candidate.country) && (
        <Group justify="center" gap="xs" mt="xs">
          <IconMapPin size={16} color="gray" />
          <Text size="sm" c="dimmed">
            {[candidate.city, candidate.country].filter(Boolean).join(', ')}
          </Text>
        </Group>
      )}

      {resume ? (
        <Button 
          onClick={onDownloadResume}
          variant="light" 
          fullWidth 
          mt="md"
          leftSection={<IconDownload size={16} />}
        >
          Download Resume
        </Button>
      ) : (
        <Paper withBorder p="sm" mt="md">
          <Text size="sm" c="dimmed" ta="center">
            No resume uploaded
          </Text>
        </Paper>
      )}

      <Group justify="center" gap="md" mt="lg">
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

      <Stack mt="xl" gap="sm" align="flex-start">
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
      </Stack>
    </Paper>
  );
}
