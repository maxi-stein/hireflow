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

import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('profile');
  const { user } = candidate;

  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={3} mb="lg">{t('candidate.management.links.title')}</Title>

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
            <Text size="sm">{t('candidate.management.links.joined', { date: new Date(candidate.profile_created_at).toLocaleDateString() })}</Text>
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
              {t('candidate.management.links.downloadResume')}
            </Button>
          ) : (
            <Paper withBorder p="sm">
              <Text size="sm" c="dimmed" ta="center">
                {t('candidate.management.links.noResume')}
              </Text>
            </Paper>
          )}
        </div>
      </Group>
    </Paper>
  );
}
