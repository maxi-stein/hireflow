import { useState, useMemo } from 'react';
import {
  Paper,
  Title,
  Grid,
  TextInput,
  Button,
  Group,
  Stack,
  FileButton,
  Text,
  Tabs,
  Badge,
  Progress,
  Box,
  Divider,
  useMantineColorScheme,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconUpload,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconEye,
  IconCalendarEvent,
  IconIdBadge2,
  IconBriefcase,
  IconSchool,
  IconUser,
  IconLock,
  IconCheck,
  IconFileText,
  IconCamera,
  IconMapPin,
  IconWorld,
} from '@tabler/icons-react';
import type { User } from '../../types/models/user.types';
import { candidateService } from '../../services/candidate.service';
import { fileService } from '../../services/file.service';
import { queryClient } from '../../services/queryClient';
import { FILES_QUERY_KEY, useCandidateFilesQuery } from '../../hooks/api/useUserFiles';
import { FileType } from '../../services/user-file.service';
import { WorkExperienceSection } from '../../components/profile/WorkExperienceSection';
import { EducationSection } from '../../components/profile/EducationSection';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import { CandidateAvatar } from '../../components/shared/candidate-display/CandidateAvatar';
import { parseLocalDate, formatLocalDate } from '../../utils/dateUtils';

interface CandidateProfileProps {
  user: User;
  refreshProfile: () => void;
}

export const CandidateProfile = ({ user, refreshProfile }: CandidateProfileProps) => {
  const { t } = useTranslation(['profile', 'common']);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { candidate } = user;
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('experience');

  const { data: candidateFiles } = useCandidateFilesQuery(candidate?.id || '');
  const cvFile = candidateFiles?.find((f) => f.file_type === FileType.RESUME) || candidate?.files?.find((f) => f.file_type === 'cv');
  const photoFile = candidateFiles?.find((f) => f.file_type === FileType.PROFILE_PICTURE) || candidate?.files?.find((f) => f.file_type === 'profile_picture');

  const form = useForm({
    initialValues: {
      headline: candidate?.headline || '',
      phone: candidate?.phone || '',
      city: candidate?.city || '',
      country: candidate?.country || '',
      github: candidate?.github || '',
      linkedin: candidate?.linkedin || '',
      date_of_birth: parseLocalDate(candidate?.date_of_birth),
    },
  });

  const handleUpdateProfile = async (values: typeof form.values) => {
    if (!candidate?.id) return;
    setLoading(true);
    try {
      await candidateService.update(candidate.id, {
        headline: values.headline?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        city: values.city?.trim() || undefined,
        country: values.country?.trim() || undefined,
        github: values.github?.trim() || undefined,
        linkedin: values.linkedin?.trim() || undefined,
        date_of_birth: formatLocalDate(values.date_of_birth),
      });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.profileUpdated', 'Perfil actualizado correctamente'),
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      refreshProfile();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.updateFailed', 'Error al actualizar el perfil'),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file: File | null) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Archivo muy grande'),
        message: t('candidate.notifications.fileTooLarge', 'La foto no debe superar los 5MB'),
        color: 'red',
      });
      return;
    }
    setUploadingPhoto(true);
    try {
      await fileService.uploadProfilePicture(file);
      queryClient.invalidateQueries({ queryKey: [...FILES_QUERY_KEY, 'candidate', candidate?.id] });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.picitureUploaded', 'Foto de perfil actualizada'),
        color: 'green',
      });
      refreshProfile();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.uploadPhotoFailed', 'Error al subir la foto'),
        color: 'red',
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCVUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingCV(true);
    try {
      await fileService.uploadCV(file);
      queryClient.invalidateQueries({ queryKey: [...FILES_QUERY_KEY, 'candidate', candidate?.id] });
      notifications.show({
        title: t('candidate.notifications.successTitle', 'Éxito'),
        message: t('candidate.notifications.cvUploaded', 'Currículum cargado correctamente'),
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      refreshProfile();
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.uploadCvFailed', 'Error al subir el CV'),
        color: 'red',
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleViewCV = async () => {
    if (!cvFile) return;
    try {
      const blob = await fileService.downloadFile(cvFile.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      notifications.show({
        title: t('candidate.notifications.errorTitle', 'Error'),
        message: t('candidate.notifications.openCvFailed', 'No se pudo abrir el CV'),
        color: 'red',
      });
    }
  };

  // Calculate profile completeness score
  // Required components: CV (34%), Profile Photo (33%), Personal Data (33%).
  // Education and Work Experience are optional.
  const completeness = useMemo(() => {
    let score = 0;
    const hasCV = Boolean(cvFile);
    const hasPhoto = Boolean(photoFile);
    const hasPersonal = Boolean(
      user.first_name &&
      user.last_name &&
      candidate?.phone &&
      candidate?.headline &&
      (candidate?.city || candidate?.country)
    );

    if (hasCV) score += 34;
    if (hasPhoto) score += 33;
    if (hasPersonal) score += 33;
    if (hasCV && hasPhoto && hasPersonal) score = 100;

    const checks = [
      { label: t('candidate.completenessCV', 'CV en formato PDF'), done: hasCV, weight: '34%' },
      { label: t('candidate.completenessPhoto', 'Foto de perfil'), done: hasPhoto, weight: '33%' },
      { label: t('candidate.completenessPersonal', 'Datos personales y contacto'), done: hasPersonal, weight: '33%' },
    ];

    return { score: Math.min(score, 100), checks };
  }, [candidate, cvFile, photoFile, user, t]);

  return (
    <Stack gap="xl">
      {/* Top Profile Header Card */}
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
                  onChange={handlePhotoUpload}
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

              {/* Candidate Info text is completely visible and unobstructed */}
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
                      onClick={handleViewCV}
                      style={{ flex: 1 }}
                    >
                      {t('candidate.viewResume', 'Ver CV')}
                    </Button>
                    <FileButton onChange={handleCVUpload} accept="application/pdf">
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
                  <FileButton onChange={handleCVUpload} accept="application/pdf">
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

          {/* Profile Completeness Bar */}
          <Box mt="lg" pt="md" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
            <Group justify="space-between" align="center" mb="xs" wrap="wrap" gap="sm">
              <Group gap="sm" wrap="wrap">
                <Text size="sm" fw={700} c={isDark ? '#f8fafc' : '#0f172a'}>
                  {t('candidate.completenessTitle', { score: completeness.score, defaultValue: `Completitud del perfil: ${completeness.score}%` })}
                </Text>
                <Group gap="xs" wrap="wrap">
                  {completeness.checks.map((chk) => (
                    <Badge
                      key={chk.label}
                      size="lg"
                      radius="md"
                      variant={chk.done ? 'light' : 'outline'}
                      color={chk.done ? 'teal' : 'gray'}
                      leftSection={chk.done ? <IconCheck size={14} /> : undefined}
                      styles={{
                        root: {
                          textTransform: 'none',
                        },
                        label: {
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                        },
                      }}
                    >
                      {chk.label}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Text size="sm" c={completeness.score === 100 ? 'teal' : 'blue.6'} fw={600}>
                {completeness.score === 100
                  ? t('candidate.completenessComplete', '¡Perfil completo! Foto, datos de contacto y CV listos.')
                  : t('candidate.completenessIncomplete', 'Completá tu foto, datos personales y CV para maximizar tu visibilidad.')}
              </Text>
            </Group>
            <Progress
              value={completeness.score}
              color={completeness.score === 100 ? 'teal' : 'blue'}
              size="md"
              radius="xl"
            />
            <Text size="sm" c={isDark ? '#94a3b8' : '#64748b'} mt={8} fw={500}>
              {t('candidate.optionalNotice', '* La experiencia laboral y educación son opcionales y pueden agregarse desde sus respectivas pestañas.')}
            </Text>
          </Box>
        </Box>
      </Paper>

      {/* Main Profile Tabs */}
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
            {t('candidate.tabs.security', 'Seguridad')}
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab 1: Work Experience */}
        <Tabs.Panel value="experience">
          {candidate?.id && (
            <WorkExperienceSection
              candidateId={candidate.id}
              experiences={candidate.work_experiences || []}
              onUpdate={refreshProfile}
            />
          )}
        </Tabs.Panel>

        {/* Tab 2: Education */}
        <Tabs.Panel value="education">
          {candidate?.id && (
            <EducationSection
              candidateId={candidate.id}
              educationList={candidate.educations || []}
              onUpdate={refreshProfile}
            />
          )}
        </Tabs.Panel>

        {/* Tab 3: Personal Information Form */}
        <Tabs.Panel value="personal">
          <Paper withBorder shadow="xs" p="xl" radius="lg" bg={isDark ? '#1e293b' : '#ffffff'} style={{ borderColor: isDark ? '#334155' : undefined }}>
            <Group justify="space-between" mb="lg">
              <Group gap="xs">
                <Box p={8} bg={isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff'} style={{ borderRadius: 10, color: '#2563eb' }}>
                  <IconUser size={22} />
                </Box>
                <Box>
                  <Title order={3} size="h3" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                    {t('candidate.personalInfo', 'Información Personal & Contacto')}
                  </Title>
                  <Text size="sm" c="dimmed" mt={2}>
                    {t('candidate.personalSubtitle', 'Actualizá tu información de contacto y enlaces a perfiles profesionales')}
                  </Text>
                </Box>
              </Group>
            </Group>

            <form onSubmit={form.onSubmit(handleUpdateProfile)}>
              <Grid gutter="md">
                <Grid.Col span={12}>
                  <TextInput
                    label={t('candidate.headline', 'Titular profesional')}
                    placeholder={t('candidate.headlinePlaceholder', 'Ej. Desarrollador Fullstack React & Node | Especialista Cloud')}
                    leftSection={<IconIdBadge2 size={16} />}
                    maxLength={120}
                    {...form.getInputProps('headline')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={t('candidate.phone', 'Teléfono de contacto')}
                    placeholder={t('candidate.phonePlaceholder', '+54 9 11 1234-5678')}
                    leftSection={<IconPhone size={16} />}
                    {...form.getInputProps('phone')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <DatePickerInput
                    label={t('candidate.dateOfBirth', 'Fecha de nacimiento')}
                    placeholder="YYYY-MM-DD"
                    leftSection={<IconCalendarEvent size={16} />}
                    valueFormat="YYYY-MM-DD"
                    {...form.getInputProps('date_of_birth')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={t('candidate.city', 'Ciudad')}
                    placeholder={t('candidate.cityPlaceholder', 'Ej. Buenos Aires, Córdoba, Rosario...')}
                    leftSection={<IconMapPin size={16} />}
                    {...form.getInputProps('city')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={t('candidate.country', 'País')}
                    placeholder={t('candidate.countryPlaceholder', 'Ej. Argentina')}
                    leftSection={<IconWorld size={16} />}
                    {...form.getInputProps('country')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={t('candidate.github', 'Perfil de GitHub')}
                    leftSection={<IconBrandGithub size={16} />}
                    placeholder={t('candidate.githubPlaceholder', 'https://github.com/tu-usuario')}
                    {...form.getInputProps('github')}
                  />
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label={t('candidate.linkedin', 'Perfil de LinkedIn')}
                    leftSection={<IconBrandLinkedin size={16} />}
                    placeholder={t('candidate.linkedinPlaceholder', 'https://linkedin.com/in/tu-perfil')}
                    {...form.getInputProps('linkedin')}
                  />
                </Grid.Col>

                <Grid.Col span={12}>
                  <Divider my="sm" />
                  <Group justify="flex-end">
                    <Button type="submit" color="blue" loading={loading} style={{ fontWeight: 700 }}>
                      {t('candidate.saveChanges', 'Guardar cambios')}
                    </Button>
                  </Group>
                </Grid.Col>
              </Grid>
            </form>
          </Paper>
        </Tabs.Panel>

        {/* Tab 4: Security & Password */}
        <Tabs.Panel value="security">
          <Paper withBorder shadow="xs" p="xl" radius="lg" bg={isDark ? '#1e293b' : '#ffffff'} style={{ borderColor: isDark ? '#334155' : undefined }} maw={640}>
            <Group gap="xs" mb="lg">
              <Box p={8} bg={isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2'} style={{ borderRadius: 10, color: '#dc2626' }}>
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
