import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, Title, Text, Badge, Group, ThemeIcon } from '@mantine/core';
import {
  IconArrowLeft,
  IconSparkles,
  IconBriefcase,
  IconShieldCheck,
  IconClock,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { AppLogo } from '../shared/AppLogo';

export const RegisterShowcaseBanner: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <Box
      display={{ base: 'none', md: 'flex' }}
      style={{
        flex: '0 0 50%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, #0b132b 0%, #1c2541 50%, #1e3a8a 100%)',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem',
        color: '#ffffff',
      }}
    >
      {/* Ambient background glows */}
      <Box
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-15%',
          width: '600px',
          height: '600px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.28) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top bar with logo and back */}
      <Group justify="space-between" align="center" style={{ position: 'relative', zIndex: 2 }}>
        <Box
          style={{
            backgroundColor: '#ffffff',
            padding: '6px 14px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'inline-flex',
          }}
        >
          <AppLogo h={36} />
        </Box>
        <Button
          variant="subtle"
          color="gray"
          size="sm"
          leftSection={<IconArrowLeft size={16} />}
          style={{ color: '#cbd5e1' }}
          onClick={() => navigate('/')}
        >
          {t('registerPage.backToHome', 'Volver al inicio')}
        </Button>
      </Group>

      {/* Showcase benefits */}
      <Stack gap="xl" maw={480} my="auto" style={{ position: 'relative', zIndex: 2 }}>
        <Badge
          size="lg"
          radius="xl"
          color="blue"
          variant="filled"
          leftSection={<IconSparkles size={14} />}
          style={{ width: 'fit-content' }}
        >
          {t('registerPage.showcaseBadge', 'Registro de Candidato')}
        </Badge>

        <Title
          order={1}
          style={{
            fontSize: 'clamp(2rem, 3vw, 2.6rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}
        >
          {t('registerPage.showcaseTitle', 'Sumate al equipo de Consultoría Global.')}
        </Title>

        <Stack gap="md" mt="sm">
          <Group gap="md" align="flex-start" wrap="nowrap">
            <ThemeIcon size={36} radius="md" color="blue" variant="light">
              <IconBriefcase size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="sm" c="#ffffff">
                {t('registerPage.perk1Title', 'Perfil profesional unificado')}
              </Text>
              <Text size="xs" c="gray.3" lh={1.5}>
                {t(
                  'registerPage.perk1Desc',
                  'Cargá tus datos personales, foto y CV en un solo lugar para el equipo de Consultoría Global.'
                )}
              </Text>
            </Box>
          </Group>

          <Group gap="md" align="flex-start" wrap="nowrap">
            <ThemeIcon size={36} radius="md" color="teal" variant="light">
              <IconShieldCheck size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="sm" c="#ffffff">
                {t('registerPage.perk2Title', 'Evaluación justa y transparente')}
              </Text>
              <Text size="xs" c="gray.3" lh={1.5}>
                {t(
                  'registerPage.perk2Desc',
                  'Completás tus años reales de experiencia por cada habilidad requerida por el puesto.'
                )}
              </Text>
            </Box>
          </Group>

          <Group gap="md" align="flex-start" wrap="nowrap">
            <ThemeIcon size={36} radius="md" color="violet" variant="light">
              <IconClock size={20} />
            </ThemeIcon>
            <Box>
              <Text fw={700} size="sm" c="#ffffff">
                {t('registerPage.perk3Title', 'Seguimiento en tiempo real')}
              </Text>
              <Text size="xs" c="gray.3" lh={1.5}>
                {t(
                  'registerPage.perk3Desc',
                  'Conocé el avance de cada proceso y recibí enlaces directos a tus entrevistas programadas.'
                )}
              </Text>
            </Box>
          </Group>
        </Stack>
      </Stack>

      <Text size="xs" c="gray.4" style={{ position: 'relative', zIndex: 2 }}>
        {t('registerPage.copyright', {
          year: new Date().getFullYear(),
          defaultValue: `© ${new Date().getFullYear()} HireFlow · Consultoría Global. Todos los derechos reservados.`,
        })}
      </Text>
    </Box>
  );
};

