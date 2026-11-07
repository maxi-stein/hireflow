import { useState } from 'react';
import {
  Paper,
  Title,
  Group,
  Stack,
  Text,
  Tabs,
  Badge,
  Box,
  useMantineColorScheme,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconBriefcase,
  IconSchool,
  IconUser,
  IconLock,
} from '@tabler/icons-react';
import type { User } from '../../types/models/user.types';
import { WorkExperienceSection } from '../../components/profile/WorkExperienceSection';
import { EducationSection } from '../../components/profile/EducationSection';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import { ProfileHeaderCard } from '../../components/profile/ProfileHeaderCard';
import { ProfileCompletenessBar } from '../../components/profile/ProfileCompletenessBar';
import { ProfilePersonalInfoTab } from '../../components/profile/ProfilePersonalInfoTab';
import { useCandidateProfileCompleteness } from '../../hooks/domain/useCandidateProfileCompleteness';
import { useCandidateProfileForm } from '../../hooks/domain/useCandidateProfileForm';
import { useCandidateFilesManager } from '../../hooks/domain/useCandidateFilesManager';

interface CandidateProfileProps {
  user: User;
  refreshProfile: () => void;
}

export const CandidateProfile = ({ user, refreshProfile }: CandidateProfileProps) => {
  const { t } = useTranslation('profile');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { candidate } = user;
  const [activeTab, setActiveTab] = useState<string | null>('experience');

  const {
    cvFile,
    photoFile,
    uploadingPhoto,
    uploadingCV,
    handlePhotoUpload,
    handleCVUpload,
    handleViewCV,
  } = useCandidateFilesManager({
    candidate,
    onProfileUpdated: refreshProfile,
  });

  const completeness = useCandidateProfileCompleteness({
    user,
    candidate,
    hasCV: Boolean(cvFile),
    hasPhoto: Boolean(photoFile),
  });

  const { form, loading, handleSubmit } = useCandidateProfileForm({
    candidate,
    onProfileUpdated: refreshProfile,
  });

  return (
    <Stack gap="xl">
      <ProfileHeaderCard
        user={user}
        candidate={candidate}
        cvFile={cvFile}
        uploadingPhoto={uploadingPhoto}
        uploadingCV={uploadingCV}
        onPhotoUpload={handlePhotoUpload}
        onCVUpload={handleCVUpload}
        onViewCV={handleViewCV}
      >
        <ProfileCompletenessBar completeness={completeness} />
      </ProfileHeaderCard>

      <Tabs value={activeTab} onChange={setActiveTab} radius="md" color="blue">
        <Tabs.List style={{ borderBottom: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`, marginBottom: 24 }}>
          <Tabs.Tab
            value="experience"
            leftSection={<IconBriefcase size={18} />}
            rightSection={
              <Badge size="xs" circle color="blue">
                {candidate?.work_experiences?.length || 0}
              </Badge>
            }
            style={{ fontWeight: 700, fontSize: '0.95rem' }}
          >
            {t('candidate.tabs.experience', 'Experiencia Laboral')}
          </Tabs.Tab>

          <Tabs.Tab
            value="education"
            leftSection={<IconSchool size={18} />}
            rightSection={
              <Badge size="xs" circle color="green">
                {candidate?.educations?.length || 0}
              </Badge>
            }
            style={{ fontWeight: 700, fontSize: '0.95rem' }}
          >
            {t('candidate.tabs.education', 'Educación & Formación')}
          </Tabs.Tab>

          <Tabs.Tab
            value="personal"
            leftSection={<IconUser size={18} />}
            style={{ fontWeight: 700, fontSize: '0.95rem' }}
          >
            {t('candidate.tabs.personal', 'Datos Personales')}
          </Tabs.Tab>

          <Tabs.Tab
            value="security"
            leftSection={<IconLock size={18} />}
            style={{ fontWeight: 700, fontSize: '0.95rem' }}
          >
            {t('candidate.tabs.security', 'Cambiar Contraseña')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="experience">
          {candidate?.id && (
            <WorkExperienceSection
              candidateId={candidate.id}
              experiences={candidate.work_experiences || []}
              onUpdate={refreshProfile}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="education">
          {candidate?.id && (
            <EducationSection
              candidateId={candidate.id}
              educationList={candidate.educations || []}
              onUpdate={refreshProfile}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="personal">
          <ProfilePersonalInfoTab
            form={form}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </Tabs.Panel>

        <Tabs.Panel value="security">
          <Paper
            withBorder
            shadow="xs"
            p="xl"
            radius="lg"
            bg={isDark ? '#1e293b' : '#ffffff'}
            style={{ borderColor: isDark ? '#334155' : undefined }}
            maw={640}
          >
            <Group gap="xs" mb="lg">
              <Box
                p={8}
                bg={isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2'}
                style={{ borderRadius: 10, color: '#dc2626' }}
              >
                <IconLock size={22} />
              </Box>
              <Box>
                <Title order={3} size="h3" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                  {t('candidate.tabs.security', 'Cambiar Contraseña')}
                </Title>
                <Text size="sm" c="dimmed" mt={2}>
                  {t('candidate.securitySubtitle', 'Actualizá tu contraseña para mantener tu cuenta protegida')}
                </Text>
              </Box>
            </Group>
            <ChangePasswordForm withPaper={false} />
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};
