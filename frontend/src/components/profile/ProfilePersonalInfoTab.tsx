import type { FormEvent } from 'react';
import {
  Paper,
  Title,
  Grid,
  TextInput,
  Button,
  Group,
  Box,
  Divider,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import type { UseFormReturnType } from '@mantine/form';
import {
  IconIdBadge2,
  IconPhone,
  IconCalendarEvent,
  IconMapPin,
  IconWorld,
  IconBrandGithub,
  IconBrandLinkedin,
  IconUser,
} from '@tabler/icons-react';
import type { CandidateProfileFormValues } from '../../hooks/domain/useCandidateProfileForm';

export interface ProfilePersonalInfoTabProps {
  form: UseFormReturnType<CandidateProfileFormValues>;
  loading: boolean;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

export const ProfilePersonalInfoTab = ({
  form,
  loading,
  onSubmit,
}: ProfilePersonalInfoTabProps) => {
  const { t } = useTranslation('profile');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Paper
      withBorder
      shadow="xs"
      p="xl"
      radius="lg"
      bg={isDark ? '#1e293b' : '#ffffff'}
      style={{ borderColor: isDark ? '#334155' : undefined }}
    >
      <Group justify="space-between" mb="lg">
        <Group gap="xs">
          <Box
            p={8}
            bg={isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff'}
            style={{ borderRadius: 10, color: '#2563eb' }}
          >
            <IconUser size={22} />
          </Box>
          <Box>
            <Title order={3} size="h3" style={{ color: isDark ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
              {t('candidate.personalInfo', 'Información Personal & Contacto')}
            </Title>
            <Text size="sm" c="dimmed" mt={2}>
              {t(
                'candidate.personalSubtitle',
                'Actualizá tu información de contacto y enlaces a perfiles profesionales'
              )}
            </Text>
          </Box>
        </Group>
      </Group>

      <form onSubmit={onSubmit}>
        <Grid gutter="md">
          <Grid.Col span={12}>
            <TextInput
              label={t('candidate.headline', 'Titular profesional')}
              placeholder={t(
                'candidate.headlinePlaceholder',
                'Ej. Desarrollador Fullstack React & Node | Especialista Cloud'
              )}
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
  );
};
