import type { ReactNode } from 'react';
import {
  Paper,
  Title,
  Button,
  Group,
  Stack,
  FileButton,
  Text,
  Badge,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconUpload,
  IconEye,
  IconFileText,
  IconCamera,
  IconMapPin,
  IconMail,
  IconPhone,
} from '@tabler/icons-react';
import { CandidateAvatar } from '../shared/candidate-display/CandidateAvatar';
import type { User, Candidate } from '../../types/models/user.types';
import type { CandidateFileItem } from '../../hooks/domain/useCandidateFilesManager';

export interface ProfileHeaderCardProps {
  user: User;
  candidate?: Candidate | null;
  cvFile?: CandidateFileItem | null;
  uploadingPhoto: boolean;
  uploadingCV: boolean;
  onPhotoUpload: (file: File | null) => void;
  onCVUpload: (file: File | null) => void;
  onViewCV: () => void;
  children?: ReactNode;
}

export const ProfileHeaderCard = ({
  user,
  candidate,
  cvFile,
  uploadingPhoto,
  uploadingCV,
  onPhotoUpload,
  onCVUpload,
  onViewCV,
  children,
}: ProfileHeaderCardProps) => {
  const { t } = useTranslation('profile');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Paper
      withBorder
      radius="xl"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 20px -2px rgba(0, 0, 0, 0.4)' : '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}
    >
      {/* Decorative Cover Gradient */}
      <Box
        h={110}
        style={{
          background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #2563eb 100%)',
          position: 'relative',
        }}
      />

      {/* Profile Info Row */}
      <Box px={{ base: 'md', md: 'xl' }} pb="xl" pt="md">
        <Group
          justify="space-between"
          align="flex-start"
          wrap="wrap"
          gap="xl"
        >
          {/* Avatar & Basic Info */}
          <Group align="flex-start" gap="lg" wrap="wrap" style={{ flex: 1, minWidth: 280 }}>
            {/* Only the Avatar pops up over the banner with outline ring */}
            <Box style={{ position: 'relative', marginTop: -54, zIndex: 2 }}>
              <Box style={{ borderRadius: 20, border: `4px solid ${isDark ? '#1e293b' : '#ffffff'}`, display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
                <CandidateAvatar
                  candidateId={candidate?.id}
                  firstName={user.first_name}
                  lastName={user.last_name}
                  size={96}
                />
              </Box>
              <FileButton
                onChange={onPhotoUpload}
                accept="image/png,image/jpeg,image/jpg,image/webp"
              >
                {(props) => (
                  <Button
                    size="compact-xs"
                    radius="xl"
                    variant="filled"
                    color="blue"
                    loading={uploadingPhoto}
                    leftSection={<IconCamera size={12} />}
                    style={{
                      position: 'absolute',
                      bottom: 4,
                      right: 4,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                    {...props}
                  >
                    {t('candidate.photoButton', 'Foto')}
                  </Button>
                )}
              </FileButton>
            </Box>

            {/* Candidate Info text */}
            <Box style={{ flex: 1, minWidth: 220 }}>
              <Group gap="xs" align="center">
                <Title order={1} size="h2" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                  {user.first_name} {user.last_name}
                </Title>
                <Badge size="sm" color="blue" variant="light">
                  {t('candidate.badge', 'Candidato')}
                </Badge>
              </Group>
              <Text fw={600} size="md" c={candidate?.headline ? (isDark ? "blue.4" : "blue.7") : "dimmed"} mt={4}>
                {candidate?.headline || t('candidate.noHeadlinePrompt', 'Completá tu titular profesional (ej. Desarrollador Fullstack)')}
              </Text>

              <Group gap="md" mt="sm" wrap="wrap">
                <Group gap={6}>
                  <IconMail size={16} color={isDark ? "#94a3b8" : "#64748b"} />
                  <Text size="sm" c="dimmed">{user.email}</Text>
                </Group>
                {candidate?.phone && (
                  <Group gap={6}>
                    <IconPhone size={16} color={isDark ? "#94a3b8" : "#64748b"} />
                    <Text size="sm" c="dimmed">{candidate.phone}</Text>
                  </Group>
                )}
                {(candidate?.city || candidate?.country) && (
                  <Group gap={6}>
                    <IconMapPin size={16} color={isDark ? "#94a3b8" : "#64748b"} />
                    <Text size="sm" c="dimmed">
                      {[candidate.city, candidate.country].filter(Boolean).join(', ')}
                    </Text>
                  </Group>
                )}
              </Group>
            </Box>
          </Group>

          {/* CV Action Widget */}
          <Paper p="md" radius="lg" withBorder bg={isDark ? '#0f172a' : '#f8fafc'} style={{ borderColor: isDark ? '#334155' : '#e2e8f0', minWidth: 280, maxWidth: 360, width: '100%' }}>
            <Group justify="space-between" align="center" mb={6}>
              <Group gap={6}>
                <IconFileText size={18} color="#2563eb" />
                <Text size="sm" fw={700} c={isDark ? '#f8fafc' : '#0f172a'}>
                  {t('candidate.cvTitle', 'Currículum Vitae')}
                </Text>
              </Group>
              {cvFile && (
                <Badge size="sm" color="teal" variant="light">
                  {t('candidate.cvLoaded', 'Cargado')}
                </Badge>
              )}
            </Group>

            {cvFile ? (
              <Stack gap={6}>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {cvFile.file_name}
                </Text>
                <Group gap="xs">
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    leftSection={<IconEye size={14} />}
                    onClick={onViewCV}
                    style={{ flex: 1 }}
                  >
                    {t('candidate.viewResume', 'Ver CV')}
                  </Button>
                  <FileButton onChange={onCVUpload} accept="application/pdf">
                    {(props) => (
                      <Button
                        size="xs"
                        variant="default"
                        loading={uploadingCV}
                        {...props}
                      >
                        {t('candidate.replaceCV', 'Reemplazar')}
                      </Button>
                    )}
                  </FileButton>
                </Group>
              </Stack>
            ) : (
              <Stack gap={6}>
                <Text size="sm" c="dimmed" lh={1.5}>
                  {t('candidate.cvUploadPrompt', 'Subí tu CV en formato PDF para facilitar el contacto de reclutadores.')}
                </Text>
                <FileButton onChange={onCVUpload} accept="application/pdf">
                  {(props) => (
                    <Button
                      size="xs"
                      variant="filled"
                      color="blue"
                      fullWidth
                      leftSection={<IconUpload size={14} />}
                      loading={uploadingCV}
                      {...props}
                    >
                      {t('candidate.cvUploadButton', 'Subir CV en PDF')}
                    </Button>
                  )}
                </FileButton>
              </Stack>
            )}
          </Paper>
        </Group>

        {children}
      </Box>
    </Paper>
  );
};

