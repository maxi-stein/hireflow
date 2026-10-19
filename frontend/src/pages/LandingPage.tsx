import { Title, Text, Stack, LoadingOverlay, Button, Box, Group, SimpleGrid, ThemeIcon, Card, Badge } from '@mantine/core';
import { IconArrowRight, IconUserCheck, IconTargetArrow, IconCalendarEvent, IconFileText, IconSparkles } from '@tabler/icons-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useJobOffersQuery } from '../hooks/api/useJobOffers';
import { useAppStore } from '../store/useAppStore';
import { JobOfferStatus } from '../services/job-offer.service';
import type { JobOffer } from '../services/job-offer.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingHero } from '../components/landing/LandingHero';
import { JobOfferGrid } from '../components/jobs/JobOfferGrid';
import { LandingSection } from '../components/landing/LandingSection';
import googleLogo from '../assets/google.png';
import oracleLogo from '../assets/oracle.png';

export const LandingPage = () => {
  const { t } = useTranslation(['common', 'jobs']);
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  const [page, setPage] = useState(1);

  const { data: jobOffers, isLoading } = useJobOffersQuery({
    status: JobOfferStatus.OPEN,
    page,
    limit: 6,
  });

  const handleApplyClick = (job: JobOffer) => {
    navigate('/login', { state: { from: { pathname: '/jobs', hash: `#job-${job.id}` } } });
  };

  if (user) {
    return <Navigate to={user.type === 'employee' ? "/manage/dashboard" : "/jobs"} replace />;
  }

  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <LandingHero />

      {/* Featured Jobs Section */}
      <LandingSection>
        <Stack gap="xl">
          <Group justify="space-between" align="flex-end" wrap="wrap">
            <div>
              <Text c="blue.6" size="sm" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
                {t('jobs:landing.availableJobs', 'Posiciones Abiertas')}
              </Text>
              <Title order={2} size="h1" c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }} mt={4}>
                {t('jobs:landing.findChallenge', 'Encontrá tu próximo desafío')}
              </Title>
              <Text c="dimmed" size="lg" mt="xs" maw={600}>
                {t('jobs:landing.availableJobsSubtitle', 'Descubrí nuestras ofertas activas y postulá directamente con tu perfil validado.')}
              </Text>
            </div>
            <Button
              variant="light"
              color="blue"
              rightSection={<IconArrowRight size={16} />}
              onClick={() => navigate('/jobs')}
            >
              {t('jobs:landing.viewAllJobs', 'Ver todas las ofertas')}
            </Button>
          </Group>

          <JobOfferGrid
            jobs={jobOffers?.data ?? []}
            renderAction={(job) => (
              <Button
                fullWidth
                variant="filled"
                color="blue"
                onClick={() => handleApplyClick(job)}
              >
                <Text size="sm">{t('applyNow', 'Aplicar ahora')}</Text>
                <IconArrowRight size={14} style={{ marginLeft: '6px' }} />
              </Button>
            )}
            emptyMessage={t('jobs:landing.noJobs', 'No hay ofertas disponibles en este momento')}
            emptySubtitle={t('jobs:landing.noJobsSubtitle', 'Volvé a consultar pronto para ver nuevas vacantes.')}
            page={page}
            totalPages={jobOffers?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </Stack>
      </LandingSection>

      {/* How it Works / Value Proposition */}
      <LandingSection style={{ background: 'light-dark(#f8fafc, #0f172a)', borderTop: '1px solid light-dark(#e2e8f0, #334155)', borderBottom: '1px solid light-dark(#e2e8f0, #334155)' }}>
        <Stack gap="xl" align="center" ta="center">
          <Box maw={640}>
            <Text c="blue.6" size="sm" fw={700} style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t('jobs:landing.howItWorks.tag', 'Proceso transparente')}
            </Text>
            <Title order={2} size="h2" mt={6} c="light-dark(#0f172a, #f8fafc)" style={{ fontWeight: 800 }}>
              {t('jobs:landing.howItWorks.title', '¿Cómo es el proceso de selección?')}
            </Title>
            <Text c="dimmed" size="md" mt="xs">
              {t('jobs:landing.howItWorks.subtitle', 'Diseñado para que puedas destacar tus fortalezas y el equipo de Consultoría Global evalúe tu perfil de forma ágil y transparente.')}
            </Text>
          </Box>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" w="100%" mt="md">
            <Card padding="xl" radius="lg" withBorder style={{ backgroundColor: 'light-dark(#ffffff, #1e293b)', borderColor: 'light-dark(#e2e8f0, #334155)', textAlign: 'left' }}>
              <ThemeIcon size={48} radius="md" color="blue" variant="light" mb="md">
                <IconUserCheck size={26} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
                {t('jobs:landing.howItWorks.step1Title', '1. Perfil completo y verificado')}
              </Text>
              <Text size="sm" c="dimmed" lh={1.6}>
                {t('jobs:landing.howItWorks.step1Desc', 'Registrate, completá tu experiencia previa, educación formal y subí tu CV en PDF para que conozcamos tu trayectoria profesional.')}
              </Text>
            </Card>

            <Card padding="xl" radius="lg" withBorder style={{ backgroundColor: 'light-dark(#ffffff, #1e293b)', borderColor: 'light-dark(#e2e8f0, #334155)', textAlign: 'left' }}>
              <ThemeIcon size={48} radius="md" color="teal" variant="light" mb="md">
                <IconTargetArrow size={26} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
                {t('jobs:landing.howItWorks.step2Title', '2. Match por habilidades reales')}
              </Text>
              <Text size="sm" c="dimmed" lh={1.6}>
                {t('jobs:landing.howItWorks.step2Desc', 'Al postular, indicás tus años reales de experiencia para cada tecnología requerida. Cero algoritmos opacos: coincidencias claras y honestas.')}
              </Text>
            </Card>

            <Card padding="xl" radius="lg" withBorder style={{ backgroundColor: 'light-dark(#ffffff, #1e293b)', borderColor: 'light-dark(#e2e8f0, #334155)', textAlign: 'left' }}>
              <ThemeIcon size={48} radius="md" color="violet" variant="light" mb="md">
                <IconCalendarEvent size={26} />
              </ThemeIcon>
              <Text fw={700} size="lg" mb={8} c="light-dark(#0f172a, #f8fafc)">
                {t('jobs:landing.howItWorks.step3Title', '3. Entrevistas y seguimiento')}
              </Text>
              <Text size="sm" c="dimmed" lh={1.6}>
                {t('jobs:landing.howItWorks.step3Desc', 'Accedé a tus postulaciones, enterate de cada cambio de estado y unite a tus entrevistas programadas desde una única consola.')}
              </Text>
            </Card>
          </SimpleGrid>
        </Stack>
      </LandingSection>

      {/* CV Upload CTA Banner */}
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
          <Text
            size="lg"
            style={{ color: '#cbd5e1', fontWeight: 400, lineHeight: 1.6 }}
          >
            {t('jobs:landing.cvCta.subtitle', 'Creá tu perfil en nuestro portal, subí tu currículum y postulate a las búsquedas de Consultoría Global.')}
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

      {/* Allies / Partners Section */}
      <LandingSection>
        <Stack gap="md" align="center" ta="center">
          <Text size="sm" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: '1px' }}>
            {t('jobs:landing.alliesTitle', 'Partners tecnológicos de Consultoría Global')}
          </Text>
          <Group justify="center" gap="xl" mt="md">
            <img src={googleLogo} alt="Google" style={{ width: 140, height: 42, objectFit: 'contain', opacity: 0.85 }} />
            <img src={oracleLogo} alt="Oracle" style={{ width: 140, height: 42, objectFit: 'contain', opacity: 0.85 }} />
          </Group>
        </Stack>
      </LandingSection>
    </Box>
  );
};
