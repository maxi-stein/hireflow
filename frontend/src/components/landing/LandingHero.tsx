import { Box, Stack, Title, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { APP_MAX_WIDTH } from '../../constants/layout';

export const LandingHero = () => {
  const { t } = useTranslation(['jobs']);

  return (
    <Box
      mx="auto"
      py={{ base: 60, md: 100 }}
      px={{ base: 'md', md: 'xl' }}
      style={{
        color: 'white',
        background: 'linear-gradient(135deg, var(--mantine-color-blue-filled) 0%, var(--mantine-color-cyan-filled) 100%)',
        maxWidth: APP_MAX_WIDTH,
        borderRadius: 'var(--mantine-radius-lg)',
      }}
    >
      <Stack gap="lg" align="center" ta="center">
        <Title
          order={1}
          size="h1"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.1, fontWeight: 900 }}
        >
          {t('jobs:landing.heroTitle')}
        </Title>
        <Text size="xl" maw={600} opacity={0.9}>
          {t('jobs:landing.heroSubtitle')}
        </Text>
      </Stack>
    </Box>
  );
};
