import { Text, Group, Button, ActionIcon, Stack, Box, Tooltip, useMantineColorScheme } from '@mantine/core';
import {
  IconDownload,
  IconBrandLinkedin,
  IconBrandGithub,
  IconMail,
  IconPhone,
  IconCalendar,
  IconFileText,
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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = candidate;

  return (
    <Box
      p="xl"
      style={{
        borderRadius: 16,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        background: isDark ? '#1e293b' : '#ffffff',
        height: '100%',
      }}
    >
      <Stack gap="lg">
        {/* Contact info */}
        <Stack gap="sm">
          {candidate.phone && (
            <Group gap="sm">
              <Box p={6} style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', display: 'flex' }}>
                <IconPhone size={14} color={isDark ? '#94a3b8' : '#64748b'} />
              </Box>
              <Text size="sm">{candidate.phone}</Text>
            </Group>
          )}
          <Group gap="sm">
            <Box p={6} style={{ borderRadius: 8, background: isDark ? '#334155' : '#f1f5f9', display: 'flex' }}>
              <IconCalendar size={14} color={isDark ? '#94a3b8' : '#64748b'} />
            </Box>
            <Text size="sm" c="dimmed">
              {t('candidate.management.links.joined', { date: new Date(candidate.profile_created_at).toLocaleDateString() })}
            </Text>
          </Group>
        </Stack>

        {/* Social Links */}
        <Group gap="xs">
          {candidate.linkedin && (
            <Tooltip label="LinkedIn">
              <ActionIcon
                component="a"
                href={candidate.linkedin}
                target="_blank"
                size="lg"
                variant="light"
                color="blue"
                radius="md"
              >
                <IconBrandLinkedin size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          {candidate.github && (
            <Tooltip label="GitHub">
              <ActionIcon
                component="a"
                href={candidate.github}
                target="_blank"
                size="lg"
                variant="light"
                color="gray"
                radius="md"
              >
                <IconBrandGithub size={18} />
              </ActionIcon>
            </Tooltip>
          )}
          <Tooltip label={user.email}>
            <ActionIcon
              component="a"
              href={`mailto:${user.email}`}
              size="lg"
              variant="light"
              color="teal"
              radius="md"
            >
              <IconMail size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        {/* Resume */}
        {resume ? (
          <Button
            onClick={onDownloadResume}
            variant="light"
            color="blue"
            fullWidth
            leftSection={<IconDownload size={15} />}
            radius="md"
          >
            {t('candidate.management.links.downloadResume')}
          </Button>
        ) : (
          <Box
            p="md"
            style={{
              borderRadius: 10,
              border: `1px dashed ${isDark ? '#334155' : '#e2e8f0'}`,
              textAlign: 'center',
            }}
          >
            <IconFileText size={20} color={isDark ? '#475569' : '#cbd5e1'} style={{ marginBottom: 6 }} />
            <Text size="xs" c="dimmed">
              {t('candidate.management.links.noResume')}
            </Text>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
