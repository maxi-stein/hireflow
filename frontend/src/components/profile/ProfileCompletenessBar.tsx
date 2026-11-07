import { Box, Group, Text, Badge, Progress, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconCheck } from '@tabler/icons-react';
import type { CandidateProfileCompleteness } from '../../hooks/domain/useCandidateProfileCompleteness';

export interface ProfileCompletenessBarProps {
  completeness: CandidateProfileCompleteness;
}

export const ProfileCompletenessBar = ({ completeness }: ProfileCompletenessBarProps) => {
  const { t } = useTranslation('profile');
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box mt="lg" pt="md" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
      <Group justify="space-between" align="center" mb="xs" wrap="wrap" gap="sm">
        <Group gap="sm" wrap="wrap">
          <Text size="sm" fw={700} c={isDark ? '#f8fafc' : '#0f172a'}>
            {t('candidate.completenessTitle', {
              score: completeness.score,
              defaultValue: `Completitud del perfil: ${completeness.score}%`,
            })}
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
        {t(
          'candidate.optionalNotice',
          '* La experiencia laboral y educación son opcionales y pueden agregarse desde sus respectivas pestañas.'
        )}
      </Text>
    </Box>
  );
};

