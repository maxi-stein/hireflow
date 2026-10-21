import { Paper, Title, Text, Group, Badge, Box, useMantineColorScheme } from '@mantine/core';
import { IconMapPin, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { CandidateAvatar } from '../../shared/candidate-display/CandidateAvatar';
import { type CandidateProfile } from '../../../services/candidate.service';

interface CandidateHeaderProps {
  candidate: CandidateProfile;
  isHired?: boolean;
}

import { useTranslation } from 'react-i18next';

export function CandidateHeader({ candidate, isHired }: CandidateHeaderProps) {
  const { t } = useTranslation('profile');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = candidate;

  return (
    <Paper withBorder radius="xl" style={{ overflow: 'hidden', borderColor: isDark ? '#334155' : '#e2e8f0' }}>
      {/* Cover gradient */}
      <Box
        h={80}
        style={{
          background: isHired
            ? 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #10b981 100%)'
            : 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #2563eb 100%)',
        }}
      />

      <Box px="xl" pb="xl" pt="md">
        <Group align="flex-start" gap="lg" wrap="nowrap">
          {/* Avatar overlapping cover */}
          <Box style={{ marginTop: -44, flexShrink: 0 }}>
            <Box
              style={{
                borderRadius: 16,
                border: `3px solid ${isDark ? '#1e293b' : '#ffffff'}`,
                display: 'inline-block',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
            >
              <CandidateAvatar
                candidateId={candidate.id}
                firstName={user.first_name}
                lastName={user.last_name}
                size={76}
              />
            </Box>
          </Box>

          {/* Info */}
          <Box style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <Group gap="sm" align="center" wrap="wrap">
              <Title order={2} style={{ fontSize: '1.4rem', color: isDark ? '#f1f5f9' : '#0f172a' }}>
                {user.first_name} {user.last_name}
              </Title>
              {isHired && (
                <Badge
                  color="green"
                  variant="filled"
                  size="md"
                  leftSection={<IconCircleCheck size={13} />}
                  radius="md"
                >
                  {t('candidate.management.header.hiredBadge')}
                </Badge>
              )}
            </Group>

            {candidate.headline && (
              <Text size="sm" fw={500} c="blue.5" mt={2} lineClamp={1}>
                {candidate.headline}
              </Text>
            )}

            <Group gap="md" mt="sm" wrap="wrap">
              <Group gap={5}>
                <IconMail size={14} color={isDark ? '#64748b' : '#94a3b8'} />
                <Text size="xs" c="dimmed">{user.email}</Text>
              </Group>
              {(candidate.city || candidate.country) && (
                <Group gap={5}>
                  <IconMapPin size={14} color={isDark ? '#64748b' : '#94a3b8'} />
                  <Text size="xs" c="dimmed">
                    {[candidate.city, candidate.country].filter(Boolean).join(', ')}
                  </Text>
                </Group>
              )}
            </Group>
          </Box>
        </Group>
      </Box>
    </Paper>
  );
}
