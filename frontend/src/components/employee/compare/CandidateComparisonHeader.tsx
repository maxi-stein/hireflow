import {
  Box,
  Group,
  Text,
  Button,
  ActionIcon,
  Badge,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconDownload,
  IconMapPin,
  IconBrandLinkedin,
  IconBrandGithub,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import type { CandidateApplication } from '../../../services/candidate-application.service';
import { ApplicationStatus } from '../../../services/candidate-application.service';
import type { CandidateProfile } from '../../../services/candidate.service';
import type { WorkExperience } from '../../../services/work-experience.service';

export interface CandidateComparisonHeaderProps {
  application: CandidateApplication;
  candidateProfile?: CandidateProfile | null;
  latestExperience?: WorkExperience | null;
  hasResume: boolean;
  onDownloadResume: () => void;
}

export const CandidateComparisonHeader = ({
  application,
  candidateProfile,
  latestExperience,
  hasResume,
  onDownloadResume,
}: CandidateComparisonHeaderProps) => {
  const { t } = useTranslation(['profile']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
        overflow: 'hidden',
      }}
    >
      {/* Cover gradient strip */}
      <Box
        h={56}
        style={{
          background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #2563eb 100%)',
        }}
      />

      <Box px="lg" pb="md" style={{ background: isDark ? '#1e293b' : '#ffffff' }}>
        {/* Avatar overlaps cover */}
        <Group mb="sm" align="flex-end" style={{ marginTop: -32 }} wrap="nowrap">
          <Box style={{ flexShrink: 0 }}>
            <Box
              style={{
                borderRadius: 14,
                border: `3px solid ${isDark ? '#1e293b' : '#ffffff'}`,
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                overflow: 'hidden',
              }}
            >
              <CandidateAvatar
                candidateId={application.candidate.id}
                firstName={application.candidate.user.first_name}
                lastName={application.candidate.user.last_name}
                size={60}
              />
            </Box>
          </Box>
          <Box style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
            <Text
              fw={700}
              size="md"
              truncate
              style={{ lineHeight: 1.2, color: isDark ? '#f1f5f9' : '#0f172a' }}
            >
              {application.candidate.user.first_name} {application.candidate.user.last_name}
            </Text>
            {latestExperience && (
              <Text size="xs" fw={500} c="dimmed" truncate style={{ lineHeight: 1.2 }}>
                {latestExperience.position}
              </Text>
            )}
            {(candidateProfile?.city || candidateProfile?.country) && (
              <Group gap={4} wrap="nowrap" style={{ lineHeight: 1.2, marginTop: 2 }}>
                <IconMapPin size={12} style={{ opacity: 0.5, flexShrink: 0 }} />
                <Text size="xs" c="dimmed" truncate>
                  {candidateProfile.city}
                  {candidateProfile.city && candidateProfile.country ? ', ' : ''}
                  {candidateProfile.country}
                </Text>
              </Group>
            )}
          </Box>
        </Group>

        {/* Action links */}
        <Group gap="xs" mt={4} wrap="wrap">
          <Tooltip
            label={
              hasResume
                ? t('candidate.management.links.downloadResume')
                : t('candidate.management.links.noResume')
            }
          >
            <Button
              variant="light"
              size="xs"
              disabled={!hasResume}
              onClick={onDownloadResume}
              radius="md"
              leftSection={<IconDownload size={13} />}
            >
              CV
            </Button>
          </Tooltip>

          <Tooltip label="LinkedIn">
            <ActionIcon
              variant="light"
              color="blue"
              size="sm"
              component="a"
              href={candidateProfile?.linkedin || undefined}
              target="_blank"
              rel="noopener noreferrer"
              disabled={!candidateProfile?.linkedin}
              radius="md"
            >
              <IconBrandLinkedin size={14} />
            </ActionIcon>
          </Tooltip>

          {candidateProfile?.github && (
            <Tooltip label="GitHub">
              <ActionIcon
                variant="light"
                color="gray"
                size="sm"
                component="a"
                href={candidateProfile.github}
                target="_blank"
                rel="noopener noreferrer"
                radius="md"
              >
                <IconBrandGithub size={14} />
              </ActionIcon>
            </Tooltip>
          )}

          <Badge
            variant="light"
            color={
              application.status === ApplicationStatus.HIRED
                ? 'green'
                : application.status === ApplicationStatus.REJECTED
                  ? 'red'
                  : 'blue'
            }
            size="sm"
            radius="md"
            ml="auto"
          >
            {application.status}
          </Badge>
        </Group>
      </Box>
    </Box>
  );
};
