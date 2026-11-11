import { Stack, Box, Badge, Title, Text, Group, Button } from '@mantine/core';
import { IconSparkles, IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LandingSection } from './LandingSection';

export function LandingCTA() {
  const { t } = useTranslation(['jobs']);
  const navigate = useNavigate();

  return (
    <LandingSection
      style={{
        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #1e3a8a 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Stack gap="lg" align="center" ta="center" maw={720} mx="auto" style={{ position: 'relative', zIndex: 1 }}>
        <Badge size="lg" radius="xl" color="blue" variant="filled" leftSection={<IconSparkles size={14} />}>
          {t('jobs:landing.cvCta.badge', 'Oportunidades de carrera')}
        </Badge>
        <Title
          order={2}
          style={{
            color: '#ffffff',
            fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            lineHeight: 1.2,
          }}
        >
          {t('jobs:landing.cvCta.title', '¿Buscás dar tu próximo gran salto laboral?')}
        </Title>
        <Text size="lg" style={{ color: '#cbd5e1', fontWeight: 400, lineHeight: 1.6 }}>
          {t(
            'jobs:landing.cvCta.subtitle',
            'Creá tu perfil en nuestro portal, subí tu currículum y postulate a las búsquedas de Consultoría Global.'
          )}
        </Text>
        <Group gap="md" mt="sm">
          <Button
            size="lg"
            radius="xl"
            variant="white"
            color="dark"
            leftSection={<IconFileText size={20} />}
            style={{ fontWeight: 700, paddingLeft: 28, paddingRight: 28 }}
            onClick={() => navigate('/login', { state: { from: { pathname: '/profile' } } })}
          >
            {t('jobs:landing.cvCta.button', 'Completar mi perfil')}
          </Button>
          <Button
            size="lg"
            radius="xl"
            variant="outline"
            color="white"
            style={{ fontWeight: 600, borderColor: 'rgba(255, 255, 255, 0.4)' }}
            onClick={() => navigate('/jobs')}
          >
            {t('jobs:landing.cvCta.exploreButton', 'Explorar vacantes')}
          </Button>
        </Group>
      </Stack>
    </LandingSection>
  );
}

