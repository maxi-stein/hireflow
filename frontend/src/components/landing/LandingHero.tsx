import { Stack, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import bgGradient from '../../assets/bg-gradient.png';
import { LandingSection } from './LandingSection';

export const LandingHero = () => {
  const { t } = useTranslation(['jobs']);

  return (
    <LandingSection
      noContainer
      style={{
        color: '#1e293b',
        backgroundImage: `url(${bgGradient})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginTop: 'calc(-1 * var(--mantine-spacing-md))',
        paddingTop: 60,
        paddingBottom: 60,
      }}
    >
      <Stack gap="lg" align="center" ta="center" py={{ base: 40, md: 80 }} px="md">
        <Title
          order={1}
          size="h1"
          style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            lineHeight: 1.1, 
            fontWeight: 900,
            color: '#0f172a'
          }}
        >
          {t('jobs:landing.heroTitle')}
        </Title>
        <Text 
          size="xl" 
          maw={600} 
          style={{ 
            color: '#334155',
            fontWeight: 500
          }}
        >
          {t('jobs:landing.heroSubtitle')}
        </Text>
      </Stack>
    </LandingSection>
  );
};


