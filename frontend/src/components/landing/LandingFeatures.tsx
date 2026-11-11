import { Stack, Box, Text, Title, SimpleGrid, Card, ThemeIcon } from '@mantine/core';
import { IconUserCheck, IconTargetArrow, IconCalendarEvent } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { LandingSection } from './LandingSection';

export function LandingFeatures() {
  const { t } = useTranslation(['jobs']);

  return (
    <LandingSection
      style={{
        background: 'light-dark(#f8fafc, #0f172a)',
        borderTop: '1px solid light-dark(#e2e8f0, #334155)',
        borderBottom: '1px solid light-dark(#e2e8f0, #334155)',
      }}
    >
      <Stack gap="xl" align="center" ta="center">
        <Box maw={640}>
          <Text c="blue.6" size="sm" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('jobs:landing.howItWorks.tag', 'Proceso transparente')}
          </Text>
          <Title order={2} size="h2" mt={6} c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
            {t('jobs:landing.howItWorks.title', '¿Cómo es el proceso de selección?')}
          </Title>
          <Text c="dimmed" size="md" mt="xs">
            {t(
              'jobs:landing.howItWorks.subtitle',
              'Diseñado para que puedas destacar tus fortalezas y el equipo de Consultoría Global evalúe tu perfil de forma ágil y transparente.'
            )}
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" w="100%" mt="md">
          <Card
            padding="xl"
            radius="lg"
            withBorder
            style={{
              backgroundColor: 'light-dark(#ffffff, #1e293b)',
              borderColor: 'light-dark(#e2e8f0, #334155)',
              textAlign: 'left',
            }}
          >
            <ThemeIcon size={48} radius="md" color="blue" variant="light" mb="md">
              <IconUserCheck size={26} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
              {t('jobs:landing.howItWorks.step1Title', '1. Perfil completo y verificado')}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
              {t(
                'jobs:landing.howItWorks.step1Desc',
                'Registrate, completá tu experiencia previa, educación formal y subí tu CV en PDF para que conozcamos tu trayectoria profesional.'
              )}
            </Text>
          </Card>

          <Card
            padding="xl"
            radius="lg"
            withBorder
            style={{
              backgroundColor: 'light-dark(#ffffff, #1e293b)',
              borderColor: 'light-dark(#e2e8f0, #334155)',
              textAlign: 'left',
            }}
          >
            <ThemeIcon size={48} radius="md" color="teal" variant="light" mb="md">
              <IconTargetArrow size={26} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
              {t('jobs:landing.howItWorks.step2Title', '2. Match por habilidades reales')}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
              {t(
                'jobs:landing.howItWorks.step2Desc',
                'Al postular, indicás tus años reales de experiencia para cada tecnología requerida. Cero algoritmos opacos: coincidencias claras y honestas.'
              )}
            </Text>
          </Card>

          <Card
            padding="xl"
            radius="lg"
            withBorder
            style={{
              backgroundColor: 'light-dark(#ffffff, #1e293b)',
              borderColor: 'light-dark(#e2e8f0, #334155)',
              textAlign: 'left',
            }}
          >
            <ThemeIcon size={48} radius="md" color="violet" variant="light" mb="md">
              <IconCalendarEvent size={26} />
            </ThemeIcon>
            <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
              {t('jobs:landing.howItWorks.step3Title', '3. Entrevistas y seguimiento')}
            </Text>
            <Text size="sm" c="dimmed" lh={1.6}>
              {t(
                'jobs:landing.howItWorks.step3Desc',
                'Accedé a tus postulaciones, enterate de cada cambio de estado y unite a tus entrevistas programadas desde una única consola.'
              )}
            </Text>
          </Card>
        </SimpleGrid>
      </Stack>
    </LandingSection>
  );
}

