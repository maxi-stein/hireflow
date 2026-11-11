import { Title, Text, Stack, LoadingOverlay, Button, Box, Group } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useJobOffersQuery } from '../hooks/api/useJobOffers';
import { useAppStore } from '../store/useAppStore';
import { JobOfferStatus, type JobOffer } from '../services/job-offer.service';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingHero } from '../components/landing/LandingHero';
import { JobOfferGrid } from '../components/jobs/JobOfferGrid';
import { LandingSection } from '../components/landing/LandingSection';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingCTA } from '../components/landing/LandingCTA';
import { LandingCompanies } from '../components/landing/LandingCompanies';

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
    return <Navigate to={user.type === 'employee' ? '/manage/dashboard' : '/jobs'} replace />;
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
      <LandingFeatures />

      {/* CV Upload CTA Banner */}
      <LandingCTA />

      {/* Allies / Partners Section */}
      <LandingCompanies />
    </Box>
  );
};
