import { Stack, Text, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { LandingSection } from './LandingSection';
import googleLogo from '../../assets/google.png';
import oracleLogo from '../../assets/oracle.png';

export function LandingCompanies() {
  const { t } = useTranslation(['jobs']);

  return (
    <LandingSection>
      <Stack gap="md" align="center" ta="center">
        <Text size="sm" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '1px' }}>
          {t('jobs:landing.alliesTitle', 'Partners tecnológicos de Consultoría Global')}
        </Text>
        <Group justify="center" gap="xl" mt="md">
          <img
            src={googleLogo}
            alt="Google"
            style={{ width: 140, height: 42, objectFit: 'contain', opacity: 0.85 }}
          />
          <img
            src={oracleLogo}
            alt="Oracle"
            style={{ width: 140, height: 42, objectFit: 'contain', opacity: 0.85 }}
          />
        </Group>
      </Stack>
    </LandingSection>
  );
}

